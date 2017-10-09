/* jshint node: true, esversion: 6 */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'page-home',
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
		mounted: function () {
			document.getElementsByClassName('next')[0].addEventListener('click', function () {
				var height = parseInt(window.getComputedStyle(document.getElementsByClassName('page-home--about--main')[0]).height, 10) +
						parseInt(window.getComputedStyle(document.getElementsByClassName('page-home--about')[0]).paddingTop, 10) * 2 +
						parseInt(window.getComputedStyle(document.getElementsByClassName('page-home--about')[0]).marginBottom, 10) +
						parseInt(window.getComputedStyle(document.getElementsByClassName('upper-content--inner')[0]).height, 10);
				window.scrollTo(0, height);
			});
		},
		methods: {
			goToSlide: function (slide) {
				this.slider = slide;
			},
			goToPreviousSlide: function (slide) {
				this.slider = (this.slider > 0) ? this.slider - 1 : this.common.partner.partners.length - 1;
			},
			goToNextSlide: function (slide) {
				this.slider = (this.slider < this.common.partner.partners.length - 1) ? this.slider + 1 : 0;
			}
		}
	};
};