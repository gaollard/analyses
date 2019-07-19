
const Controller = require('egg').Controller;

// 登录控制器
class LoginController extends Controller {
    async loginAction() {
        let ctx = this.ctx;
        let params = {};
        let body = ctx.method === "POST" ? ctx.body : ctx.query;

        params.name = body.name;
        params.password = body.password;
        params.role = body.role | 0;

        if (!params.name || !params.password || !params.role) {
            return ctx.body = {
                data: '用户名和密码和角色码不能为空'
            };
        }

        debugger
        let resUser = await ctx.service.users.common.findOneUser({name: params.name});
        if (!resUser) {
            return ctx.body = {
                data: '无此用户'
            };
        }

        // e10adc3949ba59abbe56e057f20f883e
        if (resUser.password !== ctx.helper.md5(params.password)) {
            return ctx.body = {
                data: '用户名和密码不正确'
            };
        }

        let matchRole = resUser.roles.includes(params.role);
        if (!matchRole) {
            return ctx.body = {
                data: '无此角色'
            };
        }

        // 生成签名和token
        let resSign = await ctx.generateSign({
            payload: {
                name: resUser.name,
                password: resUser.password,
                id: resUser.id,
                role: params.role
            },
            req: ctx
        });

        // 存入数据库
        let resStore = await ctx.service.token.update({
            id: resUser.id,
            sign: resSign.sign,
            token: resSign.token
        });

        if (!resStore) {
            return ctx.body = {
                data: '登录异常'
            };
        }
        
        // 根据用户角色查询查询
        let projection = {'code': 1, 'nodeName': 1, 'url': 1, 'roles': 1, '_id': 0};
        let resAuthority = await ctx.service.role.authority.findUserRoles(resUser.roles[0], projection);
        if (!resAuthority) {
            return ctx.body = {
                data: '登录异常'
            };
        }

        // token和权限码存入缓存
        ctx.cache.add(resSign.sign, {
            token: resSign.token,
            authority: resAuthority
        });
        ctx.cookies.set('token', resSign.sign);
        ctx.body = {
            data: resSign.sign
        };
    }
}

module.exports = LoginController;
