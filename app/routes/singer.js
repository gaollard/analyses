'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.post('singer-add', '/singer/add', controller.singer.index.addAction);
};
