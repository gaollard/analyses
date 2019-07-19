'use strict'

module.exports = app => {
    const { router, controller } = app
    router.post('error-report-add', '/api/v1/error-report-add', controller.fe.create.index)
    // router.get('find-mv', '/find/mv', controller.find.index.mvAction)
    // router.get('find-video', '/find/video', controller.find.index.videoAction)
}
