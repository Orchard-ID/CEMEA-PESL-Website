/* jshint node: true */
module.exports = function (template) {
	return {
		name: "cmpt-header",
		props: ['common', 'global', 'specific'],
		template: template,
		data: function () {
			return {};
		},
		methods: {
			toggleMenu: function () {
				this.global.navigation = !this.global.navigation;
			}
		}
	};
};