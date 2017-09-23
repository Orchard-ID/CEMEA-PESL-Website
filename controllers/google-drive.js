/* jshint node: true */

function getGoogleDrive(NA, query, variation, mainCallback) {
	var fs = NA.modules.fs,
		path = NA.modules.path,
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
			//redirect_uri: NA.webconfig.urlRoot,
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
				console.log(token);
				if (err) {
					console.log('Error while trying to retrieve access token', code, err);
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
				oauth2Client.setCredentials(oauth2Client.credentials);
				callback(oauth2Client);
			}
		});
	}

	function listFiles(auth) {
		var service = googleApis.drive('v2'),
			search = "",
			codes = {
				'approach': '0By4_w_w1iJBoYVBtd0t4REJJdGs',
				'coordinator': '0By4_w_w1iJBoY0VuTHVEOEIzbEk',
				'partner': '0By4_w_w1iJBoRFJTdjJrNGN1YTQ',
			},
			dateLine = function (date) {
				var join = NA.modules.path.join,
					path = join(NA.serverPath, NA.webconfig.variationsRelativePath, NA.webconfig.languageCode, NA.webconfig.variation),
					common,
					now = new Date(date),
					padLeft = function (pad, str) {
						str = "" + str;
						return pad.substring(0, pad.length - str.length) + str;
					};

				delete require.cache[path];
				common = require(path);

				return common.body.dates.smallDay[now.getDay()] + ' ' +
					now.getDate() + ' ' +
					common.body.dates.smallMonth[now.getMonth()] + now.getFullYear() + ' à ' +
					now.getHours() + ':' +
					padLeft("00", now.getMinutes());
			};

		if (query) {
			search = "fullText contains '" + query + "' and ";
		}

		service.files.list({
			auth: auth,
			maxResults: 100,
			q: search + "'" + codes[variation] + "' in parents"
		}, function(err, response) {
			var files,
				results = [],
				file;

			if (err) {
				console.log(err);
				console.log('The API returned an error: ' + err);
				mainCallback(results);
				return;
			}

			files = response.items;

			for (var i = 0; i < files.length; i++) {
				file = files[i];
				results.push({
					"title": "<a href='" + file.embedLink + "' target='_blank'><img src='" +  file.iconLink + "' width='16' height='16' style='margin-bottom: -2px'> " + file.title + "</a>",
					"image": (!file.exportLinks) ? "<img src='" +  file.thumbnailLink + "'>" : '',
					"detail": ((file.exportLinks) ? "<a href='" + file.exportLinks['application/pdf'] + "' download><strong>Format PDF</strong></a> · " : '') + dateLine(file.modifiedDate)
				});
			}

			mainCallback(results);
		});
	}

	fs.readFile(path.join(NA.serverPath, NA.webconfig._data, NA.webconfig._googledrive), function (err, content) {
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
		locals.global = {};
		locals.global.search = {};
		locals.global.search.results = results;
		next();
	});
};

exports.setSockets = function () {
	var NA = this,
		io = NA.io;

	io.on('connection', function (socket) {
		socket.on('google-drive--search-query', function (query, variation) {
			getGoogleDrive(NA, query, variation, function (results) {
				socket.emit('google-drive--search-query', results);
			});
		});
	});
};