module.exports = (options, app) => {
	return async (ctx, next) => {
		const source = ctx.get('user-agent') || '';
		const match = options.ua.some(ua => ua.test(source));

		if (match) {
			ctx.status = 403;
			ctx.message = '禁止robot';
		} else {
			await next();
		}
	}
};