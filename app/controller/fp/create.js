
const Controller = require('egg').Controller

// 错误上报
class PerformanceReportController extends Controller {
    async index() {
		let ctx = this.ctx
		let body = ctx.method === "POST" ? ctx.request.body : ctx.query
		let {appNameMapping} = this.config
		let params = body.params || []

		if (!params.length) {
			return ctx.body = {
				code: -1,
				msg: '资源不能为空'
			}
		}

		let app_name = params[0].app_name
		if (!appNameMapping.includes(app_name)) {
			return ctx.body = {
				code: -1,
				msg: '无效应用名'
			}
		}

		let oValues = {
			ip: ctx.helper.ip(ctx.req),
			app_name: app_name,
			token: body.token
		}

		// 获取城市维度统计
		let res = await this.app.ipToLocation(ctx, oValues.ip)
		let sign = await this.app.createToken(ctx, oValues)
		params.map(item => {
			item.city = res.city || ""
			item.sign = sign
            item.ip = oValues.ip
            item.url = body.url || ""
			return item
		})

		res = await ctx.service.fp.index.create(app_name, params)
		ctx.body = {
			data: {
				sign: sign
			}
		}
    }
}

module.exports = PerformanceReportController
