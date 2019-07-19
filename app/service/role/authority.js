'use strict';

const Service = require('egg').Service;

class AuthorityService extends Service {

    // 查询用户当前角色所有权限码
    async findUserRoles(role, projection) {
        if (!role) return;
        const ctx = this.ctx;
        
        role = ctx.helper.isArray(role) ? role : [role];
        let res = await ctx.model.Authority.find({roles: {$in: role}}, projection);
        if (!res) return "-1";
        return res;
    }

    // 查询权限码
    async findAuthority(params) {
        if (!params) return;
        const ctx = this.ctx;
        const {role, url} = params;

        let res = await ctx.model.Authority.findOne({url: url});
        if (!res) return "-1";
        return res.roles.includes(role);
    }

    // 新增权限
    async create(params) {
        if (!params) return;
        const ctx = this.ctx;

        let resFind = await ctx.model.Authority.findOne({code: params.code});
        if (resFind && resFind.id) return "-3";

        let resCreate = await ctx.model.Authority.create(params);
        if (!resCreate) return '-2';
        return null;
    }
}

module.exports = AuthorityService;
