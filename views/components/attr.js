/* jshint node: true, esversion: 6 */
/* global Vue */
module.exports = function (template) {
	return {
		name: 'attr',
		template: template,
		props: ['value', 'global', 'label'],
		data: function () {
			return {
				output: undefined
			};
		},
		watch: {
			output: function () {
				Vue.nextTick(() => {
					this.$emit('input', this.output);
				});
			}
		}
	};
};