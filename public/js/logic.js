let domain = '//analyses.huishoubao.com'
if (location.port) {
	domain = ""
}

// ErrorReport.setConfig({
// 	api: `${domain}/api/v1/error-report`,
// 	user_id: '',
// 	app_name: 'ZiYou',
// 	call_name: 'business_env_appliaction'
// })
// Performance.setConfig({
// 	api: `${domain}/api/v1/performance-report`,
// 	user_id: '',
// 	app_name: 'ZiYou',
// 	call_name: 'business_env_appliaction'
// })

let loadingEl = document.querySelector('.loading')
let fe = {
	header: document.querySelector('#fe-header'),
	el: document.querySelector('#fe-content'),
	chart: document.querySelector('#fe-chart'),
	dic: {
		call_name: '上报方名称',
		user_id: '用户id',
		ip: '用户ip',
		sign: 'sign',
		url: '错误url',
		file: '错误文件',
		line: '行号',
		message: '错误信息',
		stack: '错误栈',
		time: '上报时间',
		user_agent: 'userAgent'
	}
}

let node = {
	ready_start: '准备新页面时间耗时',
	redirect_time: 'redirect重定向耗时',
	waiting_time: '请求等待耗时',
	//unload_event_time: 'unload前文档耗时',

	domain_time: 'DNS查询耗时',
	conn_time: 'TCP连接耗时',
	https_time: 'SSL安全连接耗时',
	req_time: 'request请求耗时',
	res_time: 'response响应耗时',

	dom_tree_time: 'dom解析构建耗时',
	dom_ready_time: '准备就绪耗时',
	load_event_time: 'load事件耗时',
	load_time: '从开始至load总耗时',
    duration: 'RTT'
}
let fp = {
	header: document.querySelector('#fp-header'),
	el: document.querySelector('#fp-content'),
    chart: document.querySelector('#fp-chart'),
    chartAvg: document.querySelector('#fp-chart-avg'),
    search: document.querySelector('#search'),
    headerRatio: document.querySelector('#fp-header-ratio'),
    elRatio: document.querySelector('#fp-content-ratio'),
    
    // 数据
    data: {
        // networkType: ['慢3G 500k/S', '快3G 2M/S', '慢4G 4M/S', '快4G 15M/S', '慢WIFI 3M/S', '快WIFI 20M/S'],
        // delayBaseValue: [500, 500, 500, 500, 500, 500],         // 基准延迟ms

        // ready_start: [400, 200, 50, 30, 70, 30],                // 准备新页面时间耗时
        // domain_time: [100, 100, 100, 100, 100, 100],            // DNS查询耗时
        // conn_time: [100, 100, 100, 100, 100, 100],              // TCP连接耗时
        // https_time: [200, 200, 200, 200, 200, 200],             // SSL安全连接耗时
        // req_time: [600, 600, 600, 600, 600, 600],               // request请求耗时
        // dom_tree_time: [2000, 1000, 600, 600, 1000, 500],       // dom解析
        // load_time: [10000, 8000, 5000, 2500, 6000, 2000],       // load事件
        // duration: [1500, 800, 600, 100, 500, 100]               // 资源RTT

        networkType: ['3M带宽 ~= 0.375MB/s', '10M带宽 ~= 1.25MB/s', '20M带宽 ~= 2.5MB/s'],
        delayBaseValue: [500, 500, 500],            // 基准延迟ms

        ready_start: [400, 50, 30],                 // 准备新页面时间耗时
        domain_time: [100, 100, 100],               // DNS查询耗时
        conn_time: [100, 100, 100],                 // TCP连接耗时
        https_time: [200, 200, 200],                // SSL安全连接耗时
        req_time: [600, 600, 600],                  // request请求耗时
        dom_tree_time: [2000, 800, 500],            // dom解析
        load_time: [10000, 3000, 2000],             // load事件
        duration: [1500, 400, 100]                  // 资源RTT
    },

    // ratio比例
    dicRatio: {
        time: '创建时间'
    },
    
	dic: Object.assign({}, {
		//app_name: '应用名',
		call_name: '上报方名称',
		//user_id: '用户id',
		city: '城市',
		ip: '用户ip',
		sign: 'sign',
		time: '创建时间',

		rs_type: '资源类型',
	}, node, {
		format_size: '资源大小K',
		file: '资源路径',
        //method_type: '加载方式',
        url: 'URL'
		//network_type: '网络情况'
	})
}

let prevSortEelement = null // 存放上一个排序的dom
let sortField = ['time', 'format_size', ...Object.keys(node)]	// 排序字段

