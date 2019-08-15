'use strict'

module.exports = app => {
    const { router, controller } = app
	router.post('performance-report', '/api/v1/performance-report', controller.fp.create.index)
	router.post('performance-report', '/api/v1/performance-report-list', controller.fp.query.index)
    router.post('performance-report-chart', '/api/v1/performance-report-chart', controller.fp.query.chart),
    router.post('performance-report-ratio', '/api/v1/performance-report-ratio', controller.fp.query.ratio),
    router.post('performance-report-avg', '/api/v1/performance-report-avg', controller.fp.query.avg)
}
