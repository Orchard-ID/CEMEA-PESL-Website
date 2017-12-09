/* jshint node: true */
module.exports = function (request, response, next) {
	var NA = this,
		helper = NA.modules.helper;

	if (!request.session.user) {
		return response.redirect(NA.webconfig.urlRoot + NA.webconfig.urlRelativeSubPath + '/espace-membres/');
	} else {
		if (!helper.checkRoles({ roles: ['admin', 'double', response.locals.routeKey.split('_')[0]] }, request.session.user.publics.role)) {
			return response.redirect(NA.webconfig.urlRoot + NA.webconfig.urlRelativeSubPath + '/espace-membres/');
		}
	}

	next();
};