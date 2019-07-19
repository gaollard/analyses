module.exports = () => {
	return async (ctx, next) => {
		await next();

		ctx.set("Access-Control-Allow-Origin","http://127.0.0.1:8081");
		ctx.set("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
		ctx.set("Access-Control-Allow-Credentials",false);
		ctx.set("Access-Control-Max-Age",'86400'); // 24 hours
		ctx.set("Access-Control-Allow-Headers","X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	}
};
