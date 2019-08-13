let domain = '//analyses.huishoubao.com'
if (location.port) {
	domain = ""
}

ErrorReport.setConfig({
	api: `${domain}/api/v1/error-report`,
	user_id: '',
	app_name: 'ZiYou',
	call_name: 'business_env_appliaction'
})
Performance.setConfig({
	api: `${domain}/api/v1/performance-report`,
	user_id: '',
	app_name: 'ZiYou',
	call_name: 'business_env_appliaction'
})


let fe = {
	header: document.querySelector('#fe-header'),
	el: document.querySelector('#fe-content'),
	chart: document.querySelector('#fe-cheart'),
	dic: {
		call_name: '上报方名称',
		user_id: '用户id',
		ip: '用户ip',
		sign: 'sign',
		url: '错误url',
		file: '错误文件',
		line: '行号',
		message: '错误信息',
		stack: '错误栈',
		time: '上报时间',
		user_agent: 'userAgent'
	}
}

let node = {
	ready_start: '准备新页面时间耗时',
	redirect_time: 'redirect重定向耗时',
	waiting_time: '请求等待耗时',
	unload_event_time: 'unload前文档耗时',

	domain_time: 'DNS查询耗时',
	conn_time: 'TCP连接耗时',
	https_time: 'SSL安全连接耗时',
	req_time: 'request请求耗时',
	res_time: 'response响应耗时',

	dom_tree_time: 'dom解析构建耗时',
	dom_ready_time: '准备就绪耗时',
	load_event_time: 'load事件耗时',
	load_time: '从开始至load总耗时',
    duration: 'RTT'
}
let fp = {
	header: document.querySelector('#fp-header'),
	el: document.querySelector('#fp-content'),
	chart: document.querySelector('#fp-cheart'),

	dic: Object.assign({}, {
		//app_name: '应用名',
		call_name: '上报方名称',
		user_id: '用户id',
		city: '城市',
		ip: '用户ip',
		sign: 'sign',
		time: '创建时间',

		rs_type: '资源类型',
	}, node, {
		format_size: '资源大小K',
		file: '资源路径',
        method_type: '加载方式',
        url: 'URL'
		//network_type: '网络情况'
	})
}

let prevSortEelement = null // 存放上一个排序的dom
let sortField = ['time', 'format_size', ...Object.keys(node)]	// 排序字段

let debounce = (fn, delay = 300) => {
	let timerId
	return (...args) => {
		if (timerId) {
			clearTimeout(timerId)
		}
		timerId = setTimeout(() => {
			fn(...args)
			timerId = null
		}, delay)
	}
}

let times = (now) => {
	let time = new Date(), day,
		timeFormat = (num) => {
			if (num < 10) return "0" + num
			return num
		}

	if (now) time = new Date(now)
	day = time.getFullYear() + "-" + timeFormat(time.getMonth() + 1) + "-" + timeFormat(time.getDate())

	return {
		day: day
	}
}

