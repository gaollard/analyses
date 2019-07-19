

module.exports = {
	get isIOS() {
		const iosReg = /iphone|ipad|ipod/i;
		return iosReg.test(this.get('user-agent'));
	},

	async he(options) {
		let that = this;
		return new Promise((resolve, reject) => {
			resolve('he');
		});
	}
}