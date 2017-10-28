/* jshint node: true */
module.exports = function (common, specific, template, router, webconfig, extra) {

	return {
		name: 'App',
		template: template,
		router: router,
		data: {
			meta: common.meta,
			common: common.body,
			specific: specific.body,
			global: Object.assign({}, extra, {
				isEditable: false,
				isClient: false,
				isWaiting: true,
				navigation: false,
				webconfig: webconfig,
				me: {},
				sessionID: ''
			}),
			options: {
				dirty: false,
				global: true,
				isLoaded: false
			}
		}
	};
};