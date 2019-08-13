// 错误上报
// 请求体{
//     time: '2019-01-01 00:00:00'
//     message: '错误信息',
//     stack: '调用栈',
//     location: '10:10',
//     file: 'xxx.com/1.js'
//     url: 'xxx.com'
// }
/**
 * @description 错误日志上报
 * 
 * @return {OBject}
 *  @method setConfig
 *  @method fetchTo
 * 
 */
;(function() {
    var config = {
        api: '/api/v1/error-report',
        user_id: "",
        app_name: '',
        call_name: ''
    }

    var setConfig = function(data) {
        if (typeof data !== 'object') return;
        for (var i in data) {
            config[i] = data[i]
        }
    };

    var rate = (function() {
        var errorPool = {};     // 错误池
        var errorCount = 5;     // 限次数
        var errorIntervalTime = 1000 * 1 * 60 * 5;  // 限时间, 同一个错误, 5分钟内

        // 获取key
        var obtainMsgKey = function(msg) {
            msg = msg || '';
            return generateSign(msg.replace(/\s+/g, ''));
        };

        var selectiveComp = function(str) {
            str = str.replace(/\/\\*/g, '')
            if (str.length > 140) {
                str = str.slice(0, 60) + str.slice(90, 130)
            }
            return str;
        };

        // 生成签名
        var generateSign = function(value) {
            if (!value) return value;
            if (typeof hex_md5 !== 'function') {
                return selectiveComp(value);
            }
            return hex_md5(value);
        };

        var add = function(options) {
            var msgKey = obtainMsgKey(options.message);

            // 初始化首次错误池的记录
            if (!errorPool[msgKey]) {
                errorPool[msgKey] = {
                    timeStamp: Date.now(),
                    count: 1
                };
                return true;
            }

            // 限频率
            var oError = errorPool[msgKey];
            if (Date.now() - oError.timeStamp < errorIntervalTime) return false

            oError.timeStamp = Date.now();
            oError.count++;

            // 限次数
            if (oError.count > errorCount) return false;
            return true;
        };

        return {
            add: add
        }
    })();

    // 匹配出域名资源和文件
    var regx = /\:\/\/(.+)(\/)(\S*)(\))/;

    var filterEmpty = function(o) {
        for (var i in o) {
            if (o[i] === '' || o[i] === null || o[i] === undefined || o[i] === 'undefined' || o[i] === 'null') {
                delete o[i];
            }
        }
        return o;
    };

    var generateTime = function() {
        var time = new Date(),
            timeFormat = function(num) {
                if (num < 10) return "0" + num;
                return num;
            },
            day = time.getFullYear() + "-" + timeFormat(time.getMonth() + 1) + "-" + timeFormat(time.getDate()),
            getMilliseconds = time.getMilliseconds(),
            hours = time.toTimeString().slice(0, 8);

        return day + " " + hours + " " + getMilliseconds;
    };

    var fetchTo = function(url, o) {
        url = url || "";
        o = o || {};
        var xhr = new XMLHttpRequest, sendData = {}, i,
            options = {
                type	: o.type || "POST",
                data	: o.data || {},
                success	: o.success || function(){},
                error	: o.error || function(){}
            };

        if (!url) return;
        // for (i in options.data) {
        //     sendData = sendData + i + "=" + encodeURIComponent(options.data[i]) + "&";
        // }
        // sendData = sendData.replace(/&$/, "");
        // if (options.type === "GET") url = url + "?" + sendData;
        options.data.token = localStorage.getItem('analyses_token') || ""
        xhr.open(options.type, url, true);
        if (options.type === "POST") {
            sendData = JSON.stringify(options.data)
            xhr.setRequestHeader( "Content-Type", "application/json; charset=UTF-8" );
        }

        xhr.send(sendData);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        var res = JSON.parse(xhr.responseText)
                        options.success(res);
                        localStorage.setItem('analyses_token', res.data.sign);
                    } catch (err) {
                        //console.error(err)
                    }
                } else {
                    options.error({
                        msg: "error readyState:" + xhr.readyState + "status:" + xhr.status,
                        xhr: xhr
                    });
                }
            }
        };
        return xhr;
    };

    var errorReport = {
        
        /**
         * @description 过滤哪些不上报的关键错误点
         *  Script error,
         *  WeixinJSBridge 微信浏览器不同步报错
         *  VectorLayer 百度地图矢量图层错误
         *  logreport 日志上报接口
         */
        filterKey: [ "Script error", "WeixinJSBridge", "VectorLayer", "logreport" ],

        /**
         * @method isCheckKeyToReport
         * @description 检测错误信息中是否包含关键字, 错误信息为空或者不通过 则不上报
         * @param {String} errMsg 错误信息
         * @returns {boolean} { false: 不上报, true: 上报 }
         */
        isCheckKeyToReport: function(errMsg) {
            var isReport = true;

            if (!errMsg) return false;
            if (typeof errMsg === "object") return false;
            this.filterKey.forEach(function(item) {
                if (errMsg.indexOf(item) > -1) {
                    isReport = false;
                }
            });

            return isReport;
        },

        // 创建错误字段
        createErrorBody: function(options) {
            var i, oReturn = {
                url: location.href
            };
            for (i in options) oReturn[i] = options[i];
            return oReturn;
        },

        // 前置处理器
        sendBefore: function(data) {
            data.user_id = config.user_id
            data.app_name = config.app_name
            data.call_name = config.call_name
            fetchTo(config.api, {
                data: filterEmpty(data)
            });
        },

        // 提取调用栈js文件行号和过滤调用栈同域名和提取错误文件名
        obtainStack: function(str) {
            if (!str) return {};

            var i, arr = str.split(/\n/), firstLineFile = null, line = null, file = null, res;
            for (i = 0; i < arr.length; i++) {
                if (arr[i].indexOf('.js') > -1) {
                    firstLineFile = arr[i].replace(/\s+/, '');
                    break;
                }
            }

            if (!firstLineFile) return {};

            // 分解第一个js路径
            // at a.isLogin (http://***/dist/static/js/1.62f81ce2dad169fd91cd.js:1:741)
            // to
            // [1] localhost:63342/hxb_h5/dist/static/js
            // [3] 1.62f81ce2dad169fd91cd.js:1:741
            // [1.62f81ce2dad169fd91cd.js, 1, 741]
            try {
                res = firstLineFile.match(regx);
                if (res) {
                    res = res[3].split(':');
                    file = res[0];
                    line = res.slice(1).join(':');
                }
            } catch (err) {}

            return {
                stack: str.replace(/(http|https):\/\/(\S*)\//g, ''),
                line: line,
                file: file
            }
        },

        // console.error
        error: function() {
            var that = this;
            console.error = function(data) {
                var result, stackResult, params;
                if (typeof data === "string") {
                    data = {
                        message: data
                    };
                }

                result = that.isCheckKeyToReport(data.message);
                if (!result) return;

                stackResult = that.obtainStack(data.stack);
                params = that.createErrorBody({
                    message: data.message,
                    stack: stackResult.stack,
                    line: stackResult.location || data.location,
                    file: stackResult.file || data.file
                });
                rate.add(params) && that.sendBefore(params);
            };
        },

        // 全局捕获错误
        listenerError: function () {
            var that = this;
            window.addEventListener("error", function (oError) {
                var result, stack, params,
                    oBody = {
                        message: oError.message,
                        file: oError.filename,
                        line: (oError.lineno || '0') + ':' + (oError.colno || '0')
                    };

                result = that.isCheckKeyToReport(oBody.message);
                if (!result || !oBody.file) return;

                // 当遇到script error. 时, error为null, 特此往后获取, try catch下
                try {
                    stack = oError.error.stack;
                } catch (err) {
                    stack = "";
                }

                oBody.stack = stack;
                params = that.createErrorBody(oBody);
                rate.add(params) && that.sendBefore(params);
            });
        },

        // 全局捕获promise错误
        unhandledrejectionError: function () {
            var that = this;
            window.addEventListener("unhandledrejection", function (event) {
                var result, params, oError = event.reason || {},
                    oBody = {
                        message: oError.message,
                        stack: oError.stack,
                        line: '0:0'
                    };

                result = that.isCheckKeyToReport(oBody.message);
                if (!result) return;
                params = that.createErrorBody(oBody);
                rate.add(params) && that.sendBefore(params);
            });
        },

        init: function() {
            this.error()
            this.listenerError()
            this.unhandledrejectionError()
            window.ErrorReport = {
                setConfig: setConfig,
                fetchTo: fetchTo
            }
        }
    };

    errorReport.init();
})();


