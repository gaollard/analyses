
const Controller = require('egg').Controller;

// 注册控制器
class AuthorityController extends Controller {
    async addAction() {
        let ctx = this.ctx;
        let params = ctx.method === "POST" ? ctx.body : ctx.query;
        let config = {
            '-1': 'code|nodeName,url,authType不能为空',
            '-2': '操作异常',
            '-3': '权限code码已被占用'
        };
        let returnFactory = (msg) => {
            ctx.body = {
                data: msg
            };
        }

        try {
            params.roles = JSON.parse(params.roles);
            params.pidList = JSON.parse(params.pidList);
        } catch(err) {
            params.roles = [];
            params.pidList = [];
        }

        if (!params.roles.length) return returnFactory('角色类型不能为空');
        if (!params.code || !params.nodeName || !params.authType) {
            return returnFactory(config['-1']);
        }
        
        const result = await this.service.role.authority.create(params);
        ctx.body = {
            data: config[result] || null
        };
    }
}

module.exports = AuthorityController;
