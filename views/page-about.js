/* jshint node: true */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'page-about',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: ['common', 'global'],
		data: function () {
			return {
				options: options,
				meta: specific.meta,
				specific: specific.body
			};
		}
	};
};