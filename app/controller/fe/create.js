
const Controller = require('egg').Controller

// 错误上报
class ErrorReportController extends Controller {
    async index() {
		let ctx = this.ctx
		let body = ctx.method === "POST" ? ctx.request.body : ctx.query
		let serviceName = body.appName.toLocaleLowerCase()

        try {
			let res = await ctx.service.fe[serviceName].create(body)
			if (res) {
				throw res
			}
            ctx.body = {
                data: 'ok'
            }
        } catch (err) {
            ctx.body = {
                data: null,
				code: -1,
				message: err
            }
		}
    }
}

module.exports = ErrorReportController
