module.exports = (options) => {
	return async (ctx, next) => {
	
		let {path, method} = ctx;
		
		let routeRes = ctx.router.match(path, method);
		if (!routeRes.route) return;
		await next();
	}
};
