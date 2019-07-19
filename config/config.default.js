const path = require('path');

module.exports = appInfo => {
    const config = exports = {};

    config.keys = appInfo.name + '_shiyuejs';

	config.static = {
		maxAge: 3153600000,
		prefix: '/public/',
		dir: path.join(appInfo.baseDir, 'public')
	};

    config.bodyParser = {
        ignore: [
            /singer/i,
	        /songSheet/i
        ],
        formLimit: '10mb',
        jsonLimit: '100kb'
    };

    // 中间件添加, 顺序执行
    config.middleware = [
        'errorHandle',              // 错误捕获
        'returnFactory',            // 包装返回数据
        'requestTime',              // 请求响应时间
        'notFound',                 // 404处理
        'robot',
        'validateRoutePath',        // 404路由验证
        'apiWapper',                // 设置响应头allow
        // 'authToken',                // token验证
        // 'rbac'                      // 权限验证
    ];

    // 包装api返回
    config.returnFactory = {

        // 允许包装
        allowApi: [
            /find/i,
            /login/i,
            /reg/i,
            /role/i,
            /singer/i,
            /category/i,
            /songSheet/i
        ]
    };

    // 接口权限验证api
    config.rbac = {

        // 不验证
        notAllowApi: [
            /login/i,
            /reg/i,
            /role/i,
            /singer/,
	        /category/i,
	        /songSheet/i
        ]
    };

    // token验证
    config.authToken = {

        // 不验证
        notAllowApi: [
            /login/i,
            /reg/i,
	        /singer/,
	        /category/i,
	        /songSheet/i
        ]
    };


    // 禁止百度爬虫
    config.robot = {
        ua: [
            /Baiduspider/i,
        ]
    };

    // mongoose
    config.mongoose = {
        url: 'mongodb://127.0.0.1/analyses',
        options: {}
    };

    // token
    config.token = {
        key: 'analyses.shiyuejs.top',
        expiresTime: 1 * 60 * 60 * 24   //24小时
    };

    // 文件上传
	config.upload = {
		defaultDir: 'public/upload/'
	};
	
	config.security = {
		csrf: {
		  queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
		  bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
		}
	}
	
	return config;
};
