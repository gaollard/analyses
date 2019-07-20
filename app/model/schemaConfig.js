
// 错误上报
exports.fe = {
	user_id: {type: String, required: true},			// 用户id
	ip: {type: String, required: true},					// 用户ip
	url: {type: String, required: true},				// 错误页面的url
	file: {type: String, required: true},				// 错误文件的url
	line: {type: String, required: true},				// 错误行号
	message: {type: String, required: true},			// 错误信息
	stack: {type: String, required: true},				// 错误调用栈
	create_time: {type: String, required: true},		// 上报时间 图表 精确到天
	time: {type: String, required: true},				// 上报时间 列表查询
}