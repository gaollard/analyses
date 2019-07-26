'use strict'
const Service = require('egg').Service
const moment = require('moment')

class FpService extends Service {
	// 日志创建
    async create(appName, params = {}) {
		let ctx = this.ctx
		if (!Object.keys(params).length) return '-1'
		
		params.map((item) => {
			item.create_time = moment(new Date()).format('YYYY-MM-DD')
			item.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
			return item
		})
		
		let result = await ctx.model[`Fp${appName}`].collection.insert(params)
		if (result.result.ok !== 1) return -1
        return null
	}
	
	// 列表查询
    async query(appName, {user_id, sign, ip, city, start_time, end_time, accuracy_time, rs_type, duration, page_size = 10}) {
		const ctx = this.ctx
		let projection = {}

		let durationQuery = {}
		if (rs_type) {
			durationQuery = {
				$gte: Number(duration)
			}
		}
		
		// doc类别没有duration, 有loadTime, 暂不支持doc类型的duration查询
		if (rs_type === 'doc') {
			durationQuery = {}
		}

		let params = ctx.helper.filterEmpty({
			user_id: user_id,
			sign: sign,
			ip: ip,
			city: city,
			rs_type: rs_type,
			duration: durationQuery,
			time: accuracy_time,
			create_time: {
				$gte: start_time,
				$lte: end_time
			}
		}, true)

		return await ctx.model[`Fp${appName}`].find(params, projection).sort({time: -1}).limit(Number(page_size))
	}
	
	// 图表查询
    async chart(appName, {user_id, sign, ip, city, start_time, end_time, accuracy_time, rs_type, duration, page_size = 10}) {
		const ctx = this.ctx
		let projection = {
			ready_start: 1,
			redirect_time: 1,
			waiting_time: 1,
			unload_event_time: 1,

			domain_time: 1,
			conn_time: 1,
			https_time: 1,
			req_time: 1,
			res_time: 1,

			dom_tree_time: 1,
			dom_ready_time: 1,
			load_event_time: 1,
			load_time: 1,
			duration: 1,

			create_time: 1,
			_id: 0
		}

		let durationQuery = {}
		if (rs_type) {
			durationQuery = {
				$gte: Number(duration)
			}
		}
		
		// doc类别没有duration, 有loadTime
		if (rs_type === 'doc') {
			durationQuery = {}
		}

		let params = ctx.helper.filterEmpty({
			user_id: user_id,
			sign: sign,
			ip: ip,
			city: city,
			rs_type: rs_type,
			duration: durationQuery,
			time: accuracy_time,
			create_time: {
				$gte: start_time,
				$lte: end_time
			}
		}, true)

		let res = await ctx.model[`Fp${appName}`].find(params, projection).sort({time: 1}).limit(Number(page_size))
		if (!res.length) return {}

		let o = {}
		res.forEach(item => {
			let day = item.create_time
			if (!o[day]) o[day] = {}

			item = JSON.parse(JSON.stringify(item))
			delete item.create_time
			for (let i in item) {
				if (!o[day][i]) {
					o[day][i] = item[i]
				} else {
					o[day][i] = Number(((o[day][i] || "") + item[i]).toFixed(2))
				}
			}
		})

		return o
		// {
		// 	"2019-07-21":{
		// 		"ready_start":10,
		// 		"redirect_time":20,
		// 		"waiting_time":30,
		// 		"unload_event_time":40
		// 	},
		// 	"2019-07-22":{
		// 		"ready_start":40,
		// 		"redirect_time":13,
		// 		"waiting_time":6,
		// 		"unload_event_time":8
		// 	}
		// }
    }
}

module.exports = FpService
