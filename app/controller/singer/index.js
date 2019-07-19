
const Controller = require('egg').Controller;

let configValidate = {
	name: {
		remark: '歌手名', type: 'String', required: true, maxLen: 4
	},
	summary: {
		remark: '歌手简介', type: 'String', required: true, maxLen: 200
	},
	picture: {
		remark: '歌手图片', type: ['Uint8Array', 'String'], required: true
	}
};

class SingerController extends Controller {

	async addAction() {
		const ctx = this.ctx;
		let params = {};
		let oSaveState;
		let config = {
			'-1': '必填字段不能为空',
			'-2': '操作异常'
		};

		let res = await ctx.getFileBuffer();
		params.name = res.name.value;
		params.summary = res.summary.value;
		params.picture = res.picture.value;

		let validateRes = await ctx.validate(params, configValidate);
		if (validateRes) {
			return ctx.body = {
				code: validateRes.code,
				data: validateRes.msg
			};
		}

		let random = () => '-' + ctx.helper.mathId().slice(0, 5) +'-'+ ctx.helper.day.timeStamp();
		res['picture'].name = res['picture'].name + random() + res['picture'].type;
		oSaveState = await ctx.saveFileToDisk({
			values: {picture: res.picture},
			dirPath: 'singer/',
			whiteList: ['.jpg'],
			MAXKB: 2000
		});

		let result;
		if (oSaveState.data.length) {
			params.picture = oSaveState.data[0].picture;
			result = await this.service.singer.index.create(params);
			ctx.body = {
				data: config[result] || params
			};
		} else {
			ctx.body = {
				data: oSaveState.error[0]
			};
		}
	}
}

module.exports = SingerController;
