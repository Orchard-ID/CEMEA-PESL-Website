/* jshint browser: true, esversion: 6, evil: true */
/* global Vue, VueRouter, location */
var version = document.getElementsByTagName("html")[0].getAttribute('data-version');

window.module = {};

if (window.location.pathname.slice(-1) !== '/') {
	window.location = window.location.pathname + '/';
}

CKEDITOR.stylesSet.add('website', [
	{ name: 'Titre 3 Centré', element: 'h3', attributes: { 'class': 'text-center' } },
	{ name: 'Contenu Justifié', element: 'p', attributes: { 'class': 'text-justify' } }
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

function scrollState () {
	var html = document.getElementsByTagName('html')[0]
	if (document.body.scrollTop || document.documentElement.scrollTop > 0) {
		html.classList.remove('is-on-top')
	}
}

window.addEventListener("scroll", function () {
	scrollState();
});

xhr('javascripts/bundle.' + version + '.js').then(function (results) {
	var files = eval(results),
		webconfig = {
			routes: JSON.parse(files[0]),
			languageCode: document.getElementsByTagName('html')[0].getAttribute('lang')
		},
		common = JSON.parse(files[1]),
		app = {
			model: eval(files[2]),
			template: files[3]
		},
		keys = Object.keys(webconfig.routes),
		routes = [],
		mixin,
		router,
		vm,
		global = eval(files[4])(),
		edit = eval(files[5])(),
		navigation = eval(files[6])(),
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

	Vue.component('ckeditor', eval(files[7])(files[8]));
	Vue.component('attr', eval(files[9])(files[10]));
	Vue.component('attrs', eval(files[11])(files[12]));
	Vue.component('inline', eval(files[13])(files[14]));
	Vue.component('block', eval(files[15])(files[16]));
	Vue.component('edit', eval(files[17])(files[18]));
	Vue.component('alert-message', eval(files[19])(files[20]));
	Vue.component('confirm-message', eval(files[21])(files[22]));
	Vue.component('navigation', eval(files[23])(files[24]));
	Vue.component('main-header', eval(files[25])(files[26]));
	Vue.component('main-footer', eval(files[27])(files[28]));
	Vue.component('height-transition', eval(files[29])(files[30]));

	mixin = function (unactive) {
		return {
			beforeRouteLeave: function (to, from, next) {
				vm.global.isWaiting = true;
				next();
			},
			beforeRouteEnter: function (to, from, next) {
				next(function (vmComponent) {
					global.setHistoryLink(historyRouterLink);

					if (unactive) {
						global.setBeforeRouterEnter(vmComponent, to);
						edit.setBeforeRouterEnter(vmComponent);
						navigation.setBeforeRouterEnter(vm);
					}

					vm.global.isWaiting = false;
				});
			},
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
			mounted: function () {
				this.$emit('specific', this.specific);
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
	}).forEach(function (key, i) {

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
		//route.pathToRegexpOptions = { strict: true };
		route.meta = { first: (function (i) {
			return i;
		})(i) };

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

				resolve(eval(model)(specific, template, mixin(!webconfig.routes[key]._children), options));
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
				}
			}

			if (savedPosition) {
				return savedPosition
			} else {
				return { x: 0, y: 0 }
			}
		}
	});


	vm = new Vue(app.model(common, { body: {} }, app.template, router, webconfig, {}));

	router.onReady(function () {
		vm.$mount('.layout');
		vm.global.isClient = true;

		router.beforeEach(function (to, from, next) {
			if (vm.global.webconfig.routes[to.name + '_' + vm.global.webconfig.languageCode].middlewares && !window.checkRoles({ roles: ['admin', 'double', to.name] })) {
				console.log("Redirection !");
				vm.$router.replace({ path: '/' });
				vm.$router.replace({ path: '/espace-membres/' });
			}

			next();
		});

		global.setTracking();
		global.setSockets(vm);
		global.editMode(vm);
		edit.setSockets(vm);
	});
});
