
const Controller = require('egg').Controller

// 错误上报
class ErrorReportController extends Controller {
    async action() {
		let ctx = this.ctx
		let body = ctx.method === "POST" ? ctx.request.body : ctx.query

        try {
			let res = await ctx.service.errorReport.index.create(body);
			if (res) {
				throw res
			}
            ctx.body = {
                data: 'ok'
            };
        } catch (err) {
            ctx.body = {
                data: null,
				code: -1,
				message: err
            };
		}
    }
}

module.exports = ErrorReportController
