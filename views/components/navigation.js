/* jshint node: true */
module.exports = function (template) {
	return {
		name: "navigation",
		props: ['common', 'global', 'meta'],
		template: template,
		methods: {
			checkRoles: function (link) {
				var self = this,
					output = false;

				if (link.roles) {
					link.roles.forEach(function (role) {
						if (self.global.me.role === role) {
							output = true;
						}
					});
				} else {
					output = true;
				}
				return output;
			}
		},
		data: function () {
			return {};
		}
	};
};