'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.post('songSheet-add', '/songSheet/add', controller.songSheet.index.addAction);
};
