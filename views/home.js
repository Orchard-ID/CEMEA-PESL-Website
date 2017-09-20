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
				specific: specific.body,
				slider: 0
			};
		},
		methods: {
			goToSlide: function (slide) {
				this.slider = slide;
			},
			goToPreviousSlide: function (slide) {
				this.slider = (this.slider > 1) ? this.slider - 1 : this.common.partner.partners.length - 1;
			},
			goToNextSlide: function (slide) {
				this.slider = (this.slider < this.common.partner.partners.length - 1) ? this.slider + 1 : 0;
			}
		}
	};
};