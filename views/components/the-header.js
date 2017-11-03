/* jshint node: true */
module.exports = function (template) {
	return {
		name: "TheHeader",
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
		methods: {
			toggleMenu: function () {
				this.global.navigation = !this.global.navigation;
			}
		},
		template: template
	};
};