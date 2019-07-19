let fieldValidate = {};
let _toString = Object.prototype.toString;

// [object String] => String
let sliceTypeStr = (str) => {
	let type = _toString.call(str);
	return type.slice(8, type.length - 1);
};

/**
 * @method distribute
 * @description 规则分发, 扩展自定义属性, 添加自定义处理方式
 *
 *
 * @实例-扩展规则
 * @method rules
 * @description 正则验证内容
 *
 * @param {Object || Array} validate 正则内容
 * @param {String} ruleValue 被验证的内容
 * @param {String} fieldName 被验证的字段名
 * @param {String} remark 字段的备注
 *
 * @return {Object} { msg: tip }
 */

fieldValidate.distribute = {
	validate: (validate, ruleValue, fieldName, remark) => {
		let returnMsg = {}, validateQueue = [];

		if (_toString.call(validate) === "[object Object]") validateQueue.push(validate);
		if (Array.isArray(validate)) validateQueue = validate;

		// 遍历执行验证规则
		validateQueue.forEach((item) => {
			let rules = item.rules,
				text = item.text || '格式不正确';

			if (!rules) return false;

			// function
			if (typeof rules === 'function') {
				if (!rules(ruleValue)) {
					returnMsg.msg = remark + ':'+ text +'[' + ruleValue + ']';
				}
			}

			// 正则
			if (_toString.call(rules) === "[object RegExp]") {
				if (!rules.test(ruleValue)) {
					returnMsg.msg = remark + ':'+ text +'[' + ruleValue + ']';
				}
			}

			return returnMsg.msg;
		});

		// 如果msg存有值, 则验证通不过
		if (returnMsg.msg) {
			return returnMsg;
		}

		return false;
	}
};

/**
 *
 * @method commonValidate
 * @description 验证字段类型, 长度, 是否必填
 * @param {String} fieldName 当前要验证的字段名
 * @param {Object} fieldAttr 当前要验证字段名的属性
 * @param {Object} options 所有的数据
 *
 * @return {Object} { msg: tip }
 */
fieldValidate.commonValidate = (fieldName, fieldAttr, options) => {
	let oName = options[fieldName], result, fn,
		typeArr = (typeof fieldAttr.type === 'string') ? [fieldAttr.type] : fieldAttr.type,
		remark = fieldAttr.remark || fieldName;

	// 是否必填
	if (fieldAttr.required && (oName === undefined || oName === null || oName === '')) {
		return {msg: remark + ':字段为必填'}
	}

	// 判断类型
	if (oName && !typeArr.includes(sliceTypeStr(oName))) {
		return {msg: remark + ':字段类型必须为[' + typeArr.join() + ']'}
	}

	// 判断长度
	if (oName && typeArr.includes('String') && oName.length > fieldAttr.maxLen) {
		return {msg: remark + ':字段长度不能大于[' + fieldAttr.maxLen + ']'}
	}

	// 适配更多设置, 扩展分发
	for (let i in fieldAttr) {
		fn = fieldValidate.distribute[i];
		if (typeof fn === 'function') {
			result = fn(fieldAttr[i], oName, fieldName, remark);
			if (result) {
				return result;
			}
		}
	}

	return false;
};

module.exports = (params = {}, configValidate = {}) => {
	let result;
	for (let i in configValidate) {
		result = fieldValidate.commonValidate(i, configValidate[i], params);
		if (result) {
			result.code = -1;
			return result;
		}
	}
	return false;
};