/* jshint node: true, esversion: 6 */
module.exports = function (template) {

	return {
		name: "cmpt-alert",
		props: ['current', 'displayed'],
		template: template,
		methods: {
			close: function () {
				this.$emit('close');
			}
		}
	};
};