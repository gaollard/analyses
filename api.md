	api接口文档

	接口前缀： /api
	请求方法：POST请求均采用application/json
	响应：
		成功code = 0
		失败code != 0
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
		"user_id": "1",						// 用户id
		"url": "xxx.com",					// 错误的url
		"file": "2.js",						// 错误的文件
		"line": "10:32",					// 错误行号
		"message": "dddd is undefined",		// 错误信息
		"stack": "ksdff ___ asdfsfasdf"		// 错误调用栈
	}

### 2、查询错误日志-列表
	api/v1/error-report [GET]
	
	入参:
	{
		app_name: YouPin
		user_id: 1
		start_time: 2019-07-20
		end_time: 2019-07-26
	}


### 3、查询错误日志-图表
	api/v1/error-report-chart [GET]
	
	入参:
	{
		app_name: YouPin
		user_id: 1
		start_time: 2019-07-20
		end_time: 2019-07-26
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
		"params": [
			{
				"app_name": "YouPin",
				"user_id": "2",
				
				"ready_start": 10,
				"redirect_time": 20,
				"waiting_time": 30,
				"unload_event_time": 40,
				
				"domain_time": 50,
				"conn_time": 60,
				
				"req_time": 70,
				"dom_tree_time": 80,
				
				"dom_ready_time": 90,
				"load_event_time": 100,
				"load_time": 0,
				
				"format_size": 20,
				"rs_type": "doc",
				"duration": 0,
				"method_type": 1,
				"network_type": "wifi",
				"file": ""
				
			}	
		]
	}

### 5、查询资源性能-列表
	api/v1/performance-report [GET]
	
	入参:
	{
		app_name: YouPin
		user_id: 1
		start_time: 2019-07-20
		end_time: 2019-07-26
		city: 深圳市
		rs_type: doc
		duration: 0
	}

	响应：
	{
		"code":0,
		"data":[
			{
				"_id":"5d3589b1977f19097c83ff08",
				"app_name":"YouPin",
				"user_id":"1",
				"ready_start":10,
				"redirect_time":3,
				"waiting_time":0,
				"unload_event_time":0,
				"domain_time":0,
				"conn_time":0,
				"req_time":0,
				"dom_tree_time":0,
				"dom_ready_time":0,
				"load_event_time":0,
				"load_time":0,
				"format_size":0,
				"rs_type":"doc",
				"duration":100,
				"method_type":1,
				"network_type":"wifi",
				"file":"",
				"city":"深圳市",
				"create_time":"2019-07-22",
				"time":"2019-07-22 18:02:25"
			}
		],
		"msg":" ",
		"time":1563878810609
	}

### 6、查询资源性能-图表
	api/v1/performance-report-chart [GET]
	
	入参:
	{
		app_name: YouPin
		user_id: 1
		start_time: 2019-07-20
		end_time: 2019-07-26
		city: 深圳市
		rs_type: doc
		duration: 0
	}

	响应：
	{
   		"code":0,
		"data":{
			"2019-07-21":{
				"ready_start":10,
				"redirect_time":20,
				"waiting_time":30,
				"unload_event_time":40,
				"domain_time":0,
				"conn_time":0,
				"req_time":0,
				"dom_tree_time":0,
				"dom_ready_time":0,
				"load_event_time":0,
				"load_time":0,
				"duration":0
			}
		},
		"msg":" ",
		"time":1563878810619
	}