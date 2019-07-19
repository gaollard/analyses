
const Controller = require('egg').Controller;

// 注册控制器
class RoleController extends Controller {
    async addAction() {
        let ctx = this.ctx;
        let params = ctx.method === "POST" ? ctx.body : ctx.query;
        let config = {
            '-1': '角色码不能为空',
            '-2': '操作异常',
            '-3': '角色码id已被占用'
        };

        if (!params.roleId || !params.roleName) {
            return ctx.body = {
                data: config['-1']
            };
        }
        
        const result = await this.service.role.role.create(params);
        ctx.body = {
            data: config[result] || null
        };
    }
}

module.exports = RoleController;
