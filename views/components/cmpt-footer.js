/* jshint node: true */
module.exports = function (template) {
	return {
		name: "cmpt-footer",
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
		}
	};
};