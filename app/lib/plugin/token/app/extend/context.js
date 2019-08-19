let jwt = require("jsonwebtoken");

/**
 * @method signAdapter
 * @description 分发处理签名, 可用多种方式签名, 默认是客户端签名[client], 生成md5签名
 */
let signAdapter = {
    type: {
        client: "client",
        other: "other"
    },
    create: function(options, helper) {
        return helper.md5(options);
    },

    // 根据客户端信息生成
    client: function( payload, req ) {
        let helper = req.helper,
            userAgent = req.headers['user-agent'];

        payload.ip = helper.ip(req);
        payload.userAgent = userAgent;
        payload.type = 'client';

        return {
            payload: payload,
            sign: this.create({
                time: helper.day.timeSeconds(),
                id: helper.mathId(),
                ip: ip,
                userAgent: userAgent
            }, helper)
        }
    }
};

let tokenValidate = {
    client: function(req, token = {}) {
        let clientIp = req.socket.remoteAddress,
            ip = clientIp.slice(7),
            userAgent = req.headers['user-agent'],
            isPass = false;

        if (!token.ip || !token.userAgent) return isPass;
        if (token.ip !== ip) return isPass;
        if (token.userAgent !== userAgent) return isPass;

        isPass = true;
        return isPass;
    }
};

let pluginView = {

	/**
	 * method generateSign
	 * @description 生成签名串, 根据payload生成token, 返回给前端引用token
	 * @param {Object} opt 一些标识, token内容, http req
	 */
	async generateSign(opt) {
		return new Promise(async (resolve, reject) => {
            let type = opt.type || "client", result,
                payload = opt.payload || {},
				signHandle = signAdapter[type];
    
			result = signHandle.call(signAdapter, payload, opt.req);    // 生成签名
			let token = await opt.req.generateToken(result.payload);    // 生成token

            resolve({
                sign: result.sign,
                token: token
            });
		});
    },
    
    // 生成token
    async generateToken(options = {}) {
        let config = this.app.config.token;
        return new Promise((resolve, reject) => {
            let token = jwt.sign(options, config.key, {
                expiresIn: config.expiresTime
            });
            resolve(token);
        });
    },

    // 检测token 根据signToken( 签名 )来检测token是否有效, 是否过期, 如果过期则重新登录
    async checkToken(token, ctx) {
        let key = this.app.config.token.key;
        return new Promise((resolve, reject) => {
            // 验证token, 传输私钥
            jwt.verify(token, key, function(err, decode) {
                if (err) return resolve('1');
                try {
                    // 验证token是否伪造
                    let isPass = tokenValidate[decode.type](ctx, decode);
                    if (!isPass) return resolve('2');
                    return resolve(decode);
                } catch(err) {
                    return resolve('3');
                }
            });
        });
    }
}

module.exports = pluginView;