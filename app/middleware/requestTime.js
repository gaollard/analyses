module.exports = () => {
	return async (ctx, next) => {
		let startTime = Date.now();
		await next();
		let endTime = Date.now() - startTime;
		let {method, url} = ctx;

		console.log(`请求响应时间[${endTime}ms] [${method}] [${url}]`, '-----------------------------------');
	}
};
