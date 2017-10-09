/* jshint node: true, esversion: 6 */
/* global Vue */
module.exports = function (template) {
	return {
		name: 'cmpt-inline',
		template: template,
		props: ['value', 'global', 'config', 'empty'],
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