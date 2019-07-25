const crypto = require( "crypto" )
const _toString = Object.prototype.toString
let isType = function( o ) {
    return function( str ) {
        return _toString.call( str ) === "[object "+ o +"]"
    }
}

// 帮助工具函数
module.exports = {
	// this 是 helper 对象，在其中可以调用其他 helper 方法
	// this.ctx => context 对象
	// this.app => application 对象

	isArray: isType('Array'),
	isObject: isType('Object'),
	isFunction: isType('Function'),
	isString: isType('String'),
	isBoolean: isType('Boolean'),
	isRegExp: isType('RegExp'),
	isNumber: isType('Number'),
	isUint8Array: isType('Uint8Array'),

	// 获取ip
	ip(req) {
		let clientIp = req.headers[ 'x-forwarded-for' ] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress
		return clientIp
	},

	// 过滤空参数{ null, undefined, '' }
	filterEmpty(opt = {}, deep = false) {
		let recursion = (opt, deep) => {
			if (!this.isObject(opt)) return {}
			if (!Object.keys(opt).length) return {}
			for (let i in opt) {
				if (opt[i] === '' || opt[i] === null || opt[i] === undefined || opt[i] !== opt[i]) {
					delete opt[i]
				}
				
				if (deep && this.isObject(opt[i])) {
					return recursion(opt[i], deep)
				}
			}
		}
		recursion(opt, deep)

		let empty = (opt) => {
			for (let i in opt) {
				if (!Object.keys(opt[i]).length) {
					delete opt[i]
				}
			}
		}
		empty(opt)
		return opt
	},

	// 判断是否为空 仅限于{ Array, Object, String }类型
	isEmptyValue(params) {
		params = params || {}
		return Object.keys(params).length
	},

	// 所有框架扩展, 不能出现reject状态, 否则直接被框架捕获, 直接走自定义的errorHandle中间件
	delay(n) {
		let countTime = n * 1000
		return new Promise((resolve, reject) => {
			return setTimeout(() => {
				return resolve(countTime)
			}, countTime)
		})
	},

	// 随机数
	mathId(num) {
		num = num || '0'
		let str = "xxxxx-xxxx-"+ num +"xxx-yxxx-xxxxxxxxx"
		return str.replace(/[xy]/g,function(c){
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r&0x3|0x8)
			return v.toString(16)
		}).toUpperCase()
	},

	// 生成md5
	md5(options) {
		options = options || ''
		var md5, result = ''

		if (!options) return result

		if (!this.isString(options)) {
			options = JSON.stringify(options)
		}

		md5 = crypto.createHash('md5')
		result = md5.update(options).digest('hex')
		return result
	},

	/**
     * @method day
     * @description 时间格式化
     *
     * @method generate 生成基准时间对象
     * @method timeStamp 返回时间戳, 1486779531201
     * @method date 返回年月日, 2017-02-11
     * @method hours 返回时分秒, 10:18:51
     * @method seconds 返回毫秒, 204
     * @method timeSeconds 返回年月日-时分秒-毫秒, 2017-02-11 10:18:51:205
     * @method time 返回年月日-时分秒, 2017-02-11 10:18:51
     *
     */
	day: {
        generate: function() {
            let time = new Date(), day, hours,
                getMilliseconds = time.getMilliseconds(),
                timeFormat = function(num) {
                    if (num < 10) return "0" + num
                    return num
                }

            day = time.getFullYear() + "-" + timeFormat(time.getMonth() + 1) + "-" + timeFormat(time.getDate());
            hours = time.toTimeString().slice(0, 8)

            return {
                timeStamp: +time,
                day: day,
                hours: hours,
                seconds: getMilliseconds
            }
        },
        timeStamp: function() {
            return this.generate().timeStamp
        },
        date: function() {
            return this.generate().day
        },
        hours: function() {
            return this.generate().hours
        },
        seconds: function() {
            return this.generate().seconds
        },
        timeSeconds: function() {
            let o = this.generate()
            return o.day + ' ' + o.hours + ':' + o.seconds
        },
        time: function(timeStamp) {
            let o = this.generate(timeStamp)
            return o.day + ' ' + o.hours
        }
    }
}