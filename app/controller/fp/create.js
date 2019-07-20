
const Controller = require('egg').Controller

// 错误上报
class PerformanceReportController extends Controller {
    async index() {
		let ctx = this.ctx
		let body = ctx.method === "POST" ? ctx.request.body : ctx.query
		let {appNameMapping} = this.config

		let params = body.params || []
		let app_name = params[0].app_name
		if (!appNameMapping.includes(app_name)) {
			return ctx.body = {
				code: -1,
				msg: '无效应用名'
			}
		}

        try {
			let res = await ctx.service.fp.index.create(params)
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

module.exports = PerformanceReportController
