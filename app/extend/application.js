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
		ctx.logger.error(res.data)
		return res.data
	},

	// 创建token
	async createToken(ctx, body = {}) {
		let token = ctx.cookies.get('token') || ctx.headers['token']
		let tokens = []
		let resSign = {}
		if (token) {
			tokens = await ctx.service.token.find({
				sign: token
			})
		}

		// 给此用户创建标签
		if (!tokens.length) {
			resSign = await ctx.generateSign({
				payload: {
					random: ctx.helper.mathId(),
					ip:　body.ip,
					app_name: body.app_name
				},
				req: ctx
			})

			let resStore = await ctx.service.token.create({
				app_name: body.app_name,
				sign: resSign.sign,
				token: resSign.token
			})

			if (!resStore) {
				ctx.cookies.set('token', resSign.sign)
			} else {
				ctx.logger.error(resStore)
			}
		}

		return resSign.sign || token || ""
	}
}