
const Controller = require('egg').Controller;

// 注册控制器
class RegController extends Controller {
    async regAction() {
        let ctx = this.ctx;
        let params = ctx.method === "POST" ? ctx.body : ctx.query;
        let config = {
            '-1': '此用户已存在',
            '-2': '操作异常',
            '-3': '必填字段不能为空'
        };

        try {
            params.roles = JSON.parse(params.roles);
        } catch(err) {
            params.roles = [];
        }
        
        if (!params.name || !params.password) {
            return ctx.body = {
                data: config['-3']
            };
        }

        const result = await this.service.users.reg.create(params);
        ctx.body = {
            data: config[result] || null
        };
    }
}

module.exports = RegController;
