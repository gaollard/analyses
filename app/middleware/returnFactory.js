module.exports = (options) => {
	return async (ctx, next) => {
		let sourceApi = ctx.url
		const match = options.allowApi.some(value => value.test(sourceApi))

		if (!match) return await next();

		await next();
		console.log('returnFactory');
		ctx.body = {
			code: ctx.body.code || 0,
			data: ctx.body.data || null,
			msg: ctx.body.msg || " ",
			time: Date.now()
		}
	}
}
