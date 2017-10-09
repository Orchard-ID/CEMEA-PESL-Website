/* jshint node: true */
module.exports = function (template) {
	return {
		name: "cmpt-footer",
		props: ['common', 'global', 'specific'],
		template: template,
		data: function () {
			return {};
		}
	};
};