
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 错误日志
	const ModelSchema = new Schema({
		user_id: {type: String, required: true},			// 用户id
		appName: {type: String, required: true},			// 应用名
		ip: {type: String, required: true},					// 用户ip
		city: {type: String, required: true},				// 用户城市
		url: {type: String, required: true},				// 错误页面的url
		file: {type: String, required: true},				// 错误文件的url
		line: {type: String, required: true},				// 错误行号
		message: {type: String, required: true},			// 错误信息
		stack: {type: String, required: true},				// 错误调用栈
		time: {type: Date, default: Date.now},				// 上报时间
	});

	return mongoose.model('ErrorReport', ModelSchema, 'errorReport');
};