let ajax = (url, method, data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${domain}/api/v1/${url}`,
			type: method || 'POST',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
			success: function (res = {}) {
				if (res.code === 0) {
					resolve(res.data)
				} else {
					resolve(res.msg)
				}
			},
			error: function (res) {
				reject(res)
			}
		})
	})
}

let docInner = (el, fields, data) => {
	let temp = []

	if (!data) {
		let htmls = []
		for (let i in fields) {
			htmls.push(`<div class="row sort-action" data-sort-name="${i}" data-text="${fields[i]}">${fields[i]}</div>`)
		}
		temp.push(`<div class="row-box header">${htmls.join('')}</div>`)
	} else {
		typeof data === 'object' && data.forEach(item => {
			let htmls = []
            let more = ""
            let isRed = ''
			fields.forEach(field => {
                // 调用栈显示
				let text = item[field]
				let originText = text
				if (field === 'stack') {
					more = `<div class="row-box hide stack-row-box"><div class="row">${text}</div></div>`
					if (text) {
						text = text.slice(0, 40) + "..."
					}
				}

				// 文件路径||错误url
				if (['file', 'url', 'user_agent'].includes(field)) {
					if (text) {
						text = text.slice(0, 40) + "..."
					}
                }
                
                // 标红 doc > 2s
                if (field === 'load_time' && text > 2000) {
                    isRed = 'red-bg'
                }

				htmls.push(`<div class="row ${field}" title="${originText}">${typeof text === "undefined" ? '/' : text}</div>`)
			})
			temp.push(`<div class="row-box fe-click ${isRed}">${htmls.join('')}</div>`)
			if (more) {
				temp.push(more)
			}
		})

		document.querySelector('.total').innerHTML = `一共（${data.length}）条`
	}

	el.innerHTML = temp.join('')
}

let renderChart = (el, opt = {}) => {
	var myChart = echarts.init(el)
	myChart.setOption(opt, true)
}

let getFromName = (selectName) => {
	let list = document.querySelectorAll(selectName)
	let oVal = {
		page_size: 300
	}
	list.forEach(item => {
		oVal[item.name] = item.value
	})
	return oVal
}

// 提交错误日志
let createErrorReport = async () => {
	let values = getFromName('#fe .form-box .search_name')
	let res = await ajax('error-report', 'POST', values)
	openCraetePop('#fe')
}

// 获取错误列表
let getFeList = async () => {
	let res = await ajax('error-report-list', 'POST', getFromName('#fe .search .search_name'))
	docInner(fe.el, Object.keys(fe.dic), res)
	getFeChart()
}

// 获取错误-图表
let getFeChart = async () => {
	let oVal = Object.assign({}, getFromName('#fe .search .search_name'))
	let res = await ajax('error-report-chart', 'POST', oVal)
	if (typeof res === 'string') {
		renderChart(fe.chart)
		return alert(res)
	}

	let xAxis = []

	let seriesData = []
	let series = [
		{
			name: '个数',
			type: 'bar',
			barWidth: '3%',
			data: seriesData
		}
	]
	res.forEach(item => {
		xAxis.push(item._id)
		seriesData.push(item.count)
	})

	let opt = {
		title: {
			text: ""
		},
		tooltip: {
			trigger: 'axis',
			axisPointer : { 
				type : 'shadow'
			}
		},
		legend: {
			data: []
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type : 'category',
			data : xAxis
		},
		yAxis: [
			{
				type : 'value'
			}
		],
		series: series
	}

	renderChart(fe.chart, opt)
}

// 提交资源性能
let createPerformanceReport = async () => {
	let values = getFromName('#fp .form-box .search_name')

	// 转成数字
	for (let i in values) {
		if (Number(values[i]) === Number(values[i])) {
			values[i] = Number(values[i])
		}
	}

	let data = {
		params: [values]
	}
	let res = await ajax('performance-report', 'POST', data)
	openCraetePop('#fp')
}

// 获取资源性能列表
let getFpList = async (opt) => {
	let query = getFromName('#fp .search .search_name')
	Object.assign(query, opt)
	let res = await ajax('performance-report-list', 'POST', query)
	docInner(fp.el, Object.keys(fp.dic), res)
	getFpChart()
}

// 获取资源性能-图表
let getFpChart = async () => {
	let oVal = Object.assign({}, getFromName('#fp .search .search_name'))
	let res = await ajax('performance-report-chart', 'POST', oVal)
	if (typeof res === 'string') {
		renderChart(fp.chart)
		return alert(res)
	}

	let series = []
	var temp = {}
	for (var i in res) {
		for (var j in res[i]) {
			if (!temp[j]) {
				temp[j] = []
			}

			temp[j].push(res[i][j])
		}
	}
	Object.keys(temp).forEach((item, index) => {
		series.push({
			name: item,
			type: 'bar',
			barWidth: '3%',
			data: Object.values(temp[item])
		})
	})

	let opt = {
		title: {
			text: ""
		},
		tooltip: {
			trigger: 'axis',
			axisPointer : { 
				type : 'shadow'
			}
		},
		legend: {
			type: 'scroll',
			left: 30,
			right: 30,
			top: 0,
			bottom: 30,
			data: Object.keys(node),
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type : 'category',
				data : Object.keys(res)
			}
		],
		yAxis: [
			{
				type : 'value'
			}
		],
		series: series
	}
	renderChart(fp.chart, opt)
}

// 打开新增内容层
let openCraetePop = (el) => {
	let formBox = document.querySelector(`${el} .form-box`)
	if (formBox.classList.contains('hide')) {
		return formBox.classList.remove('hide')
	}
	formBox.classList.add('hide')
}

let init = (page = '') => {
	let timeDayEnd = document.querySelectorAll('.time_day_end')
	timeDayEnd.forEach(item => item.value = times().day)

	let timeDayStart = document.querySelectorAll('.time_day_start')
	timeDayStart.forEach(item => item.value = times(Date.now() - 1000 * 60 * 60 * 24 * 7).day)

	if (page === 'error') {
		docInner(fe.header, fe.dic)
		getFeList()
		fe.el.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('stack')) {
				let nextElement = evt.target.parentElement.nextElementSibling
				if (!nextElement) return
				if (nextElement.classList.contains('hide')) {
					return nextElement.classList.remove('hide')
				}
				nextElement.classList.add('hide')
			}
        }, false)
	}

	if (page === 'performance') {
		docInner(fp.header, fp.dic)
		getFpList()

		fp.header.addEventListener('click', (evt) => {
			let target = evt.target
			let {text, sortName} = target.dataset
			let sortAction = ''
			if (!target.classList.contains('sort-action')) return;
			if (!sortField.includes(sortName)) return;

			// 重置上一个排序dom
			if (prevSortEelement && prevSortEelement.dataset.sortName !== sortName) {
				prevSortEelement.innerHTML = prevSortEelement.dataset.text
			}

			prevSortEelement = target;

			// 默认降序排列, 从大到小, 时间从近到远
			// &#8593; 升序 asc
			// &#8595; 降序 desc
			if (target.classList.contains('desc')) {
				target.innerHTML = `&#8595;${text}`
				target.classList.remove('desc')
				sortAction = -1
			} else {
				target.innerHTML = `&#8593;${text}`
				target.classList.add('desc')
				sortAction = 1
			}

			sortAction && getFpList({
				sort: {
					[sortName]: sortAction
				}
			})
		})
	}
}