/* jshint node: true */
module.exports = function (template, specific, mixin, options) {
	return {
		name: 'PageProjects',
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
			goToPreviousSlide: function () {
				this.slider = (this.slider > 0) ? this.slider - 1 : this.specific.overview.overviews.length - 1;
			},
			goToNextSlide: function () {
				this.slider = (this.slider < this.specific.overview.overviews.length - 1) ? this.slider + 1 : 0;
			}
		},
		template: template
	};
};