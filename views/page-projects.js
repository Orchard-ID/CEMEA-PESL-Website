/* jshint node: true */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'page-projects',
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
				specific: specific.body,
				slider: 0
			};
		},
		methods: {
			goToSlide: function (slide) {
				this.slider = slide;
			},
			goToPreviousSlide: function (slide) {
				this.slider = (this.slider > 0) ? this.slider - 1 : this.specific.overview.overviews.length - 1;
			},
			goToNextSlide: function (slide) {
				this.slider = (this.slider < this.specific.overview.overviews.length - 1) ? this.slider + 1 : 0;
			}
		}
	};
};