module.exports = function (request, response, next) {
	var NA = this;

	function checkRoles(link) {
		var output = false;

		if (link.roles) {
			link.roles.forEach(function (role) {
				if (request.session.user.publics.role === role) {
					output = true;
				}
			});
		} else {
			output = true;
		}

		return output;
	}

	if (!request.session.user) {
		return response.redirect(NA.webconfig.urlRoot + NA.webconfig.urlRelativeSubPath + "/espace-membres/");
	} else {
		if (!checkRoles({ roles: ['admin', 'double', response.locals.routeKey.split('_')[0]] })) {
			return response.redirect(NA.webconfig.urlRoot + NA.webconfig.urlRelativeSubPath + "/espace-membres/");
		}
	}

	next();
};