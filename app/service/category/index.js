'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {

	async findOne(params) {
		if (!params) return;
		const ctx = this.ctx;
		let result = await ctx.model.Category.findOne(params);
		if (result && result.id) return '-1';
		return null;
	}

    async create(params) {
        if (!params) return;
        const ctx = this.ctx;
        let result = await ctx.model.Category.create(params);
        if (!result) return '-2';
        return null;
    }
}

module.exports = CategoryService;
