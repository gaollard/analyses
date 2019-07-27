'use strict'
const Service = require('egg').Service
const moment = require('moment')

class FeService extends Service {
	// 日志创建
    async create(appName, params = {}) {
		let ctx = this.ctx
		if (!Object.keys(params).length) return '-1'
		params.create_time = moment(new Date()).format('YYYY-MM-DD')
		params.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
		let result = await ctx.model[`Fe${appName}`].create(params)
		if (!result) return '-2'
        return null
	}
	
	// 列表查询
    async query(appName, {user_id, sign, ip, call_name, start_time, end_time, page_size = 10}) {
		const ctx = this.ctx
		let projection = {
			'user_id': 1, 
			'ip': 1,
			'call_name': 1,
			'sign': 1,
			'url': 1, 
			'file': 1, 
			'line': 1, 
			'message': 1, 
			'stack':1, 
			'time': 1, 
			'user_agent': 1,
			'_id': 0
		}

		let params = ctx.helper.filterEmpty({
			user_id: user_id,
			sign: sign,
			ip: ip,
			call_name: call_name,
			create_time: {
				$gte: start_time,
				$lte: end_time
			}
		}, true)

		// {roles: {$in: role}}, {}
		return await ctx.model[`Fe${appName}`].find(params, projection).sort({time: -1}).limit(Number(page_size))
	}
	
	// 图表查询
    async chart(appName, {user_id, sign, ip, call_name, start_time, end_time}) {
		const ctx = this.ctx
		let params = ctx.helper.filterEmpty({
			user_id: user_id,
			sign: sign,
			ip: ip,
			call_name: call_name,
			create_time: {
				$gte: start_time,
				$lte: end_time
			}
		}, true)
		let res = await ctx.model[`Fe${appName}`].aggregate([
			{
				$match: params
			},
			{
				$group: {
					_id: "$create_time", 
					count: {
						$sum: 1
					}
				}
			},
			{
				$sort: {
					"count": -1
				}
			}
		])

		return res
		// [
		// 	{
		// 		"_id": "2019-07-20",
		// 		"count": 3
		// 	},
		// 	{
		// 		"_id": "2019-07-21",
		// 		"count": 1
		// 	}
		// ]
    }
}

module.exports = FeService
