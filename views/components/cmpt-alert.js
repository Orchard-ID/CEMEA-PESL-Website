/* jshint node: true, esversion: 6 */
module.exports = function (template) {

	return {
		name: "cmpt-alert",
		template: template,
		props: {
			current: {
				type: Object,
				required: true
			},
			displayed: {
				type: Boolean,
				required: true
			}
		},
		methods: {
			close: function () {
				this.$emit('close');
			}
		}
	};
};