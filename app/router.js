'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app
	require('./routes/find')(app)
	require('./routes/users')(app)
	require('./routes/role')(app)
	require('./routes/singer')(app)
	require('./routes/category')(app)
	require('./routes/songSheet')(app)

	require('./routes/fe')(app)
	require('./routes/fp')(app)
}