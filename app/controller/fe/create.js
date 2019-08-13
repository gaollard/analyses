
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
                msg: '无效应用名',
                data: {
                    sign: ''
                }
			}
        }
        
        // 强制过滤此错误相关的日志
        // https://logreport.huishoubao.com/hjxapps/
        let message = body.message || ""
        if (message.indexOf('logreport') > -1) {
            return ctx.body = {
                code: -1,
                msg: '非法日志',
                data: {
                    sign: ''
                }
            }
        }

		body.user_agent = ctx.userAgent
		body.ip = ctx.helper.ip(ctx.req)
		let sign = await this.app.createToken(ctx, body)
		body.sign = sign
		
		let res = await ctx.service.fe.index.create(app_name, body)
		ctx.body = {
			data: {
				sign: sign
			}
		}
    }
}

module.exports = ErrorReportController
