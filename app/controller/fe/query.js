
const Controller = require('egg').Controller
const moment = require('moment')

// 错误上报查询
class ErrorReportController extends Controller {
    async index() {
		let ctx = this.ctx
		let {appNameMapping} = this.config
		let {app_name, start_time, end_time} = ctx.query
		
		if (!appNameMapping.includes(app_name)) {
			return ctx.body = {
				code: -1,
				msg: '无效应用名'
			}
		}

		if (!start_time || !end_time) {
			return ctx.body = {
				code: -1,
				msg: '时间不能为空'
			}
		}

		let res = await ctx.service.fe.index.query(app_name, ctx.query)
		ctx.body = {
			data: res
		}
	}
	
	// 图表查询
	async chart() {
		let ctx = this.ctx
		let {appNameMapping} = this.config
		let {app_name, start_time, end_time} = ctx.query
		
		if (!appNameMapping.includes(app_name)) {
			return ctx.body = {
				code: -1,
				msg: '无效应用名'
			}
		}

		if (!start_time || !end_time) {
			return ctx.body = {
				code: -1,
				msg: '时间不能为空'
			}
		}

		let res = await ctx.service.fe.index.chart(app_name, ctx.query)
		ctx.body = {
			data: res
		}
    }
}

module.exports = ErrorReportController
