'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.post('category-add', '/category/add', controller.category.index.addAction);
};
