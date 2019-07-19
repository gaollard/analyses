'use strict';

const Service = require('egg').Service;

class SongSheetService extends Service {

    async findOne(params) {
        if (!params) return;
        const ctx = this.ctx;
        let result = await ctx.model.SongSheet.findOne(params);
        if (result && result.id) return '-3';
        return null;
    }

    async create(params) {
        if (!params) return;
        const ctx = this.ctx;

        let result = await ctx.model.SongSheet.create(params);
        if (!result) return '-2';
        return null;
    }
}

module.exports = SongSheetService;
