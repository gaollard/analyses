'use strict';

const Service = require('egg').Service;

class SingerService extends Service {
    async create(params) {
        if (!params) return;
        const ctx = this.ctx;
        let result = await ctx.model.Singer.create(params);
        if (!result) return '-2';
        return null;
    }
}

module.exports = SingerService;
