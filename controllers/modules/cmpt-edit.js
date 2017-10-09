/* jshint node: true */
exports.setSockets = function () {
	var NA = this,
		io = NA.io,
		Edit = NA.models.Edit;

	io.on('connection', function (socket) {
		var session = socket.request.session;

		socket.on('cmpt-edit--save', function (file, body, meta) {
			if (session.user && session.user.publics.role === 'admin') {
				Edit.save.call(NA, file, body, meta, function () {
					socket.emit('cmpt-edit--save');
					socket.broadcast.emit('cmpt-edit--save', file, body, meta);
				});
			}
		});
	});
};