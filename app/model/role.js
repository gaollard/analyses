
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 角色表
	const ModelSchema = new Schema({
		createTime: {type: Date, default: Date.now},			// 创建时间
		roleId: {type: Number, required: true},					// 角色id{1: '系统管理员', 2: '普通管理员'}
		roleName: {type: String, required: true},				// 角色名称
		authTypeId: [{type: ObjectId, ref: 'AuthorityType'}]  	// 关联权限类型表的id
	});

	return mongoose.model('Role', ModelSchema, 'role');
};