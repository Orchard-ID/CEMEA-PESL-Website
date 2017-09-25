/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'contact',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: ['common', 'global'],
		data: function () {
			return {
				options: options,
				meta: specific.meta,
				specific: specific.body,
				isSent: false,
				email: undefined,
				message: undefined,
				error: undefined,
				slider: 0
			};
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
			},
			isEmail: function (email) {
				var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|digital|agency|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
				return regex.test(email);
			},
			isSendable: function () {
				return this.isEmail && this.isEmail(this.email) && this.message;
			},
			sendMessage: function () {
				if (this.isSendable()) {
					NA.socket.emit('send', {
						email: this.email,
						message: this.message
					});
					NA.socket.once('send', (isSent) => {
						if (isSent) {
							this.isSent = true;
							this.error = false;
						} else {
							this.error = true;
						}
					});
				}
			},
			moreDetails: function () {
				alert('TO DO');
			},
			newMessage: function () {
				if (!this.global.isEditable) {
					this.isSent = false;
					this.error = false;
					this.message = undefined;
				}
			}
		}
	};
};