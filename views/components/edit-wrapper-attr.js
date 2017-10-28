/* jshint node: true, esversion: 6 */
module.exports = function (template) {
	return {
		name: 'EditWrapperAttr',
		template: template,
		props: {
			global: {
				type: Object,
				required: true
			}
		}
	};
};