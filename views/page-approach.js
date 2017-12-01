/* jshint node: true */
/* global NA, Vue */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'PageApproach',
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
		data: function () {
			return {
				options: options,
				meta: specific.meta,
				specific: specific.body,
				searchQuery: ""
			};
		},
		beforeMount: function () {
			var data = document.getElementsByClassName('page-approach--search-result')[0];
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
		methods: {
			searchResult: function (query) {
				var vm = this;
				NA.socket.emit('page-google-drive--search-query', query, 'approach');
				NA.socket.once('page-google-drive--search-query', function (data) {
					vm.global.search.results = data;
				});
			},
			getSearchResult: function () {
				this.searchResult(this.searchQuery);
			}
		},
		template: template
	};
};