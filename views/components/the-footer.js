/* jshint node: true */
module.exports = function (template) {
	return {
		name: "TheFooter",
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