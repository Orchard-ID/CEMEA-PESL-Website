/* jshint node: true, esversion: 6 */
function setVueComponents(NA) {
	var path = NA.modules.path,
		Vue = NA.modules.Vue,
		fs = NA.modules.fs,
		components = ['attrs', 'attr', 'inline', 'block', 'navigation', 'main-header', 'main-footer'],
		animations = ['height-transition'];

	components.forEach(function (name) {
		var pathfile = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, 'components/' + name + '.js');

		if (!NA.webconfig.cache) {
			delete require.cache[pathfile];
		}

		Vue.component(name, require(pathfile)(
			fs.readFileSync(path.join(NA.serverPath, NA.webconfig.viewsRelativePath, 'components/' + name + ".htm"), 'utf-8')
		));
	});

	animations.forEach(function (name) {
		Vue.component(name, { template: '<div><slot></slot></div>' });
	});
}

function createBundleClient(NA, callback) {
	var fs = NA.modules.fs,
		async = NA.modules.async,
		path = NA.modules.path,
		uglifyEs = NA.modules.uglifyEs,
		components = [
			path.join(NA.serverPath, "routes.json"),
			path.join(NA.serverPath, NA.webconfig.variationsRelativePath, NA.webconfig.languageCode, "common.json"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "app.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "app.htm"),
			path.join(NA.serverPath, NA.webconfig.assetsRelativePath, "javascripts/app.js"),
			path.join(NA.serverPath, NA.webconfig.assetsRelativePath, "javascripts/modules/edit.js"),
			path.join(NA.serverPath, NA.webconfig.assetsRelativePath, "javascripts/modules/navigation.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/ckeditor.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/ckeditor.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/attr.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/attr.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/attrs.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/attrs.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/inline.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/inline.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/block.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/block.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/edit.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/edit.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/alert-message.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/alert-message.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/confirm-message.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/confirm-message.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/navigation.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/navigation.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/main-header.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/main-header.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/main-footer.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/main-footer.htm"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "animations/height-transition.js"),
			path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "animations/height-transition.htm")
		];

	async.map(components, function (sourceFile, callback) {
		fs.readFile(sourceFile, 'utf-8', function (err, result) {
			if (/\.js?$/g.test(sourceFile)) {
				callback(null, uglifyEs.minify(result).code);
			} else {
				callback(null, result);
			}
		});
	}, function (error, results) {
		callback(JSON.stringify(results));
	});
}

exports.setModules = function () {
	var NA = this,
		join = NA.modules.path.join;

	NA.webconfig._smtp = (NA.webconfig._smtp) ? require(join(NA.serverPath, NA.webconfig._data, NA.webconfig._smtp)) : undefined;

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

	// We open the component view file.
	fs.readFile(view, "utf-8",  function (error, template) {
		var component = Vue.component(locals.routeKey.split('_')[0], require(model)(specific, template)),
			currentRoute = {
				path: locals.routeParameters.url,
				component: component,
				props: ['common', 'global']
			};

		// We open the main app view.
		fs.readFile(appView, "utf-8", function (error, template) {

			// We create router with current route and subroute and pass some config.
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

				// We create the render.
				stream = renderer.renderToStream(new Vue(require(appModel)(common, specific, template, router, webconfig, extra)), locals);

			// We set the current (only) route to allows content to be rendered.
			router.push(locals.routeParameters.url);

			// We send data as soon as possible.
			stream.on('data', function (chunk) {
				response.write(chunk);
			});

			// We inform client the response is ended.
			stream.on('end', function () {
				response.end();
			});
		});
	});
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