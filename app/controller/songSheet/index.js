
const Controller = require('egg').Controller;

let configValidate = {
	categoryId: {remark: '分类id', type: 'String', required: true},
	userId: {remark: '用户id', type: 'String', required: true},
	name: {remark: '歌手名', type: 'String', required: true, maxLen: 4},
	description: {remark: '歌单说明', type: 'String', maxLen: 200},
	coverPicture: {remark: '封面图', type: ['Uint8Array', 'String'], required: true},
	listenCount: {remark: '听过总数', type: 'Number', required: true},
	favoriteCount: {remark: '收藏总数', type: 'Number', required: true},
	shareCount: {remark: '分享总数', type: 'Number', required: true},
	recommend: {remark: '推荐位置', type: 'Number', required: true}
};

class SongSheetController extends Controller {

	async addAction() {
		let {service, ctx} = this;
		let params = {};
		let oSaveState;
		let config = {
			'-3': '此歌单已存在',
			'-1': '必填字段不能为空',
			'-2': '操作异常'
		};

		let res = await ctx.getFileBuffer();
		res = await ctx.typeValueTransform(res, configValidate);
		for (let i in res) {
			params[i] = res[i].value;
		}

		let validateRes = await ctx.validate(params, configValidate);
		if (validateRes) {
			return ctx.body = {
				code: validateRes.code,
				data: validateRes.msg
			};
		}

		const resFindOne = await service.songSheet.index.findOne({name: params.name});
		if (resFindOne) {
			return ctx.body = {
				data: config[resFindOne]
			};
		}

		let random = () => '-' + ctx.helper.mathId().slice(0, 5) +'-'+ ctx.helper.day.timeStamp();
		res['coverPicture'].name = res['coverPicture'].name + random() + res['coverPicture'].type;
		oSaveState = await ctx.saveFileToDisk({
			values: {coverPicture: res.coverPicture},
			dirPath: 'songSheet/',
			whiteList: ['.jpg', '.git', '.png'],
			MAXKB: 2000
		});

		// 获取图片地址
		if (oSaveState.data.length) {
			params.coverPicture = oSaveState.data[0].coverPicture;
		} else {
			return ctx.body = {
				data: oSaveState.error[0]
			};
		}

		let resSongSheet = await service.songSheet.index.create(params);
		return ctx.body = {
			data: config[resSongSheet] || params
		};
	}
}

module.exports = SongSheetController;
