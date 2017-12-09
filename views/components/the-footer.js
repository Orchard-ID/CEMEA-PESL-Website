/* jshint node: true */
module.exports = function (template) {
	return {
		name: 'TheFooter',
		props: {
			common: {
				type: Object,
				required: true
			},
			global: {
				type: Object,
				required: true
			}
		},
		template: template
	};
};