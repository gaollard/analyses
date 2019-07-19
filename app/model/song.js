
module.exports = app => {
	const mongoose = app.mongoose;
	let Schema = mongoose.Schema;
	const ObjectId = Schema.ObjectId;

	// 歌曲表
	const ModelSchema = new Schema({
		songSheetId: {type: ObjectId, ref: 'SongSheet', required: true},		// 歌单id
		categoryId: {type: ObjectId, ref: 'Category', required: true},			// 分类id
		singerId: {type: ObjectId, ref: 'Singer', required: true},				// 歌手id
		name: {type: String, required: true},		                            // 歌曲名
		url: {type: String, required: true},	                                // 歌曲地址
		lyric: {type: String},	                                                // 歌词
		commentOff: {type: Boolean, default: true, required: true},	            // 评论开关
		createTime: {type: Date, default: Date.now}				                // 创建时间
	});

	return mongoose.model('Song', ModelSchema, 'song');
};