
const Controller = require('egg').Controller

// 资源性能查询
class ErrorReportController extends Controller {
	async query(action) {
		let ctx = this.ctx
		let {appNameMapping} = this.config
		let body = ctx.method === "POST" ? ctx.request.body : ctx.query
		let {app_name, start_time, end_time} = body
		
		if (!appNameMapping.includes(app_name)) {
			return {
				code: -1,
				msg: '无效应用名'
			}
		}

		if (!start_time || !end_time) {
			return {
				code: -1,
				msg: '时间不能为空'
			}
		}

		let res = await ctx.service.fp.index[action](app_name, body)
		return {
			data: res
		}
	}

	// 列表查询
    async index() {
		let ctx = this.ctx
		let res = await this.query('query')
		ctx.body = res
	}
	
	// 图表查询
	async chart() {
		let ctx = this.ctx
		let res = await this.query('chart')
		ctx.body = res
    }

    // 比例查询
    async ratio() {
        let ctx = this.ctx
		let res = await this.query('ratio')
		ctx.body = res
	}
}

module.exports = ErrorReportController
