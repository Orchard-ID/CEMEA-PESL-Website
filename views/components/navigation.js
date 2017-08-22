/* jshint node: true */
module.exports = function (template) {
	return {
		name: "navigation",
		props: ['common', 'global', 'meta'],
		template: template,
		data: function () {
			return {};
		}
	};
};