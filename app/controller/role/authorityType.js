
const Controller = require('egg').Controller;

// 注册控制器
class AuthorityTypeController extends Controller {
    async addAction() {
        let ctx = this.ctx;
        let params = ctx.method === "POST" ? ctx.body : ctx.query;
        let config = {
            '-1': '权限类型不能为空',
            '-2': '操作异常',
            '-3': '权限类型码已被占用'
        };

        if (!params.code || !params.type) {
            return ctx.body = {
                data: config['-1']
            };
        }
        
        const result = await this.service.role.authorityType.create(params);
        ctx.body = {
            data: config[result] || null
        };
    }
}

module.exports = AuthorityTypeController;
