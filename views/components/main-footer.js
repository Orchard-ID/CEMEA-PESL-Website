/* jshint node: true */
module.exports = function (template) {
	return {
		name: "main-footer",
		props: ['common', 'global', 'specific'],
		template: template,
		data: function () {
			return {};
		}
	};
};