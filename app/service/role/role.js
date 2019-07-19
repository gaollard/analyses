'use strict';

const Service = require('egg').Service;

class RoleService extends Service {
    // 新增角色
    async create(params) {
        if (!params) return;
        const ctx = this.ctx;

        let resFind = await ctx.model.Role.findOne({roleId: params.roleId});
        if (resFind && resFind.id) return "-3";

        let resCreate = await ctx.model.Role.create(params);
        if (!resCreate) return '-2';
        return null;
    }
}

module.exports = RoleService;
