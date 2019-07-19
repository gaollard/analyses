
const reqBody = require('../../lib/getRequestBody');
const writeFile = require('../../lib/writeFile');
const validate = require('../../lib/validate');
const queryString  = require( "querystring" );

module.exports = {

	/**
     * @method getFileBuffer
     * @description 获取form-data传过来的值
	 * @returns {Promise}
	 */
	async getFileBuffer() {
	    let {req} = this;
		let buffer = await reqBody.init(req);
		let enterArr = reqBody.getFormdataEnterWrapIndexes(buffer);
		return reqBody.formdataParse(buffer, enterArr);
    },

	/**
	 * @method getFileFormData
	 * @description 当ctx.request.rawBody为字符串contentType: www-form-urlencoded解析方法
	 * 设置bodyParser.ignore 可以配置允许匹配的路由 不默认解析rawBody
	 * @returns {Promise}
	 */
	async getFileFormData() {
		let {req} = this;
		let buffer = req.wwwFormBuffer;     // 此字段是扩展raw-body.js文件得来
		if (!buffer) return null;
		let enterArr = reqBody.getFormdataEnterWrapIndexes(buffer);
		return reqBody.formdataParse(buffer, enterArr);
	},

	/**
	 * @method saveFileToDisk
	 * @description 保存文件
	 * @param {Object} options 额外配置参数
	 *      @param {Array} values 需要写入的内容 {name[文件名], type[类型], kb[大小], value[Buffer]}
	 *      @param {String} dirPath 文件保存的路径
	 *      @param {Array} whiteList 可保存文件的类型, 白名单
	 *      @param {Number} MAXKB 最大上传大小 单位为K
	 *      @param {String} writeType 写入类型{writeStr: 字符串写入, write: buffer写入 }
	 * @returns {Promise.<{data: Array, error: Array}>}
	 */
	async saveFileToDisk(options) {
		let dir = options.dirPath;
		let values = options.values;
		let writeType = options.writeType || 'write';
		let config = this.app.config.upload;
		let data = [];
		let error = [];

		dir = config.defaultDir + (dir || 'default');
		writeFile.mkdirsSync(dir);

		for (let i in values) {
			let fileName = values[i].name;

			// 验证
			let resValidate = validate(values[i], options, dir, config);
			if (resValidate) {
				error.push(resValidate);
				continue;
			}

			let res = await writeFile[writeType]({
				dirFileName: dir + fileName,
				value: values[i].value,
				fieldName: i,
				origin: this.origin
			}, config.defaultCharset);

			if (res.msg) {
				error.push(res);
			} else {
				data.push(res);
			}
		}

		return {
			data,
			error
		}
	}
};
