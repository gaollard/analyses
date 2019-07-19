'use strict';

const Service = require('egg').Service;

class RegService extends Service {
    async create(params) {
        if (!params) return;
        const ctx = this.ctx;

        // let collections = await ctx.model.Role.find({roleId: 1})  
        //     .populate('authTypeId')//注意这是联合查询的关键  
        //     .sort('createTime');
        
        //     debugger
        // await ctx.model.Role.create({
        //     roleId: 2,
        //     roleName: '文档管理员',
        //     authTypeId: ['5a72acaf1235100f988e4ebb', '5a72acaf1235100f988e4eba']
        // });

        // await ctx.model.AuthorityType.create({
        //     code: 101,
        //     type: 'page'
        // });
        // await ctx.model.AuthorityType.create({
        //     code: 100,
        //     type: 'menu'
        // });

        // await ctx.model.Authority.create({
        //     authType: 100,
        //     code: '1000000',
        //     nodeName: '系统设置',
        //     url: '/system'
        // });

        // e10adc3949ba59abbe56e057f20f883e
        let res = await ctx.service.users.common.findOneUser({name: params.name});
        if (res && res.id) return '-1';

        let result = await ctx.model.Users.create(params);
        if (!result) return '-2';
        return null;
    }
}

module.exports = RegService;