/**
 * @method Performance
 * @description  TTFB、TTSR、TTDC、TTFL 性能检测
 * 
 *  https://segmentfault.com/a/1190000002589116
 *  https://www.w3.org/TR/navigation-timing/
 *  https://www.cnblogs.com/btgyoyo/p/6341077.html
 */
;(function(win) {
    var locat = win.location
    var online = locat.port !== "8001"
    var reportInterval = 3  // 上报页面文档呈现时间， 默认是3s
    var LongStay = 30       // 在页面停留30s，再记录上报一次
    var config = {
        api: "/api/v1/performance-report",
        user_id: "",
        app_name: '',
        url: locat.href
    };
    var UPINTERVALTIME = 1000 * 1 * 60 * 60 * 24 * 1;   // 1天统计一次
    var filterFiles = [];
    var origin = locat.origin;
    var list = [];
    var imgType = ['png', 'gif', 'jpg', 'jpeg', 'bmp', 'svg', 'pcx', 'tiff', 'fpx', 'hdri', 'raw'];
    var reation = {
        readyStart: '准备新页面时间耗时',
        redirectTime: 'redirect重定向耗时',
        waitingTime: '请求等待耗时',
        unloadEventTime: 'unload前文档耗时',
        lookupDomainTime: 'DNS查询耗时',
        connectTime: 'TCP连接耗时',
        HTTPSTime: 'HTTPS连接耗时',
        requestTime: 'request请求耗时',
        responseTime: 'response响应耗时',
        initDomTreeTime: 'dom解析构建耗时',
        domReadyTime: '准备就绪耗时',
        loadEventTime: 'load事件耗时',
        loadTime: '从开始至load总耗时',
        formatSize: '资源大小',
        duration: '从开始至load总耗时'
    };
    var cache = {
        methodType: {},     // 页面来源类型{刷新, 后退等}
        navigation: {},     // 页面

        // 资源
        resource: {
            iframe: {},
            script: {},
            img: {},
            css: {},
            xmlhttprequest: {},
            other: {}
        },

        // 内存占用
        memory: {},
        paint: {}
    };

    // 移动端不兼容 memory, getEntries
    win.performanceInit = function () {
        if (typeof performance.getEntries === 'function') {
            list = performance.getEntries();
            getResource();
        }
        getNavigation();
        getMemory();
        pageLoadMethod();
    };

    // 判断页面来源类型
    var pageLoadMethod = function (){
        var type = performance.navigation.type;
        var relation = {
            0: '点击链接、地址栏输入、表单提交、脚本操作等方式加载',
            1: '通过{重新加载}按钮或者location.reload()方法加载',
            2: '网页通过{前进}或{后退}按钮加载'
        };
        cache.methodType = {
            text:  (relation[type] || '任何其他来源的加载') + ' 网络类型：' + (win.networkType || '未获取'),
            type: type
        };
    };

    // 获取页面
    var getNavigation = function () {
        var navigation = cache.navigation;

        if ('doc' in navigation) return;
        list = list[0] || {};
        performance.timing.transferSize = list.transferSize || 0;
        navigation['doc'] = analysisDoc(performance.timing);
    };

    // 获取资源
    var getResource = function () {
        var resource = cache.resource;
        for (var i = 0; i < list.length; i++) {
            var timing = list[i];
            var initiatorType = timing.initiatorType;

            if (timing.entryType !== 'resource') continue;

            var newName = timing.name.replace(origin, '');
            timing.isNew = true;

            // 处理其他类型
            if (initiatorType === '') initiatorType = 'other';

            // 判断类型是否存在, 同一个文件只存一次
            if (resource[initiatorType]) {
                if (newName in resource[initiatorType]) {
                    resource[initiatorType][newName].isNew = false;
                    continue;
                }
            }

            // 判断是否有图片
            if (initiatorType === 'css') {
                var index = newName.lastIndexOf('.');
                if (index > -1 && imgType.includes(newName.slice(index + 1, newName.length))) {
                    initiatorType = 'img';
                    if (newName in resource[initiatorType]) {
                        resource[initiatorType][newName].isNew = false;
                        continue;
                    }
                }
            }

            // 判断是css
            if (initiatorType === 'link' && newName.includes('.css')) {
                initiatorType = 'css';
                if (newName in resource[initiatorType]) {
                    resource[initiatorType][newName].isNew = false;
                    continue;
                }
            }

            // 过滤beacon类型
            if (resource[initiatorType]) {
                resource[initiatorType][newName] = analysisResource(timing);
            }
        }
    };

    // 获取内存
    var getMemory = function () {
        var values = performance.memory;
        for (var i in values) {
            cache.memory[i] = formatSize(values[i]);
        }
    };

    // 解析资源
    var analysisResource = function (timing) {
        var redirectTime        = timing.redirectEnd  - timing.redirectStart;
        var waitingTime         = timing.domainLookupStart  - timing.fetchStart;
        var lookupDomainTime    = timing.domainLookupEnd - timing.domainLookupStart;
        var connectTime         = timing.connectEnd - timing.connectStart;
        var httpsTime           = timing.secureConnectionStart ? (timing.connectEnd - timing.secureConnectionStart) : 0;

        var requestTime         = timing.responseStart - timing.requestStart;
        var responseTime        = timing.responseEnd - timing.responseStart;

        var size                = timing.transferSize || 0;
        var duration            = timing.duration;

        return {
            user_id: config.user_id,
            app_name: config.app_name,
            call_name: config.call_name,

            redirect_time: Number(redirectTime.toFixed(2)),
            waiting_time: Number(waitingTime.toFixed(2)),
            domain_time: Number(lookupDomainTime.toFixed(2)),
            conn_time: Number(connectTime.toFixed(2)),
            https_time: Number(httpsTime.toFixed(2)),
            req_time: Number(requestTime.toFixed(2)),
            res_time: Number(responseTime.toFixed(2)),
            duration: Number(duration.toFixed(2)),
            format_size: formatSize(size),
            isNew: timing.isNew
        };
    };

    // 解析
    var analysisDoc = function (timing) {
        var readyStart          = timing.fetchStart - timing.navigationStart;
        var redirectTime        = timing.redirectEnd - timing.redirectStart;
        var waitingTime         = timing.domainLookupStart - timing.fetchStart;    // 负数表示延迟或者阻塞时长
        var unloadEventTime     = timing.unloadEventEnd - timing.unloadEventStart;
        var lookupDomainTime    = timing.domainLookupEnd - timing.domainLookupStart;

        var connectTime         = timing.connectEnd - timing.connectStart;
        var httpsTime           = timing.secureConnectionStart ? (timing.connectEnd - timing.secureConnectionStart) : 0;   // SSL 安全连接耗时
        var requestTime         = timing.responseStart - timing.requestStart;
        var responseTime        = timing.responseEnd - timing.responseStart;

        var initDomTreeTime     = timing.domInteractive - timing.responseEnd;       // 表示完成全部html的解析, 并且dom构建完毕, domLoading-responseEnd表示开始解析第一批收到的HTML文档的字节
        var domReadyTime        = timing.domComplete - timing.domInteractive;       // 过早获取时,domComplete有时会是0, 表示所有的处理都已完成并且所有的附属资源都已经下载完毕
        var loadEventTime       = timing.loadEventEnd - timing.loadEventStart;
        var loadTime            = timing.loadEventEnd - timing.navigationStart;     // 过早获取时,loadEventEnd有时会是0
        var size                = timing.transferSize;

        return {
            user_id: config.user_id,
            app_name: config.app_name,
            call_name: config.call_name,

            ready_start: Number(readyStart.toFixed(2)),
            redirect_time: Number(redirectTime.toFixed(2)),
            waiting_time: Number(waitingTime.toFixed(2)),
            unload_event_time: Number(unloadEventTime.toFixed(2)),
            domain_time: Number(lookupDomainTime.toFixed(2)),
            conn_time: Number(connectTime.toFixed(2)),
            https_time: Number(httpsTime.toFixed(2)),
            req_time: Number(requestTime.toFixed(2)),
            res_time: Number(responseTime.toFixed(2)),
            dom_tree_time: Number(initDomTreeTime.toFixed(2)),
            dom_ready_time: Number(domReadyTime.toFixed(2)),
            load_event_time: Number(loadEventTime.toFixed(2)),
            load_time: Number(loadTime.toFixed(2)),
            format_size: formatSize(size),
        }
    };

    // 给已上报的打上标签
    var setReportState = function() {
        var resource = cache.resource
        var doc = cache.navigation.doc
        doc.report = true
        for (i in resource) {
            if (typeof resource[i] !== 'object') continue;
            for (j in resource[i]) {
                if (isFileFilter(j)) continue;
                resource[i][j].report = true;
            }
        }
    };

    // 判断文件是否需要过滤
    var isFileFilter = function(path) {
        var i, isState = false;
        if (!path) return isState;
        for (var i = 0; i < filterFiles.length; i++) {
            if (path.indexOf(filterFiles[i]) > -1) {
                isState = true;
                break;
            }
        }
        return isState;
    };

    // 组装上传格式
    var formatUploadData = function() {
        var data = [], resource = cache.resource, doc = cache.navigation.doc,  i, j;

        // 组装doc
        doc.rs_type = 'doc';
        doc.method_type = cache.methodType.type;
        doc.network_type = win.networkType || '未获取';

        if (!doc.report) {
            data.push(doc);
        }

        // 组装资源文件
        for (i in resource) {
            if (typeof resource[i] !== 'object') continue;
            for (j in resource[i]) {
                if (isFileFilter(j)) continue;
                if (resource[i][j].report) continue
                resource[i][j].rs_type = i;
                resource[i][j].file = j;
                delete resource[i][j].isNew;
                data.push(resource[i][j]);
            }
        }

        return data;
    };

    var formatSize = function (size) {
        //if (size < 1024) return Number(size);
        return Number((size / 1024).toFixed(2));
    };

    // 发送服务端
    var toPushServer = function() {
        var data = {
            url: config.url,
            params: formatUploadData()
        }
        ErrorReport.fetchTo(config.api, {
            data: data,
            success: function() {
                setReportState()
                localStorage.setItem('performance', Date.now());
            }
        });
    };

    // 上报频率 true上报, false不上报
    var upRate = function() {
        var prevTime = localStorage.getItem('performance');
        if (!prevTime) return true;
        if (Date.now() - prevTime > UPINTERVALTIME) return true;
        return false;
    };

    var setConfig = function(data) {
        if (typeof data !== 'object') return;
        for (var i in data) {
            config[i] = data[i]
        }
    };

    var loop = function() {
        var count = 0
        var timer = setInterval(function() {
            count = count + 1

            // 此时取可以查看到页面文档呈现时间
            if (count === reportInterval) {
                performanceInit();
                toPushServer();
            }

            // 30s再取一次, 如果用户一直停留在页面, 可以获得更多上报信息
            if (count === LongStay) {
                performanceInit()
                toPushServer();
                clearInterval(timer)
            }
        }, 1000);
    }

    win.addEventListener("load", function () {
        upRate() && loop()
    }, false);

    win.Performance = {
        setConfig: setConfig,
        analysisDoc: analysisDoc,
        analysisResource: analysisResource,
        cache: cache
    }
})(window);
