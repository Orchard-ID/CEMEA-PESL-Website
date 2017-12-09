/* jshint esversion: 6 */
/* global Vue, VueRouter, CKEDITOR */
var version = document.getElementsByTagName("html")[0].getAttribute('data-version'),
	popupCookieConsent;

if (window.location.pathname.slice(-1) !== '/') {
	window.location = window.location.pathname + '/';
}

window.cookieconsent.initialise({
	"content": {
		"message": "En poursuivant votre navigation vous consentez à l’utilisation de cookies pour des statistiques de visite.",
		"dismiss": "Compris",
		"link": "En savoir plus.",
		"href": document.getElementsByClassName('cookies')[0].getAttribute('href')
	}
}, function (popup) {
	popupCookieConsent = popup;
});

window.module = {};

CKEDITOR.stylesSet.add('website', [
	{ name: 'Contenu Centré', element: 'p', attributes: { 'class': 'text-center' } },
	{ name: 'Contenu Justifié', element: 'p', attributes: { 'class': 'text-justify' } },
	{ name: 'Titre 3 Centré', element: 'h3', attributes: { 'class': 'text-center' } }
]);
CKEDITOR.config.stylesSet = 'website';

function xhr(url) {
	return new Promise(function (resolve, reject) {
		var request = new XMLHttpRequest(),
			type = url.match(/\.(js(on)?|html?)$/g, '$0')[0];

		request.addEventListener("load", function () {
			if (request.status < 200 && request.status >= 400) {
				reject(new Error("We reached our target server, but it returned an error."));
			}

			if (type === '.js') {
				resolve(eval(request.responseText));
			} else if (type === '.json') {
				resolve(JSON.parse(request.responseText));
			} else {
				resolve(request.responseText);
			}

		});

		request.addEventListener("error", function () {
			reject(new Error("There was a connection error of some sort."));
		});

		request.open("GET", location.origin + '/' + url, true);
		request.send();
	});
}

Promise.all([
	xhr('variations/common.json'),
	xhr('javascripts/bundle.' + version + '.js')
]).then(function (results) {
	var common = results[0],
		files = eval(results[1]),
		webconfig = {
			routes: JSON.parse(files.routes),
			languageCode: document.getElementsByTagName('html')[0].getAttribute('lang')
		},
		app = {
			view: files.appView,
			model: eval(files.appModel),
			module: eval(files.appModule)()
		},
		modules = {},
		keys = Object.keys(webconfig.routes),
		routes = [],
		mixin,
		router,
		vm,
		historyRouterLink = function (e) {
			var url;

			if (e.target.href) {
				url = e.target.href.replace(location.origin, '');

				if (url[0] === '/') {
					e.preventDefault();
					if (!vm.global.isEditable) {
						router.push({ path: url });
					}
				}
			}
		};

	files.names.forEach(function (name, i) {
		Vue.component(name, eval(files.models[i])(files.views[i]));
		if (files.modules[i]) {
			modules[name] = eval(files.modules[i])();
		}
	});

	mixin = function (unactive) {
		return {
			watch: {
				common: {
					handler: function() {
						var active = document.activeElement.getAttribute('class');
						if (window.lockDirty) {
							window.lockDirty = false;
						} else {
							vm.options.dirty = true;
						}
						if (active && active.indexOf('cke') !== -1) {
							vm.$refs.edit.updateJSON(vm.meta, vm.common);
						}
					},
					deep: true
				},
				specific: {
					handler: function() {
						var active = document.activeElement.getAttribute('class');
						if (window.lockDirty) {
							window.lockDirty = false;
						} else {
							this.options.dirty = true;
						}
						if (active && active.indexOf('cke') !== -1) {
							vm.$refs.router.$refs.edit.updateJSON(vm.$refs.router.meta, vm.$refs.router.specific);
						}
						this.$emit('specific', this.specific);
					},
					deep: true
				}
			},
			beforeRouteEnter: function (to, from, next) {
				next(function (vmComponent) {
					app.module.setHistoryLink(historyRouterLink);

					if (unactive) {
						app.module.setBeforeRouterEnter(vmComponent, to);
						modules['edit-global'].setBeforeRouterEnter(vmComponent);
						modules['the-navigation'].setBeforeRouterEnter(vm);
					}

					vm.global.isWaiting = false;
				});
			},
			mounted: function () {
				this.$emit('specific', this.specific);
			},
			beforeRouteLeave: function (to, from, next) {
				vm.global.isWaiting = true;
				popupCookieConsent.setStatus(window.cookieconsent.status.allow);
				popupCookieConsent.close();
				next();
			}
		};
	};

	window.replaceData = function (source, replacement) {
		var parsed = parseHTML(source);

		function parseHTML(htmlString) {
			var body = document.implementation.createHTMLDocument().body;
			body.innerHTML = htmlString;
			return body.childNodes;
		}

		Array.prototype.forEach.call(parsed[0].querySelectorAll("[data-replace]"), function (item) {
			item.innerHTML = replacement[item.getAttribute('data-replace')];
		});

		return parsed[0].outerHTML;
	};

	window.checkRoles = function (link) {
		var output = false;

		if (link.roles) {
			link.roles.forEach(function (role) {
				if (vm.global.me.role === role) {
					output = true;
				}
			});
		} else {
			output = true;
		}
		return output;
	};

	// Create the app tree.
	keys.filter(function (key) {

		// Remove all child paths.
		return !webconfig.routes[key]._parent;
	}).forEach(function (key) {

		// Create all first level route...
		var route = {},
			name = key.split('_')[0],
			view = webconfig.routes[key].view,
			variation = webconfig.routes[key].variation,
			model,
			specific,
			template,
			options;

		// ...by adding a route
		route.name = name;
		route.path = webconfig.routes[key].url;

		// ...by precise a component
		route.component = function (resolve) {
			Promise.all([
				xhr('views-models/' + view + '.js'),
				xhr('variations/' + variation),
				xhr('views-models/' + view + '.htm')
			]).then(function (files) {
				model = files[0];
				specific = files[1];
				template = files[2];
				options = {
					dirty: false
				};

				resolve(eval(model)(template, specific, mixin(!webconfig.routes[key]._children), options));
			});
		};

		// ...and pass some props
		route.props = ['common', 'global'];

		routes.push(route);
	});

	router = new VueRouter({
		mode: 'history',
		fallback: false,
		base: '/',
		routes: routes,
		scrollBehavior (to, from, savedPosition) {
			if (to.hash) {
				return {
					selector: to.hash
				};
			}

			if (savedPosition) {
				return savedPosition;
			} else {
				return { x: 0, y: 0 };
			}
		}
	});

	document.getElementsByClassName('cc-link')[0].addEventListener('click', function (e) {
		e.preventDefault();
		router.push({ path: e.target.getAttribute('href') });
	});

	vm = new Vue(app.model(app.view, router, webconfig, common, { body: {} }, {}));

	router.onReady(function () {
		vm.$mount('.layout');
		vm.global.isClient = true;

		router.beforeEach(function (to, from, next) {
			if (vm.global.webconfig.routes[to.name + '_' + vm.global.webconfig.languageCode].middlewares && !window.checkRoles({ roles: ['admin', 'double', to.name] })) {
				vm.$router.replace({ path: '/' });
				vm.$router.replace({ path: '/espace-membres/' });
			}

			next();
		});

		app.module.setTracking();
		app.module.setSockets(vm);
		app.module.editMode(vm);
		modules['edit-global'].setSockets(vm);
	});
});
