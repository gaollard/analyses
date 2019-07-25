
// 错误上报
exports.fe = {
	user_id: {type: String, required: false}, 				// 用户id，接入方上报, 基本上是缺失值
	sign: {type: String, required: false, index: true},		// 用户签名, 系统生成
	ip: {type: String, required: false},					// 用户ip
	url: {type: String, required: false},					// 错误页面的url
	file: {type: String, required: false},					// 错误文件的url
	line: {type: String, required: false},					// 错误行号
	message: {type: String, required: false},				// 错误信息
	stack: {type: String, required: false},					// 错误调用栈
	create_time: {type: String, required: true},			// 上报时间 图表 精确到天
	time: {type: String, required: true},					// 上报时间 列表查询
}

// 资源性能上报
exports.fp = {
	user_id: {type: String, required: false}, 				// 用户id，接入方上报, 基本上是缺失值
	sign: {type: String, required: false, index: true},		// 用户签名, 系统生成
	ip: {type: String, required: false},					// 用户ip
	city: {type: String, required: false},					// 城市

	ready_start: {type: Number, required: false},			// 准备新页面时间耗时
	redirect_time: {type: Number, required: false},			// redirect重定向耗时
	waiting_time: {type: Number, required: false},			// 请求等待耗时
	unload_event_time: {type: Number, required: false},		// unload前文档耗时

	domain_time: {type: Number, required: false},			// DNS查询耗时
	conn_time: {type: Number, required: false},				// TCP连接耗时

	req_time: {type: Number, required: false},				// request请求耗时
	dom_tree_time: {type: Number, required: false},			// 请求完毕至dom加载

	dom_ready_time: {type: Number, required: false},			// 解析dom树耗时
	load_event_time: {type: Number, required: false},		// load事件耗时
	load_time: {type: Number, required: false},				// 从开始至load总耗时

	format_size: {type: Number, required: false},			// 资源大小
	rs_type: {type: String, required: false},				// 资源类型
	duration: {type: Number, required: false},				// 从开始至load总耗时
	method_type: {type: Number, required: false},			// 打开方式
	network_type: {type: String, required: false},			// 从开始至load总耗时
	file: {type: String, required: false},					// 文件地址

	create_time: {type: String, required: true},			// 上报时间 图表 精确到天
	time: {type: String, required: true},					// 上报时间 列表查询
}