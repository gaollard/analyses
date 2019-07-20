
let config = require('./schemaConfig')

// 错误日志-youpin
module.exports = app => {
	const mongoose = app.mongoose
	let Schema = mongoose.Schema
	const ObjectId = Schema.ObjectId
	const ModelSchema = new Schema(config.fp)
	return mongoose.model('FpYouPin', ModelSchema, 'Fp_YouPin')
}