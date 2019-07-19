
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 权限类型表
	const ModelSchema = new Schema({
		createTime: {type: Date,default: Date.now},		// 创建时间
		code: {type: Number, required: true},			// 权限编码 {100: 'menu', 101: 'page'}
		type: {type: String, required: true}			// 权限类型
	});

	return mongoose.model('AuthorityType', ModelSchema, 'authorityType');
};