
// 验证
module.exports = (oValue, options, dir, config) => {
	let whiteList = options.whiteList || config.whiteList;
	let MAXKB = options.MAXKB || config.MAXKB;
	let fileName = oValue.name;
	let fileType = oValue.type;
	let fileKb = oValue.kb.slice(0, oValue.kb.length - 1) | 0;

	// 验证类型
	if (!whiteList.includes(fileType)) {
		return {
			msg: '无法上传' + fileType + '类型文件',
			url: dir + fileName
		};
	}

	// 验证大小
	if (fileKb > MAXKB) {
		return {
			msg: '文件不能超过' + MAXKB + 'k',
			url: dir + fileName
		};
	}

	return null;
};