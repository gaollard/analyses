'use strict';

const Service = require('egg').Service;

class CommonService extends Service {

    // 查询单条用户信息
    async findOneUser(params) {
        if (!params) return;
        const ctx = this.ctx;
        let result = await ctx.model.Users.findOne(params);
        return result;
    }
}

module.exports = CommonService;
