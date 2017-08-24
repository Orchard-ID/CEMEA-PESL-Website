/* jshint node: true */
/* global NA */
module.exports = function (specific, template, mixin, options) {
	return {
		name: 'google-drive',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: ['common', 'global'],
		beforeMount: function () {
			var data = document.getElementsByClassName('google-drive')[0];
			if (data) {
				this.specific.search.results = JSON.parse(data.getAttribute('data-search'));
			} else {
				var self = this;
				NA.socket.emit('google-drive--search-query', "");
				NA.socket.once('google-drive--search-query', function (data) {
					self.specific.search.results = data;
				});
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
			getSearchResult: function () {
				var self = this;
				NA.socket.emit('google-drive--search-query', self.searchQuery);
				NA.socket.once('google-drive--search-query', function (data) {
					self.specific.search.results = data;
				});
			}
		}
	};
};