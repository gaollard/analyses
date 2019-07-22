module.exports = {
	fooApplication(param) {
		// this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
		console.log('fooApplication')
	},

	// map.qq
	async ipToLocation(ctx, ip = '') {
		let {domain} = this.config
		let url = `${domain.ip}ip=${ip}`
		let res = await ctx.curl(url, {
			method: 'GET',
			dataType: 'json',
		})

		if (res.data.status === 0) {
			let {result = {}} = res.data
			return {
				city: result.ad_info.city,
				result: result
			}
		}

		// 错误
		ctx.logger.error(res.data);
		return res.data
	}
}