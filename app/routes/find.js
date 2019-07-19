'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.get('find-music', '/find/music', controller.find.index.musicAction);
    router.get('find-mv', '/find/mv', controller.find.index.mvAction);
    router.get('find-video', '/find/video', controller.find.index.videoAction);
};
