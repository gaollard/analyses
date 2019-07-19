
const Controller = require('egg').Controller;

class CategoryController extends Controller {
    async addAction() {
	    let {service, ctx} = this;
        let params = ctx.request.body;
        let config = {
            '-1': '此分类已存在',
            '-2': '操作异常',
            '-3': '必填字段不能为空'
        };

        if (!params.name) {
            return ctx.body = {
                data: config['-3']
            };
        }

	    const res = await service.category.index.findOne({name: params.name});
	    if (res) {
		    return ctx.body = {
			    data: config[res]
		    };
	    }

        const result = await service.category.index.create(params);
        ctx.body = {
            data: config[result] || null
        };
    }
}

module.exports = CategoryController;
