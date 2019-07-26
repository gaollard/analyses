module.exports = {
	fooApplication(param) {
		// this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
		console.log('fooApplication')
	},

	// map.qq
	async ipToLocation(ctx, ip = '') {
		let {domain} = this.config
		let url = `${domain.ip}ip=${ip}`
		let res = {}
		try {
			res = await ctx.curl(url, {
				method: 'GET',
				dataType: 'json',
				timeout: 5000		// 5s + 5s超时
			})

			if (res.data.status === 0) {
				let {result = {}} = res.data
				return {
					city: result.ad_info.city,
					result: result
				}
			} else {
				ctx.logger.error(res.data)
			}
		} catch (err) {
			ctx.logger.error(res)
			ctx.logger.error(err)
		}

		return {}
	},

	// 创建token
	async createToken(ctx, body = {}) {
		let token = ctx.cookies.get('token') || ctx.headers['token'] || body.token
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
					ip: body.ip,
					app_name: body.app_name
				},
				req: ctx
			})

			resSign.app_name = body.app_name
			let resStore = await ctx.service.token.create(resSign)
			if (!resStore) {
				ctx.logger.error(resStore)
			}
		}

		return resSign.sign || token || ""
	}
}