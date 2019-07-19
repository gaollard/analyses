module.exports = () => {
	return async (ctx, next) => {

		try {
			await next();
		} catch (err) {
			ctx.logger.error(err);
			const status = err.status || 500;
			const isProd = (status === 500 && ctx.app.config.env === 'prod');

			if (isProd) {
				ctx.body = '<h1>Internal Server Error</h1>';
			} else {
				ctx.body = {
					message: err.message,
					stack: err.stack
				};
			}
			ctx.status = status;
		}
	}
};
