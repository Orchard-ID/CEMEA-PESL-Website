/* jshint node: true */
/* global Parallax */
module.exports = function (template) {
	return {
		name: 'TheParallax',
		props: {
			common: {
				type: Object,
				required: true
			},
			global: {
				type: Object,
				required: true
			},
			meta: {
				type: Object,
				required: true
			}
		},
		data: function () {
			return {
				parallax: this.meta.parallax
			};
		},
		mounted: function () {
			var scene = document.getElementsByClassName('the-parallax--scene')[0];
			new Parallax(scene);
		},
		methods: {
			getRandomParallaxImage: function () {
				return this.parallax.images[Math.floor(Math.random() * this.parallax.images.length)];
			},
			getParallaxDepth: function (index) {
				if (index <= 3) {
					return '1';
				} else if (index >= 4 && index <= 6) {
					return '.75';
				} else if (index >= 7 && index <= 9) {
					return '.5';
				} else {
					return '.25';
				}
			}
		},
		template: template
	};
};