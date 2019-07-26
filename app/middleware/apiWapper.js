module.exports = () => {
	return async (ctx, next) => {
		await next();

		console.log(ctx.headers)
		ctx.logger.error(ctx.headers)
		ctx.set("Access-Control-Allow-Origin",　ctx.headers.origin);
		ctx.set("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
		ctx.set("Access-Control-Allow-Credentials", true);
		ctx.set("Access-Control-Max-Age", 86400 * 30 * 12); // 24 hours
		ctx.set("Access-Control-Allow-Headers","X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	}
};
