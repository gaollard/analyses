
let requestView = {

	formatKB(len) {
		return ((len / 1024) | 0) + 'k';
	},

	// 获取formdata上传类型 回车，换行的索引
	getFormdataEnterWrapIndexes(bufferArr) {
		let arr = [];
		for (let i = 0; i < bufferArr.length; i++) {
			if (bufferArr[i].toString() == 13 && bufferArr[i + 1].toString() == 10) {
				arr.push(i);
			}
			if (bufferArr[i].toString() == 26 && bufferArr[i + 1].toString() == 10) {
				arr.push(i);
			}
		}
		return arr;
	},

	// 获取formdata的值, 转成键值对
	formdataParse(buffer, enterArr) {
		let o = {};

		// 解析字符串"name="front"; filename="xx.jpg"" 成对象
		let pickFields = (str) => {
			let oReturn = {};
			if (!str) return oReturn;

			let arr = str.split('; ');
			for (let i = 0; i < arr.length; i++) {
				let newArr = [];
				if (arr[i].indexOf(': ') > -1) {
					newArr = arr[i].split(': ');
				} else {
					newArr = arr[i].split('=');
				}
				oReturn[newArr[0].trim()] = newArr[1].replace(/"/g, '');
			}
			return oReturn;
		};

		// 吧buffer转成字符串
		let bufferToString = (start, end, isToString = true) => {
			let oneBuffer = buffer.slice(start, end);
			if (isToString) {
				return oneBuffer.toString();
			}
			return oneBuffer;
		};

		let oFormData = {};
		let baseCut = null;
		let len = 0;
		let tempArr = [];
		for (let i = 0; i < enterArr.length; i++) {
			let start = !i ? 0 : enterArr[i - 1];
			let str = bufferToString(start, enterArr[i]);
			let oneBuffer = bufferToString(start, enterArr[i], false);
			if (!i) baseCut = str;

			// 归类字段
			if (str.indexOf(baseCut) > -1) {
				if (tempArr.length) oFormData[len] = tempArr;
				tempArr = [];
				len++;
				continue;
			}

			tempArr.push(oneBuffer);
		}

		for (let j in oFormData) {
			let result = {};
			let data = oFormData[j];
			result = pickFields(data[0].toString());

			// 小于2表示字段, 非文件图片
			if (Object.keys(result).length <= 2) {
				result.value = data[2].toString().trim();
			} else {
				result = Object.assign(result, pickFields(data[1].toString()));
				result['type'] = result.filename.slice(result.filename.lastIndexOf('.'));

				// 只从content-type下一个内容, slice(2) 开始截取
				if (data[3][0] === 13 || data[3][0] === 26) {
					data[3] = data[3].slice(2);
				}

				result.value = Buffer.concat(data.slice(3));
				result.kb = this.formatKB(result.value.length);
			}
			o[result.name] = result;
		}

		console.log(o);
		return o;
	},

	init(req) {
		return new Promise((resolve, reject) => {
			let chunks = [], bufferConcat, size = 0;
			let onData = (chunk) => {
				chunks.push(chunk);
				size += chunk.length;
			};
			let onEnd = () => {
				bufferConcat = Buffer.concat(chunks, size);
				console.log('原图字节len', bufferConcat.length);
				resolve(bufferConcat);
			};
			let onAborted = () => reject('abort');
			let onError = (err) => reject(err.message);

			req.on("data", onData);
			req.on("end", onEnd);
			req.on("error", onError);
			req.on("aborted", onAborted);
		});
	}
};

module.exports = requestView;