/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (template) {
	return {
		name: "TheNavigation",
		template: template,
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
			},
			doUnauthentication: function () {
				NA.socket.emit('unauthentication');
				NA.socket.once('unauthentication', () => {
					this.global.me = {};
					if (this.global.webconfig.routes[this.$route.name + '_' + this.global.webconfig.languageCode].middlewares) {
						this.$router.replace({ path: '/' });
						this.$router.replace({ path: '/espace-membres/' });
					}
				});
			}
		}
	};
};