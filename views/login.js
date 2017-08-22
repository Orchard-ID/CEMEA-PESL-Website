/* jshint node: true, esversion: 6 */
/* global NA, Hashes */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'login',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: ['common', 'global'],
		data: function () {
			return {
				options: options,
				meta: specific.meta,
				specific: specific.body,
				email: undefined,
				password: undefined,
				error: undefined
			};
		},
		methods: {
			isEmail: function (email) {
				var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|digital|agency|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
				return regex.test(email);
			},
			isAuthenticable: function () {
				return this.isEmail && this.isEmail(this.email) && this.password;
			},
			doAuthentication: function () {
				if (this.isAuthenticable()) {
					NA.socket.emit('authentication', {
						email: this.email,
						password: new Hashes.SHA1().hex(this.password)
					});
					NA.socket.once('authentication', (data) => {
						if (data) {
							this.global.me = data;
						} else {
							this.error = true;
						}
					});
				}
			},
			doUnauthentication: function () {
				NA.socket.emit('unauthentication');
				NA.socket.once('unauthentication', () => {
					this.global.me = {};
				});
			}
		}
	};
};