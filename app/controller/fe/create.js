
const Controller = require('egg').Controller

// 错误上报
class ErrorReportController extends Controller {
    async index() {
		let ctx = this.ctx
		let body = ctx.method === "POST" ? ctx.request.body : ctx.query
		let {appNameMapping} = this.config
		let {app_name} = body

		if (!appNameMapping.includes(app_name)) {
			return ctx.body = {
				code: -1,
				msg: '无效应用名'
			}
		}

        try {
			let res = await ctx.service.fe.index.create(app_name, body)
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
