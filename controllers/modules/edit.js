/* jshint node: true */
exports.setSockets = function () {
	var NA = this,
		io = NA.io,
		Edit = NA.models.Edit;

	io.on('connection', function (socket) {
		var session = socket.request.session;

		socket.on('edit--save', function (file, body, meta) {
			if (session.user && session.user.publics.role === 'admin') {
				Edit.save.call(NA, file, body, meta, function () {
					socket.emit('edit--save');
					socket.broadcast.emit('edit--save', file, body, meta);
				});
			}
		});
	});
};