/* jshint node: true, esversion: 6 */
module.exports = function (template) {

	return {
		name: "confirm-message",
		props: ['current', 'displayed'],
		template: template,
		data: function () {
			return {
				callback: undefined
			};
		},
		methods: {
			update: function () {
				this.callback();
				this.callback = undefined;
				this.$emit('close');
			},
			close: function () {
				this.$emit('close');
			}
		}
	};
};