/* jshint node: true */
var browserSync = require("browser-sync");
global.NA = new require("node-atlas")();

global.NA.started(function(){
	var clientConnected = false;

	browserSync.emitter.on('client:connected', function() {
		if(clientConnected) {
			return
		}
		clientConnected = true;
		setTimeout(function () {
			browserSync.reload();
		}, 500);
	});

	browserSync.init(null, {
		proxy: "http://localhost:7772",
		files: [
			"assets/javascripts/*",
			"assets/javascripts/**/*",
			"assets/media/*",
			"assets/media/**/*",
			"assets/stylesheets/common.css",
			"variations/*.json",
			"variations/**/*.json",
			"views/*",
			"views/**/*"
		],
		port: 57772,
		open: false,
		ws: true
	});

	browserSync.watch(
		['assets/stylesheets/*.styl', 'assets/stylesheets/**/*.styl']
	).on('change', function(){
		global.NA.modules.http.get(global.NA.webconfig.urlRoot + "/stylesheets/common.css");
	});
}).start();