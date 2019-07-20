'use strict'
const Service = require('egg').Service
const moment = require('moment')

class FpService extends Service {
	// 日志创建
    async create(params = {}) {
		let ctx = this.ctx
		if (!Object.keys(params).length) return '-1'
		console.log(params)
		
		params.map((item) => {
			item.create_time = moment(new Date()).format('YYYY-MM-DD')
			item.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
			return item
		})

		let result = await ctx.model.FpYouPin.collection.insert(params)
		if (result.result.ok !== 1) return -1
        return null
	}
	
	// 列表查询
    async query(appName, {user_id, city, start_time, end_time}) {
		const ctx = this.ctx
		let projection = {}

		let params = ctx.helper.filterEmpty({
			user_id: user_id,
			city: city,
			create_time: {
				$gte: start_time,
				$lte: end_time
			}
		}, true)

		return await ctx.model[`Fp${appName}`].find(params, projection).sort({time: -1})
	}
	
	// 图表查询
    async chart(appName, {user_id, city, start_time, end_time, tab_type = ""}) {
		const ctx = this.ctx
		let projection = {
			[tab_type]: 1,
			redirect_time: 1,
			waiting_time: 1,
			unload_event_time: 1,
			create_time: 1,
			_id: 0
		}
		let params = ctx.helper.filterEmpty({
			user_id: user_id,
			city: city,
			create_time: {
				$gte: start_time,
				$lte: end_time
			}
		}, true)

		console.log(params)

		let res = await ctx.model[`Fp${appName}`].find(params, projection).sort({time: 1})
		if (!res.length) return {}

		console.log(res)

		let oVal = {}
		for (let i = 0; i < res.length; i++) {
			let time = res[i].create_time
			let num = res[i][tab_type] || 0
			oVal[time] = Number((Number(oVal[time] || "") + num).toFixed(2))
		}
		return oVal
		// {
		// 	"2019-07-20": 30.23,
		// 	"2019-07-21": 70.23
		// }
    }
}

module.exports = FpService
