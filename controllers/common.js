/* jshint node: true, esversion: 6 */
function setVueComponents(NA) {
	var path = NA.modules.path,
		Vue = NA.modules.Vue,
		fs = NA.modules.fs,
		components = NA.webconfig._components,
		keys = Object.keys(components);

	keys.filter(function (name) {
		return !components[name].clientOnly;
	}).forEach(function (name) {
		var pathfile = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, components[name].model);

		if (!NA.webconfig.cache) {
			delete require.cache[pathfile];
		}

		Vue.component(name, require(pathfile)(
			fs.readFileSync(path.join(NA.serverPath, NA.webconfig.viewsRelativePath, components[name].view), 'utf-8')
		));
	});
}

function openFile(NA, sourceFile, callback) {
	var fs = NA.modules.fs,
		uglifyEs = NA.modules.uglifyEs;

	if (/\.(js|htm|json)?$/g.test(sourceFile)) {
		fs.readFile(sourceFile, 'utf-8', function (err, result) {
			if (/\.js?$/g.test(sourceFile)) {
				callback(null, uglifyEs.minify(result).code);
			} else {
				callback(null, result);
			}
		});
	} else {
		callback(null, sourceFile);
	}
}

function createBundleClient(NA, callback) {
	var async = NA.modules.async,
		path = NA.modules.path,
		components = {
			"routes": path.join(NA.serverPath, "routes.json"),
			"appView": path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "app.htm"),
			"appModel": path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "app.js"),
			"appModule": path.join(NA.serverPath, NA.webconfig.assetsRelativePath, "javascripts/app.js"),
			"names": [],
			"views": [],
			"models": [],
			"modules": []
		},
		keys = Object.keys(NA.webconfig._components);

	keys.forEach(function (name) {
		components.names.push(name);
		components.views.push(path.join(NA.serverPath, NA.webconfig.viewsRelativePath, NA.webconfig._components[name].view));
		components.models.push(path.join(NA.serverPath, NA.webconfig.viewsRelativePath, NA.webconfig._components[name].model));
		if (NA.webconfig._components[name].module) {
			components.modules.push(path.join(NA.serverPath, NA.webconfig.assetsRelativePath, NA.webconfig._components[name].module));
		} else {
			components.modules.push("");
		}
	});

	async.parallel([
		function(callback) {
			openFile(NA, components.routes, function (error, result) {
				components.routes = result;
				callback(null);
			});
		},
		function(callback) {
			openFile(NA, components.appView, function (error, result) {
				components.appView = result;
				callback(null);
			});
		},
		function(callback) {
			openFile(NA, components.appModel, function (error, result) {
				components.appModel = result;
				callback(null);
			});
		},
		function(callback) {
			openFile(NA, components.appModule, function (error, result) {
				components.appModule = result;
				callback(null);
			});
		},
		function(callback) {
			async.map(components.views, function (sourceFile, callback) {
				openFile(NA, sourceFile, function (error, result) {
					callback(null, result);
				});
			}, function (error, results) {
				components.views = results;
				callback(null);
			});
		},
		function(callback) {
			async.map(components.models, function (sourceFile, callback) {
				openFile(NA, sourceFile, function (error, result) {
					callback(null, result);
				});
			}, function (error, results) {
				components.models = results;
				callback(null);
			});
		},
		function(callback) {
			async.map(components.modules, function (sourceFile, callback) {
				openFile(NA, sourceFile, function (error, result) {
					callback(null, result);
				});
			}, function (error, results) {
				components.modules = results;
				callback(null);
			});
		}
	], function () {
		callback("(function () { return " + JSON.stringify(components) + " })()");
	});
}

