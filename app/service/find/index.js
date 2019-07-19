'use strict';

const Service = require('egg').Service;

class FindService extends Service {

    // 音乐推荐
    async music() {
        let ctx = this.ctx;
        const api = this.config.api;
        const url = api.prefix + '/' + api.find.musicUrl;

        const result = await ctx.curl(url, {
            data: {
                category: 'openSend',
                day: '2017-11-04'
            }
        });

        if (result.status !== 200) return result;

        // const newsList = await Promise.all(
        //     [
        //         '2017-11-03',
        //         '2017-11-04',
        //         '2017-11-06'
        //     ].map(key => {
        //         return this.ctx.curl(url, {
        //             data: {
        //                 category: 'openSend',
        //                 day: key
        //             }
        //         });
        //     })
        // );
        // let allData = newsList.map(res => res.data.toString());
        // console.log(allData)

        return result.data.toString();
    }

    // 验证权限
    async validateAbac() {
        await this.ctx.helper.delay(0.1);
        return 'ok';
    }
}

module.exports = FindService;
