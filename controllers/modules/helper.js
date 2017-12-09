/* jshint node: true */
module.exports = {
	checkRoles: function (roleList, currentRole) {
		var output = false;

		if (roleList.roles) {
			roleList.roles.forEach(function (role) {
				if (currentRole === role) {
					output = true;
				}
			});
		} else {
			output = true;
		}

		return output;
	}
};