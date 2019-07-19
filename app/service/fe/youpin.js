'use strict'
const Service = require('egg').Service

class FeService extends Service {
    async create(params = {}) {
		let ctx = this.ctx
		if (!Object.keys(params).length) return '-1'
		let result = await ctx.model.FeYouPin.create(params)
		if (!result) return '-2'
        return null
    }
}

module.exports = FeService
