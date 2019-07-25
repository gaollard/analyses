
module.exports = app => {
	const mongoose = app.mongoose
	let Schema = mongoose.Schema
	const ObjectId = Schema.ObjectId

	const ModelSchema = new Schema({
		sign: {type: String, required: false, index: true},  // 签名(返回给前端的)
		token: {type: String, required: false},              // token
		app_name: {type: String, required: false},           // 应用名
		time: {type: String, required: true},				 // 创建时间
	})

	return mongoose.model('Token', ModelSchema, 'Token')
}