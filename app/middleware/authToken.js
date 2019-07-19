module.exports = (options) => {
	return async (ctx, next) => {
		let res = null;
		let config = {
			'1': 'token已过期',
			'2': 'token无效, 伪造',
			'3': '解析token失败, 操作异常',
			'4': '无权限',
			'5': 'token无效'
		};
		
		ctx.user = {};
		let sourceApi = ctx.path;
		const match = options.notAllowApi.some(value => value.test(sourceApi));
		if (match) return await next();

		let sign = ctx.cookies.get('token') || ctx.headers['token'];
		if (!sign) {
			return ctx.body = {
				data: config['4']
			}
		}
		
		// 先取缓存中的token
		res = ctx.cache.query(sign);
		if (res) {
			res.sign = sign;
		} else {
			res = await ctx.service.token.find({sign: sign});
		}
		if (res.sign !== sign) {
			return ctx.body = {
				data: config['5']
			}
		}

		// 检验token状态
		let resTokenState = await ctx.checkToken(res.token, ctx);
		if (ctx.helper.isObject(resTokenState)) {
			ctx.user = Object.assign(resTokenState, {
				sign: res.sign,
				token: res.token,
				authority: res.authority || []
			});
			return await next();
		}

		return ctx.body = {
			data: config[resTokenState]
		};
	}
};
