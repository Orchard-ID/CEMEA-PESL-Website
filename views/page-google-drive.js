/* jshint node: true */
/* global NA, Vue */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'PageGoogleDrive',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: {
			common: {
				type: Object,
				required: true
			},
			global: {
				type: Object,
				required: true
			}
		},
		beforeMount: function () {
			var data = document.getElementsByClassName('page-google-drive')[0];
			Vue.set(this.global, 'search', {});
			Vue.set(this.global.search, 'results', {});
			if (data) {
				this.global.search.results = JSON.parse(data.getAttribute('data-search'));
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				if (from.name) {
					vm.searchResult(vm.searchQuery);
				}
			});
		},
		data: function () {
			return {
				options: options,
				meta: specific.meta,
				specific: specific.body,
				searchQuery: ""
			};
		},
		methods: {
			searchResult: function (query) {
				var vm = this;
				NA.socket.emit('page-google-drive--search-query', query, vm.$route.name);
				NA.socket.once('page-google-drive--search-query', function (data) {
					vm.global.search.results = data;
				});
			},
			getSearchResult: function () {
				this.searchResult(this.searchQuery);
			}
		}
	};
};