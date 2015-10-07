angular.module('SuMaiTong')
.config(['$httpProvider', function ($httpProvider) {
	// $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	// $httpProvider.defaults.headers.post["Content-Type"] = "multipart/form-data";
	$httpProvider.interceptors.push(['$q', function($q) {
		return {
			'request': function(config) {
				if (!config.data) {
					config.data = {};
				}
				return config;
			},

			'response': function(response) {
				// same as above
				return response;
			}
		};
	}]);
}]);