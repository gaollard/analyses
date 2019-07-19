
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 歌手表
	const ModelSchema = new Schema({
		name: {type: String, required: true},		                            // 歌手
		picture: {type: String, required: true},	                            // 歌手图
		summary: {type: String, required: true},	                            // 简介
		createTime: {type: Date, default: Date.now}				                // 创建时间
	});

	return mongoose.model('Singer', ModelSchema, 'singer');
};