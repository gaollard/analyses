var fs = require("fs");
var path = require("path");

let writeFileView = {

	// 检测创建目录
	mkdirsSync(dirname) {
		if (fs.existsSync(dirname)) {
			return true;
		} else {
			if (this.mkdirsSync(path.dirname(dirname))) {
				fs.mkdirSync(dirname);
				return true;
			}
		}
	},

	// 写入文件
	write(params = {}, charset = 'utf8') {
		return new Promise((resolve, reject) => {
			let {dirFileName, fieldName, value, origin} = params;
			if (!fieldName) return reject({msg: '无写入文件', url: dirFileName || ''});

			let writable = fs.createWriteStream(dirFileName, {
				flags: 'w',
				defaultEncoding: charset
			});
			writable.on('finish', () => resolve({[fieldName]: origin +'/'+ dirFileName}));
			writable.on('end', () => resolve({[fieldName]: origin +'/'+ dirFileName}));
			writable.on('error', (err) => reject({msg: err.message, url: dirFileName}));
			writable.write(value, charset);
			writable.end();
		});
	}
};

module.exports = writeFileView;