exports.setModules = function () {
	var NA = this,
		join = NA.modules.path.join;

	NA.webconfig._smtp = (NA.webconfig._smtp) ? require(join(NA.serverPath, NA.webconfig._data, NA.webconfig._smtp)) : undefined;
	NA.webconfig._components = require(join(NA.serverPath, NA.webconfig._components));

	NA.modules.Vue = require("vue");
	NA.modules.VueRouter = require("vue-router");
	NA.modules.VueServerRenderer = require("vue-server-renderer");

	NA.modules.nodemailer = require("nodemailer");
	NA.modules.RedisStore = require('connect-redis');
	NA.modules.readline = require('readline');
	NA.modules.googleApis = require('googleapis');
	NA.modules.googleAuthLibrary = require('google-auth-library');

	NA.modules.helper = require("./modules/helper.js")(NA);
	NA.modules.edit = require("./modules/edit.js");

	NA.models = {};
	NA.models.User = require("../models/connectors/user.js");
	NA.models.Edit = require("../models/connectors/edit.js");

	NA.modules.Vue.use(NA.modules.VueRouter);
};

exports.setSessions = function (next) {
	var NA = this,
		session = NA.modules.session,
		RedisStore = NA.modules.RedisStore(session);

	NA.sessionStore = new RedisStore();

	next();
};

exports.setRoutes = function (next) {
	var NA = this,
		express = NA.express,
		output;

	if (NA.webconfig.cache) {
		setVueComponents(NA);
		createBundleClient(NA, function (result) {
			output = result;
		});
	}

	express.get('/javascripts/bundle.' + NA.webconfig.version + '.js', function (request, response) {
		if (!NA.webconfig.cache) {
			createBundleClient(NA, function (result) {
				output = result;
				response.writeHead(200, { "Content-Type": "application/javascript", "Charset": "utf-8" });
				response.end(output);
			});
		} else {
			response.writeHead(200, {
				"Content-Type": "application/javascript",
				"Charset": "utf-8",
				"Cache-Control": "public, max-age=2592000",
				"Last-Modified": (new Date()).toString()
			 });
			response.end(output);
		}
	});

	next();
};

exports.setSockets = function () {
	var NA = this,
		io = NA.io,
		edit = NA.modules.edit;

	io.on('connection', function (socket) {
		var session = socket.request.session,
			sessionID = socket.request.sessionID;

		socket.on('app--init', function () {
			var user = (session.user) ? session.user.publics : {};
				socket.emit('app--init', sessionID, user);
		});
	});

	edit.setSockets.call(NA);
};

exports.changeDom = function (next, locals, request, response) {
	var NA = this,

		Vue = NA.modules.Vue,
		VueRouter = NA.modules.VueRouter,
		VueServerRenderer = NA.modules.VueServerRenderer,

		fs = NA.modules.fs,
		join = NA.modules.path.join,

		renderer = VueServerRenderer.createRenderer({
			template: locals.dom
		}),

		path = join(NA.serverPath, NA.webconfig.viewsRelativePath),
		specific = locals.specific,

		view = join(path, locals.routeParameters.view + ".htm"),
		model = join(path, locals.routeParameters.view + ".js"),
		appModel = join(path, "app.js"),
		appView = join(path, "app.htm");

	if (!NA.webconfig.cache) {
		delete require.cache[model];

		setVueComponents(NA);
	}

	fs.readFile(view, "utf-8",  function (error, template) {
		var component = Vue.component(locals.routeKey.split('_')[0], require(model)(specific, template)),
			currentRoute = {
				path: locals.routeParameters.url,
				component: component,
				props: ['common', 'global']
			};

		fs.readFile(appView, "utf-8", function (error, template) {
			var router = new VueRouter({
					routes: [currentRoute]
				}),
				extra = locals.global || {},
				common = locals.common,
				specific = locals.specific,
				webconfig = {
					routes: NA.webconfig.routes,
					languageCode: NA.webconfig.languageCode
				},

				stream = renderer.renderToStream(new Vue(require(appModel)(common, specific, template, router, webconfig, extra)), locals);

			router.push(locals.routeParameters.url);

			stream.on('data', function (chunk) {
				response.write(chunk);
			});

			stream.on('end', function () {
				response.end();
			});
		});
	});
};