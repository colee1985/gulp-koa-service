/**
阿里巴巴国际站登录按钮
USE: <div aliexpress-login-btn></div>
*/
angular.module('AliexpressSdk',[])
.factory('AliexpressAuth',['$q', function($q){
	var obj = _.extend({
		data: {},
		save: function(data){
			return $q.when(DB.objectStore('cache_data').put(data, 'aliexpressauthInfo'));
		}
	});
	$q.when(DB.objectStore('cache_data').get('aliexpressauthInfo')).then(function(data){
		obj.data = data;
	});
	return obj;
}]).directive('aliexpressLoginBtn', ['$q', '$http', 'AliexpressAuth', function ($q, $http, AliexpressAuth) {
	return {
		// require : ['^form', 'ngModel'],
		restrict: 'AE',
		replace: false,
		// transclude: true,
		link: function(scope, element, attrs, ctrl) {
			element.click(function(){
				window.document.aliexpressLoginSuccess = null;
				$http.post('/call/AliexpressSdk.getLoginUrl').then(function(res){
					console.log(res);
					var win = window.open(res.data);
					window.document.aliexpressLoginSuccess = function(data){
						AliexpressAuth.save(data).then(function(){
							window.document.aliexpressLoginSuccess = null;
							AliexpressAuth.data = data;
						});
					};
				});
			});
		}
	};
}]).run(['$rootScope', 'AliexpressAuth', function($rootScope, AliexpressAuth){
	$rootScope.AliexpressAuth = AliexpressAuth;
}]);