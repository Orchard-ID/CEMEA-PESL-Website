/* jshint node: true */

function getGoogleDrive(NA, query, variation, mainCallback) {
	var fs = NA.modules.fs,
		googleAuthLibrary = NA.modules.googleAuthLibrary,
		googleApis = NA.modules.googleApis,
		readline = NA.modules.readline,
		SCOPES = ['https://www.googleapis.com/auth/drive'],
		TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/',
		TOKEN_PATH = TOKEN_DIR + 'drive-nodejs.json';

	function storeToken(token) {
		try {
			fs.mkdirSync(TOKEN_DIR);
		} catch (err) {
			if (err.code !== 'EEXIST') {
				throw err;
			}
		}
		fs.writeFile(TOKEN_PATH, JSON.stringify(token));

		console.log('Token stored to ' + TOKEN_PATH);
	}

	function getNewToken(oauth2Client, callback) {
		var authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		});

		console.log('Authorize this app by visiting this url: ', authUrl);

		var rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		rl.question('Enter the code from that page here: ', function (code) {
			rl.close();
			oauth2Client.getToken(code, function(err, token) {
				if (err) {
					console.log('Error while trying to retrieve access token', err);
					return;
				}
				oauth2Client.credentials = token;
				storeToken(token);
				callback(oauth2Client);
			});
		});
	}

	function authorize(credentials, callback) {
		var clientSecret = credentials.web.client_secret,
			clientId = credentials.web.client_id,
			redirectUrl = credentials.web.redirect_uris[0],
			auth = new googleAuthLibrary(),
			oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

		fs.readFile(TOKEN_PATH, function(err, token) {
			if (err) {
				getNewToken(oauth2Client, callback);
			} else {
				oauth2Client.credentials = JSON.parse(token);
				callback(oauth2Client);
			}
		});
	}

	function listFiles(auth) {
		var service = googleApis.drive('v2'),
			search = "",
			codes = {
				'approach': '0Bx898FhOCnEmbzZNTWJpcTFtdzQ',
				'coordinator': '0Bx898FhOCnEmdVNZUHZ2ZnN0Z1U',
				'partner': '0Bx898FhOCnEmOTVobWVnUFl0MjA',
			}/*,
			fileMetadata = {
				'name' : 'Invoices',
				'mimeType' : 'application/vnd.google-apps.folder'
			}*/;

			/* service.files.insert({
				auth: auth,
				resource: fileMetadata,
				fields: 'id'
			}, function(err, directory) {
				if (err) {
					console.log(err);
				} else {
					console.log('Folder Id: ', directory.id);
					var fileMetadata = {
							'title': 'photo.jpg',
							parents: [{ id: directory.id }]
						},
						media = {
							mimeType: 'image/jpeg',
							body: fs.createReadStream('photo.jpg')
						};

					service.files.insert({
						auth: auth,
						resource: fileMetadata,
						media: media,
						fields: 'id'
					}, function(err, file) {
						if (err) {
							// Handle error
							console.log(err);
						} else {
							console.log('File Id: ', file.id);*/

						if (query) {
							search = "fullText contains '" + query + "' and ";
						}

						service.files.list({
							auth: auth,
							maxResults: 100,
							q: search + "'" + codes[variation] + "' in parents"
						}, function(err, response) {
							if (err) {
								console.log('The API returned an error: ' + err);
								mainCallback(results);
							}

							var files = response.items,
								results = [],
								file;

							for (var i = 0; i < files.length; i++) {
								file = files[i];
								results.push({
									"title": "<a href='" + file.exportLinks['application/pdf'] + "' download><img src='" +  file.iconLink + "' width='16' height='16'>" + file.title + "</a>",
									"image": "<img src='" +  file.thumbnailLink + "'>"
								});
							}

							mainCallback(results);
						});/*
					}
				});
			}
		});*/
	}

	fs.readFile('google-drive.json', function processClientSecrets(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}

		authorize(JSON.parse(content), listFiles);
	});
}

exports.changeVariations = function (next, locals) {
	var NA = this;

	getGoogleDrive(NA, "", locals.routeKey.split('_')[0], function (results) {
		locals.specific.body.search.results = results;
		next();
	});
};

exports.setSockets = function () {
	var NA = this,
		io = NA.io;

	io.on('connection', function (socket) {
		/*var session = socket.request.session,
			sessionID = socket.request.sessionID;*/

		socket.on('google-drive--search-query', function (query, variation) {
			getGoogleDrive(NA, query, variation, function (results) {
				socket.emit('google-drive--search-query', results);
			});
		});
	});
};