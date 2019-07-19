
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 权限表
	const ModelSchema = new Schema({
		depth: {type: Number, default: 1, required: true},		// 深度，从1递增
		pid: {type: String, default: '0', required: true},		// 父id, 关联关系
		pidList: {type: Array, default: '0', required: true},	// 分类的层级关系，从最高级到自己
		roles: {type: Array, required: true},					// 角色id[1,2,3....]
		authType: {type: Number, required: true},				// 权限类型[100, 101]
		code: {type: String, required: true},					// 编码
		nodeName: {type: String, required: true},				// 名称
		url: {type: String, default: ''},						// 访问地址
		createTime: {type: Date, default: Date.now}				// 创建时间
	});

	return mongoose.model('Authority', ModelSchema, 'authority');
};