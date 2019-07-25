'use strict';

const Service = require('egg').Service;
const moment = require('moment')

class TokenService extends Service {
    async find(params = {}) {
        if (!Object.keys(params).length) return '-1'
        const ctx = this.ctx;
        let projection = {
            'app_name': 1,
            'token': 1,
            'sign': 1,
			'time': 1, 
			'_id': 0
		}
        let result = await ctx.model.Token.find(params, projection).sort({time: -1}).limit(100);
        return result;
    }

    // 创建token
    async create(params = {}) {
		let ctx = this.ctx
		if (!Object.keys(params).length) return '-1'
        params.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
		let result = await ctx.model.Token.create(params)
        return result
	}
}

module.exports = TokenService;
