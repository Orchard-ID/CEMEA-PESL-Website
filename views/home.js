/* jshint node: true, esversion: 6 */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'home',
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