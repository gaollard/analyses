'use strict'

module.exports = app => {
    const { router, controller } = app
	router.post('performance-report', '/api/v1/performance-report', controller.fp.create.index)
	router.get('performance-report', '/api/v1/performance-report', controller.fp.query.index)
	router.get('performance-report-chart', '/api/v1/performance-report-chart', controller.fp.query.chart)
}
