module.exports = () => {
	return async (ctx, next) => {
		await next();

		if (ctx.status === 404 && !ctx.body) {
			if (ctx.acceptJSON) {
				ctx.body = {
					data: 'Not Found'
				};
			} else {
				ctx.body = {
					data: 'Page Not Found!!!'
				};
			}
		}
	}
};
