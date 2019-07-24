module.exports = () => {
	return async (ctx, next) => {
		await next();

		console.log(ctx.request.header, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
		ctx.set("Access-Control-Allow-Origin",　ctx.request.header.host);
		ctx.set("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
		ctx.set("Access-Control-Allow-Credentials",true);
		ctx.set("Access-Control-Max-Age",'86400'); // 24 hours
		ctx.set("Access-Control-Allow-Headers","X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	}
};
