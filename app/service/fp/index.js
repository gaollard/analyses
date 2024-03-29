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

	// 查询RTT load_time查询参数
	getRttParam(rs_type = "", duration = "") {
		let query = {}
		let rtt = {
			duration: {
				$gte: Number(duration)
			}
		}
		let loadTime = {
			load_time: {
				$gte: Number(duration)
			}
		}

		if (duration) {
			if (!rs_type) {
				query = {
					"$or": [
						rtt,
						loadTime
					]
				}
			}
			if (rs_type) query = rtt
			if (rs_type === 'doc') query = loadTime	// 如果是doc, 则以load_time字段查询, 否则已duration查询
		}

		return query
	}

	// 获取列表和图表查询条件
	getFindParams(opt = {}) {
		const ctx = this.ctx
		return ctx.helper.filterEmpty(Object.assign({
			user_id		: opt.user_id,
			sign		: opt.sign,
			ip			: opt.ip,
			city		: opt.city,
			call_name	: opt.call_name,
			rs_type		: opt.rs_type,
			time		: opt.accuracy_time,
			create_time	: {
				$gte: opt.start_time,
				$lte: opt.end_time
			}
		}, this.getRttParam(opt.rs_type, opt.duration)), true)
	}
	
	// 列表查询
    async query(appName, opt) {
		const ctx = this.ctx
		let projection = {}
		let sort = opt.sort || {time: -1}
		return await ctx.model[`Fp${appName}`].find(this.getFindParams(opt), projection).sort(sort).limit(Number(opt.page_size))
	}
	
	// 图表查询
    async chart(appName, opt) {
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

		let sort = opt.sort || {time: -1}
		let res = await ctx.model[`Fp${appName}`].find(this.getFindParams(opt), projection).sort(sort).limit(Number(opt.page_size))
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
