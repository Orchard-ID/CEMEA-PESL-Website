/* jshint node: true */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'PageAbout',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: {
			common: {
				type: Object,
				required: true
			},
			global: {
				type: Object,
				required: true
			}
		},
		data: function () {
			return {
				options: options,
				meta: specific.meta,
				specific: specific.body
			};
		}
	};
};