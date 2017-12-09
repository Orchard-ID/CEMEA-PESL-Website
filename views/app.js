/* jshint node: true */
module.exports = function (template, router, mixin, webconfig, common, specific, extra) {
	return {
		router: router,
		name: 'App',
		mixins: (mixin) ? [mixin] : undefined,
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
		},
		template: template
	};
};