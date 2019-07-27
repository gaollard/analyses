	api接口文档

	接口前缀： /api
	请求方法：所有请求均采用POST方法，application/json
	code === 0 成功
	code !== 0 失败
	响应示例：
	{
		"code": 0,
		"data": "ok",
		"msg": " ",
		"time": 1563878320361
	}


### 1、新增错误日志
	api/v1/error-report [POST]
	
	入参:
	{
		"app_name": "YouPin",				// 应用名
		"user_id": "TEST134",				// 用户id
		"url": "xxx.com",					// 错误的url
		"file": "2.js",						// 错误的文件
		"line": "10:32",					// 错误行号
		"message": "dddd is undefined",		// 错误信息
		"stack": "ksdff ___ asdfsfasdf"		// 错误调用栈
	}

### 2、查询错误日志-列表
	api/v1/error-report-list [POST]
	
	入参:
	{
		"page_size":300,
		"app_name":"ZiYou",
		"user_id":"",
		"ip":"",
		"sign":"",
		"start_time":"2019-07-20",
		"end_time":"2019-07-27"
	}


### 3、查询错误日志-图表
	api/v1/error-report-chart [POST]
	
	入参:
	{
		"page_size":300,
		"app_name":"ZiYou",
		"user_id":"",
		"ip":"",
		"sign":"",
		"start_time":"2019-07-20",
		"end_time":"2019-07-27"
	}

	响应：
	{
		"code":0,
		"data":[
			{
				"_id":"2019-07-22",
				"count":2
			},
			{
				"_id":"2019-07-23",
				"count":1
			}
		],
		"msg":" ",
		"time":1563878606495
	}

### 4、新增资源性能统计
	api/v1/performance-report [POST]
	
	入参:
	{
		"params":[
			{
				"user_id":"",
				"app_name":"ZiYou",
				"ready_start":1,
				"redirect_time":0,
				"waiting_time":0,
				"unload_event_time":0,
				"domain_time":0,
				"conn_time":0,
				"https_time":0,
				"req_time":2,
				"res_time":1,
				"dom_tree_time":133,
				"dom_ready_time":2,
				"load_event_time":0,
				"load_time":142,
				"format_size":5.92,
				"rs_type":"doc",
				"method_type":1,
				"network_type":"未获取"
			},
			{
				"user_id":"",
				"app_name":"ZiYou",
				"redirect_time":0,
				"waiting_time":0,
				"domain_time":0,
				"conn_time":0,
				"https_time":0,
				"req_time":1.52,
				"res_time":13.4,
				"duration":24.38,
				"format_size":82.64,
				"rs_type":"script",
				"file":"/public/js/jquery.min.js"
			}
		],
		"token":""
	}

### 5、查询资源性能-列表
	api/v1/performance-report-list [POST]
	
	入参:
	{
		"page_size":300,
		"app_name":"ZiYou",
		"user_id":"",
		"ip":"",
		"sign":"",
		"start_time":"2019-07-20",
		"end_time":"2019-07-27",
		"accuracy_time":"",
		"city":"",
		"rs_type":"",
		"duration":""
	}

	响应：
	{
		"code":0,
		"data":[
			{
				"_id":"5d3bebe1ae4e9c43373ca53e",
				"user_id":"",
				"app_name":"ZiYou",
				"ready_start":1,
				"redirect_time":0,
				"waiting_time":0,
				"unload_event_time":0,
				"domain_time":0,
				"conn_time":0,
				"https_time":0,
				"req_time":2,
				"res_time":1,
				"dom_tree_time":133,
				"dom_ready_time":2,
				"load_event_time":0,
				"load_time":142,
				"format_size":5.92,
				"rs_type":"doc",
				"method_type":1,
				"network_type":"未获取",
				"city":"",
				"sign":"b6a801312e1818e93f1851bb462acd85",
				"ip":"218.18.137.27",
				"create_time":"2019-07-27",
				"time":"2019-07-27 14:14:57"
			}
		],
		"msg":" ",
		"time":1563878810609
	}

### 6、查询资源性能-图表
	api/v1/performance-report-chart [POST]
	
	入参:
	{
		"page_size":300,
		"app_name":"ZiYou",
		"user_id":"",
		"ip":"",
		"sign":"",
		"start_time":"2019-07-20",
		"end_time":"2019-07-27",
		"accuracy_time":"",
		"city":"",
		"rs_type":"",
		"duration":""
	}

	响应：
	{
		"code":0,
		"data":{
			"2019-07-27":{
				"ready_start":34,
				"redirect_time":0,
				"waiting_time":831.75,
				"unload_event_time":0,
				"domain_time":0.34,
				"conn_time":55.9,
				"https_time":0,
				"req_time":1044.02,
				"res_time":2866.74,
				"dom_tree_time":4522,
				"dom_ready_time":68,
				"load_event_time":0,
				"load_time":4828,
				"duration":5498.26
			}
		},
		"msg":" ",
		"time":1564211561692
	}