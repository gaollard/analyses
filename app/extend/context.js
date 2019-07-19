
module.exports = {
	async typeValueTransform(params = {}, configs = {}) {
		if (!Object.keys(params).length || !Object.keys(configs).length) return {};

		for (let i in params) {
			let config = configs[i] || {};
			let value = params[i].value;
			let type = config.type;
			if (!type) continue;

			if (value === 'undefined' || value === '') {
				params[i].value = '';
				continue;
			}

			if (this.helper.isUint8Array(value)) continue;

			if (type === 'String') {
				params[i].value = value;
				continue;
			}

			try {
				params[i].value = JSON.parse(value);
			} catch(err) {
				params[i].value = '';
			}
		}

		return params;
	}
};