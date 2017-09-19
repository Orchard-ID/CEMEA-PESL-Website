/* jshint node: true */
module.exports = function (template) {
	return {
		name: "navigation",
		props: ['common', 'global', 'meta'],
		template: template,
		methods: {
			checkRoles: function (link) {
				var vm = this,
					output = false;

				if (link.roles) {
					link.roles.forEach(function (role) {
						if (vm.global.me.role === role) {
							output = true;
						}
					});
				} else {
					output = true;
				}
				return output;
			},
			toggleMenu: function () {
				this.global.navigation = !this.global.navigation;
			}
		},
		data: function () {
			return {};
		}
	};
};