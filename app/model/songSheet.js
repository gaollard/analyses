
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 歌单表
	const ModelSchema = new Schema({
		categoryId: {type: ObjectId, ref: 'Category', required: true},		    // 分类关联id
		userId: {type: ObjectId, ref: 'Users', required: true},				    // 用户关联id
		name: {type: String, required: true},		                            // 歌单名
		description: {type: String},		                                    // 歌单说明
		coverPicture: {type: String, required: false},	                        // 封面图
		listenCount: {type: Number, default: 0, required: true},				// 听过总数
		favoriteCount: {type: Number, default: 0, required: true},				// 收藏总数
		shareCount: {type: Number, default: 0, required: true},					// 分享总数
		recommend: {type: Number, default: -1, required: true},				    // 推荐位置
		createTime: {type: Date, default: Date.now}				                // 创建时间
	});

	return mongoose.model('SongSheet', ModelSchema, 'songSheet');
};