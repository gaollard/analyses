module.exports = () => {
	return async (ctx, next) => {
		await next();
		ctx.set("xxxxxxxxxx","1");
	}
};
