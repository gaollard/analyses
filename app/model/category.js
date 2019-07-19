
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 分类表
	const ModelSchema = new Schema({
		name: {type: String, required: true},               // 类名
		description: {type: String},                        // 说明
		createTime: {type: Date, default: Date.now}
	});

	return mongoose.model('Category', ModelSchema, 'category');
};