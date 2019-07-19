module.exports = (options) => {
	return async (ctx, next) => {
		let res = {};
		let sourceApi = ctx.url;
		const match = options.allowApi.some(value => value.test(sourceApi));

		if (!match) return await next();

		await next();
		console.log('returnFactory');
		let data = ctx.body.data;
		res.code = ctx.body.code || 0;
		res.data = data;

		ctx.body = {
			code: res.code,
			data: res.data,
			msg: res.err,
			time: Date.now()
		}
	
	}
};
