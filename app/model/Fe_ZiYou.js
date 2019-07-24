
let config = require('./schemaConfig')

// 错误日志-应用分类
module.exports = app => {
	const mongoose = app.mongoose
	let Schema = mongoose.Schema
	const ObjectId = Schema.ObjectId
	const ModelSchema = new Schema(config.fe)
	return mongoose.model('FeZiYou', ModelSchema, 'Fe_ZiYou')
}