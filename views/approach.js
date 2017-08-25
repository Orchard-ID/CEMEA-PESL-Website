/* jshint node: true */
/* global NA */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'approach',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: ['common', 'global'],
		beforeMount: function () {
			var data = document.getElementsByClassName('approach')[0];
			if (data) {
				this.specific.search.results = JSON.parse(data.getAttribute('data-search'));
			} else {
				this.searchResult(this.searchQuery);
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
		methods: {
			searchResult: function (query) {
				var vm = this;
				NA.socket.emit('google-drive--search-query', query, 'approach');
				NA.socket.once('google-drive--search-query', function (data) {
					vm.specific.search.results = data;
				});
			},
			getSearchResult: function () {
				this.searchResult(this.searchQuery);
			}
		}
	};
};