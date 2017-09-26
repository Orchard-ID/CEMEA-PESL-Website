/* jshint node: true */
/* global NA */
module.exports = function (common, specific, template, router, webconfig, extra) {

	return {
		name: 'app',
		template: template,
		router: router,
		data: {
			meta: common.meta,
			common: common.body,
			specific: specific.body,
			parallax: common.body.parallax,
			global: Object.assign({}, extra, {
				isEditable: false,
				isClient: false,
				isWaiting: true,
				navigation: false,
				webconfig: webconfig,
				me: {},
				sessionID: ""
			}),
			options: {
				dirty: false,
				global: true,
				isLoaded: false
			}
		},
		mounted: function(){
			console.log(this.parallax);

			var scene = document.getElementById('parallax-scene');
			var parallaxInstance = new Parallax(scene);
		},
		methods: {
			getRandomParallaxImage: function(){
				return this.parallax.images[Math.floor(Math.random() * this.parallax.images.length)];
			},
			getParallaxDepth: function(index){
				if (index <= 3) {
					console.log('lower than 3');
					return "1";
				} else if (index >= 4 && index <= 6) {
					return ".75";
				} else if (index >= 7 && index <= 9) {
					return ".5";
				} else {
					return ".25";
				}
			}
		}
	};
};