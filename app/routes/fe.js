'use strict'

module.exports = app => {
    const { router, controller } = app
	router.post('error-report', '/api/v1/error-report', controller.fe.create.index)
	router.get('error-report', '/api/v1/error-report', controller.fe.query.index)
	router.get('error-report-chart', '/api/v1/error-report-chart', controller.fe.query.chart)
    // router.get('find-mv', '/find/mv', controller.find.index.mvAction)
    // router.get('find-video', '/find/video', controller.find.index.videoAction)
}
