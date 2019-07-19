'use strict';

const Service = require('egg').Service;

class AuthorityTypeService extends Service {

    // 新增权限类型
    async create(params) {
        if (!params) return;
        const ctx = this.ctx;

        let resFind = await ctx.model.AuthorityType.findOne({code: params.code});
        if (resFind && resFind.id) return "-3";

        let resCreate = await ctx.model.AuthorityType.create(params);
        if (!resCreate) return '-2';
        return null;
    }
}

module.exports = AuthorityTypeService;