let loadingShow = () => {
    loadingEl.style.display = 'block'
}
let loadingHide = () => {
    loadingEl.style.display = ''
}

let debounce = (fn, delay = 300) => {
	let timerId
	return (...args) => {
		if (timerId) {
			clearTimeout(timerId)
		}
		timerId = setTimeout(() => {
			fn(...args)
			timerId = null
		}, delay)
	}
}

let times = (now) => {
	let time = new Date(), day,
		timeFormat = (num) => {
			if (num < 10) return "0" + num
			return num
		}

	if (now) time = new Date(now)
	day = time.getFullYear() + "-" + timeFormat(time.getMonth() + 1) + "-" + timeFormat(time.getDate())

	return {
		day: day
	}
}

let ajax = (url, method, data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${domain}/api/v1/${url}`,
			type: method || 'POST',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
			success: function (res = {}) {
				if (res.code === 0) {
					resolve(res.data)
				} else {
					resolve(res.msg)
				}
			},
			error: function (res) {
				reject(res)
			}
		})
	})
}

let docInner = (el, fields, data, totalEl) => {
	let temp = []

	if (!data) {
		let htmls = []
		for (let i in fields) {
			htmls.push(`<div class="row sort-action" data-sort-name="${i}" data-text="${fields[i]}">${fields[i]}</div>`)
		}
		temp.push(`<div class="row-box header">${htmls.join('')}</div>`)
	} else {
		typeof data === 'object' && data.forEach(item => {
			let htmls = []
            let more = ""
            let isRed = ''
			fields.forEach(field => {
                // 调用栈显示
                let text = item[field]
                
                // 防止错乱，过滤<>
                if (['message', 'stack'].includes(field) && text && typeof text === 'string') {
                   text = text.replace(/<|>/g, '')
                }

				let originText = text
				if (field === 'stack') {
					more = `<div class="row-box hide stack-row-box"><div class="row">${text}</div></div>`
					if (text) {
						text = text.slice(0, 40) + "..."
					}
				}

				// 文件路径||错误url
				if (['file', 'url', 'user_agent'].includes(field)) {
					if (text) {
						text = text.slice(0, 40) + "..."
					}
                }
                
                // 标红 doc > 2s
                if (field === 'load_time' && text > 2000) {
                    isRed = 'red-bg'
                }

				htmls.push(`<div class="row ${field}" title="${originText}">${typeof text === "undefined" ? '/' : text}</div>`)
			})
			temp.push(`<div class="row-box fe-click ${isRed}">${htmls.join('')}</div>`)
			if (more) {
				temp.push(more)
			}
		})

        if (totalEl) {
            totalEl.innerHTML = `一共（${data.length}）条`
        }
	}

	el.innerHTML = temp.join('')
}

let renderChart = (el, opt = {}) => {
	let myChart = echarts.init(el)
    myChart.setOption(opt, true)
    
    myChart.on('click', function(params) {
        if (this._dom.id === 'fp-chart') return
        getFpAvg(params.dataIndex, 'minute')
    });
}

let getFromName = (selectName) => {
	let list = document.querySelectorAll(selectName)
	let oVal = {
		page_size: 150
	}
	list.forEach(item => {
		oVal[item.name] = item.value
	})
	return oVal
}

// 提交错误日志
let createErrorReport = async () => {
	let values = getFromName('#fe .form-box .search_name')
	let res = await ajax('error-report', 'POST', values)
	openCraetePop('#fe')
}

// 获取错误列表
let getFeList = async () => {
	let res = await ajax('error-report-list', 'POST', getFromName('#fe .search .search_name'))
	docInner(fe.el, Object.keys(fe.dic), res)
	getFeChart()
}

// 获取错误-图表
let getFeChart = async () => {
	let oVal = Object.assign({}, getFromName('#fe .search .search_name'))
	let res = await ajax('error-report-chart', 'POST', oVal)
	if (typeof res === 'string') {
		renderChart(fe.chart)
		return alert(res)
	}

	let xAxis = []

	let seriesData = []
	let series = [
		{
			name: '个数',
			type: 'bar',
			barWidth: '3%',
			data: seriesData
		}
	]
	res.forEach(item => {
		xAxis.push(item._id)
		seriesData.push(item.count)
	})

	let opt = {
		title: {
			text: ""
		},
		tooltip: {
			trigger: 'axis',
			axisPointer : { 
				type : 'shadow'
			}
        },
        toolbox: {
            left: "center",
            bottom: 10,
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
		legend: {
			data: []
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '50px',
			containLabel: true
		},
		xAxis: {
			type : 'category',
			data : xAxis
		},
		yAxis: [
			{
				type : 'value'
			}
		],
		series: series
	}

	renderChart(fe.chart, opt)
}

// 提交资源性能
let createPerformanceReport = async () => {
	let values = getFromName('#fp .form-box .search_name')

	// 转成数字
	for (let i in values) {
		if (Number(values[i]) === Number(values[i])) {
			values[i] = Number(values[i])
		}
	}

	let data = {
		params: [values]
	}
	let res = await ajax('performance-report', 'POST', data)
	openCraetePop('#fp')
}

// 获取资源性能列表
let getFpList = async (opt = {}) => {
    avgDown = true
    loadingShow()
    let query = getFromName('#fp .search .search_name')
    delete query.node_type
    delete query.network_type
	Object.assign(query, opt)
	let res = await ajax('performance-report-list', 'POST', query)
    docInner(fp.el, Object.keys(fp.dic), res, document.querySelector('.total-box'))
    
    // 排序只查列表
    if (!opt.sort) {
        await getFpChart()
        await getFpAvg()
        await getFpRatio()
    }
    
    loadingHide()
}

// 获取资源性能-图表
let getFpChart = async () => {
	let oVal = Object.assign({}, getFromName('#fp .search .search_name'))
	let res = await ajax('performance-report-chart', 'POST', oVal)
	if (typeof res === 'string') {
		renderChart(fp.chart)
		return alert(res)
	}

	let series = []
	var temp = {}
	for (var i in res) {
		for (var j in res[i]) {
			if (!temp[j]) {
				temp[j] = []
			}

			temp[j].push(res[i][j])
		}
	}
	Object.keys(temp).forEach((item, index) => {
		series.push({
			name: item,
			type: 'bar',
			barWidth: '3%',
			data: Object.values(temp[item])
		})
	})

	let opt = {
		title: {
            text: '各个节点耗时总和',
            subtext: ''
        },
		tooltip: {
			trigger: 'axis',
			axisPointer : { 
				type : 'shadow'
			}
        },
        toolbox: {
            left: "center",
            bottom: 10,
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
		legend: {
			type: 'scroll',
			left: 200,
			right: 30,
			top: 0,
			bottom: 30,
			data: Object.keys(node),
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '50px',
			containLabel: true
		},
		xAxis: [
			{
				type : 'category',
				data : Object.keys(res)
			}
		],
		yAxis: [
			{
				type : 'value'
			}
		],
		series: series
    }
	renderChart(fp.chart, opt)
}

// 获取资源性能百分比
let getFpRatio = async (opt) => {
    let query = getFromName('#fp .search .search_name')
    Object.assign(query, opt)
    query.delay_arr = fp.data[query.node_type] ? fp.data[query.node_type] : fp.data.delayBaseValue

    let res = await ajax('performance-report-ratio', 'POST', query)
    let {delayResArr = [], total = 0} = res || {}
    if (!total) return
    let tableHeaderRow = generateRatioTable('getKey')
    let o = {
        time: query.accuracy_time ? query.accuracy_time : `${query.start_time}至${query.end_time}`,
        node_type: query.node_type,
        total: total
    }

    delayResArr.map((item, index) => {
        o[`node_${index}`] = `${item}条, 延迟>${query.delay_arr[index]}ms, <b>${((item / total) * 100).toFixed(2) + "%"}</b>`
    })

    docInner(fp.elRatio, Object.keys(tableHeaderRow), [o])
}

// 获取资源性能每天 小时，分钟平均值
let avgDown = true
let getFpAvg = async (value, action = 'hour') => {
    let query = getFromName('#fp .search .search_name')
    if (query.end_time !== query.start_time) return

    if (!avgDown) return 
    if (typeof value !== 'undefined') {
        value = value < 10 ? `0${value}` : value
    }

    let actions = {
        hour: [
            "00:00:00", "01:00:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", 
            "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00", 
            "22:00:00", "23:00:00", "23:59:59"
        ],
        minute: [
            `${value}:00:00`, `${value}:10:00`, `${value}:20:00`, `${value}:30:00`, `${value}:40:00`, `${value}:50:00`, `${value}:60:00`, 
        ]
    }
    query.dimensions = actions[action]

    let res = await ajax('performance-report-avg', 'POST', query)
    if (typeof res === 'string') {
		renderChart(fp.chartAvg)
		return alert(res)
    }
    
    let xAxisData = []
    let seriesData = []
    let o = {}
    res.map((item, index) => {
        if (action === 'hour') {
            xAxisData.push(`${index}点`)
        } else {
            xAxisData.push(`${value}点 ${index}0分`)
        }

        let data = item ? (item.value || 0).toFixed(2) : 0
        o[index] = item
        seriesData.push(data)
    })

	opt = {
		title: {
            text: action === 'hour' ? '24小时资源耗时平均值' : `${value}时资源耗时平均值`,
            subtext: action === 'hour' ? '0-24小时' : ``
        },
		tooltip: {
			trigger: 'axis',
			axisPointer : { 
				type : 'shadow'
            },
            formatter: function (params = []) {
                let param = params[0] || {}
                let res = o[param.dataIndex] || {}
                return `${param.name}<br/> 
                        总条数: ${res.sign || 0}<br/> 
                        最大耗时: ${res.max || 0}ms<br/> 
                        平均耗时: ${param.value}ms`
            }
        },
        toolbox: {
            left: "center",
            bottom: 10,
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
		legend: {
            action,
			type: 'scroll',
			left: 30,
			right: 30,
			top: 0,
			bottom: 30,
			data: xAxisData,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '50px',
			containLabel: true
		},
		xAxis: [
			{
				type : 'category',
				data : xAxisData
			}
		],
		yAxis: [
			{
				type : 'value'
			}
		],
		series: [
            {
                name: '耗时',
                type: 'bar',
                data: seriesData,
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    }
    
    renderChart(fp.chartAvg, opt)
    if (value) {
        avgDown = false
    }
}

// 打开新增内容层
let openCraetePop = (el) => {
	let formBox = document.querySelector(`${el} .form-box`)
	if (formBox.classList.contains('hide')) {
		return formBox.classList.remove('hide')
	}
	formBox.classList.add('hide')
}

// 生成下拉框
let generateSelect = (data = [], el) => {
    if (!el) return;
    var html = ['<option value="">--请选择--</option>']
    data.map(item => {
        html.push(`<option value="${item.value}">${item.name}</option>`)
    })
    el.innerHTML = html.join('')
}

// 生成ratio比例的table
let generateRatioTable = (action) => {
    let element = fp.search.querySelector('.node_type')
    let nNode = {}
    fp.data.networkType.map((item, index) => {
        nNode[`node_${index}`] = `${item}`
    })
    let table = Object.assign(fp.dicRatio, {
        node_type: `节点指标：${element.options[element.selectedIndex].text}`,
    }, nNode, {
        total: '总条数'
    })

    if (action) return table
    docInner(fp.headerRatio, table)
}

// input回车搜索
let handleKeyDοwn = (event) => {
    if (event.keyCode == 13) {
        getFpList()
    }
}

let init = (page = '') => {
    window.addEventListener("unhandledrejection", function (event) {
        loadingHide()
    });

	let timeDayEnd = document.querySelectorAll('.time_day_end')
	timeDayEnd.forEach(item => item.value = times().day)

    let timeDayStart = document.querySelectorAll('.time_day_start')
    timeDayStart.forEach(item => item.value = times().day)
	//timeDayStart.forEach(item => item.value = times(Date.now() - 1000 * 60 * 60 * 24 * 17).day)

	if (page === 'error') {
		docInner(fe.header, fe.dic)
		getFeList()
		fe.el.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('stack')) {
				let nextElement = evt.target.parentElement.nextElementSibling
				if (!nextElement) return
				if (nextElement.classList.contains('hide')) {
					return nextElement.classList.remove('hide')
				}
				nextElement.classList.add('hide')
			}
        }, false)
	}

	if (page === 'performance') {
        let inputs = fp.search.querySelectorAll('input')
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('keyup', debounce(handleKeyDοwn, 200), false)
        }
        
        docInner(fp.header, fp.dic)
        generateRatioTable()
		getFpList()

		fp.header.addEventListener('click', (evt) => {
			let target = evt.target
			let {text, sortName} = target.dataset
			let sortAction = ''
			if (!target.classList.contains('sort-action')) return;
			if (!sortField.includes(sortName)) return;

			// 重置上一个排序dom
			if (prevSortEelement && prevSortEelement.dataset.sortName !== sortName) {
				prevSortEelement.innerHTML = prevSortEelement.dataset.text
			}

			prevSortEelement = target;

			// 默认降序排列, 从大到小, 时间从近到远
			// &#8593; 升序 asc
			// &#8595; 降序 desc
			if (target.classList.contains('desc')) {
				target.innerHTML = `&#8595;${text}`
				target.classList.remove('desc')
				sortAction = -1
			} else {
				target.innerHTML = `&#8593;${text}`
				target.classList.add('desc')
				sortAction = 1
			}

			sortAction && getFpList({
				sort: {
					[sortName]: sortAction
				}
			})
		})
	}
}