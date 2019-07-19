
module.exports = app => {
	const mongoose = app.mongoose;
	const ModelSchema = new mongoose.Schema({
		id: {type: String, required: true, unique: true},   // 用户id, 唯一的
		sign: {type: String, required: true},               // 签名(返回给前端的)
		token: {type: String, required: true},              // token
		time: {type: Date, required: true, default: Date.now()}
	});

	return mongoose.model('Token', ModelSchema, 'token');
};