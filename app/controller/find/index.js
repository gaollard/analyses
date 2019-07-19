
const Controller = require('egg').Controller;

// 发现音乐控制器
class FindController extends Controller {

    // 推荐音乐
    async musicAction() {
        let ctx = this.ctx;
        let isIOS = ctx.isIOS;

        try {

            let he = await ctx.he(111);
            let musicData = await ctx.service.find.index.music();
            musicData = JSON.parse(musicData);
            let result = await ctx.helper.delay(1);
            ctx.body = {
                data: musicData.data
            };
        } catch (err) {
            ctx.body = {
                data: '错误',
                code: -1
            };
        }
    }

	// 推荐mv
    async mvAction() {
        let ctx = this.ctx;

        let delay = (n) => {
            let countTime = n * 1000;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    return reject('模拟抛错');
                }, countTime);
            });
        }

        let result = await delay(2).catch((err) => {
            return new Error(err);
        });

        if (result instanceof Error) {
            throw result;
        }

        this.ctx.body = {
            data: 'mv'
        }
    }

    // 视频
    async videoAction() {
        this.ctx.body = {
            data: 'video'
        }
    }
}

module.exports = FindController;
