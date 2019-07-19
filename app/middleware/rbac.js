module.exports = (options) => {
	return async (ctx, next) => {
		let res = null;
		let sourceApi = ctx.path;
		const match = options.notAllowApi.some(value => value.test(sourceApi));
		if (match) return await next();

		// 获取user信息
		let {role, authority} = ctx.user;

		if (!role) {
			return ctx.body = {
				data: '无权限'
			};
		}

		// 从缓存中取权限码
		if (authority.length) {
			for (let i = 0; i < authority.length; i++) {
				if (authority[i].url === sourceApi && authority[i].roles.includes(role)) {
					res = true;
					break;
				}
			}
		} else {
			res = await ctx.service.role.authority.findAuthority({
				url: sourceApi,
				role: role
			});
		}

		if (res !== true) {
			return ctx.body = {
				data: '无此接口权限'
			};
		}

		await next();
	}
};
