'use strict';

const Service = require('egg').Service;

class TokenService extends Service {

    // 用签名查询token
    async find(params) {
        if (!params) return;
        const ctx = this.ctx;
        let result = await ctx.model.Token.findOne(params);
        return result;
    }

    // 更新token
    async update(params) {
        if (!params) return;
        const ctx = this.ctx;
        const id = params.id;
        delete params.id;
        let result = await ctx.model.Token.update({id: id}, params, {upsert: true});
        return result;
    }
}

module.exports = TokenService;
