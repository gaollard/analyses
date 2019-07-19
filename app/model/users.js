
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	const ModelSchema = new Schema({
		createTime: {type: Date, default: Date.now},								// 创建时间
		name: {type: String, required: [true, '用户名必填'], unique: true},			// 用户名
		password: {type: String, required: [true, '密码必填']},						 // 密码
		roles: {type: Array, required: true}										// 关联角色表的角色roleId
	});

	return mongoose.model('Users', ModelSchema, 'users');
};