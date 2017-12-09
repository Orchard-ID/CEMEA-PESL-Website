/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (template) {
	return {
		name: 'TheNavigation',
		props: {
			common: {
				type: Object,
				required: true
			},
			global: {
				type: Object,
				required: true
			},
			checkRoles: {
				type: Function,
				required: true
			}
		},
		computed: {
			authorizedLinks: function () {
				var vm = this;
				return this.common.navigation.privates.links.filter(function (link) {
					return link.status === 'auth' && vm.checkRoles(link, vm.global.me.role);
				});
			},
			unauthenticatedLinks: function () {
				return this.common.navigation.privates.links.filter(function (link) {
					return link.status !== 'auth';
				});
			}
		},
		methods: {
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
		},
		template: template
	};
};