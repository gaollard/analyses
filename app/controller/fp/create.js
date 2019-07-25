
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

		// 获取城市维度统计
		body.ip = ctx.helper.ip(ctx.req)
		let res = await this.app.ipToLocation(ctx, body.ip)
		let sign = await this.app.createToken(ctx, body)
		params.map(item => {
			item.city = res.city || ""
			item.sign = sign
			item.ip = body.ip
			return item
		})

		res = await ctx.service.fp.index.create(app_name, params)
		ctx.body = {
			data: res
		}
    }
}

module.exports = PerformanceReportController
