/**
阿里巴巴中文站登录按钮
USE: <div ali1688-login-btn></div>
*/
angular.module('Ali1688Sdk',[])
.factory('Ali1688Auth',['$q', function($q){
	var obj = _.extend({
		data: {},
		save: function(data){
			return $q.when(DB.objectStore('cache_data').put(data, 'ali1688authInfo'));
		}
	});
	$q.when(DB.objectStore('cache_data').get('ali1688authInfo')).then(function(data){
		obj.data = data;
	});
	return obj;
}]).directive('ali1688LoginBtn', ['$q', '$http', 'Ali1688Auth', function ($q, $http, Ali1688Auth) {
	return {
		// require : ['^form', 'ngModel'],
		restrict: 'AE',
		replace: false,
		// transclude: true,
		link: function(scope, element, attrs, ctrl) {
			element.click(function(){
				window.document.ali1688LoginSuccess = null;
				$http.post('/call/Ali1688Sdk.getLoginUrl',{}).then(function(res){
					var win = window.open(res.data);
					window.document.ali1688LoginSuccess = function(data){
						Ali1688Auth.save(data).then(function(){
							window.document.ali1688LoginSuccess = null;
							Ali1688Auth.data = data;
						});
					};
				});
			});
		}
	};
}]).run(['$rootScope', 'Ali1688Auth', function($rootScope, Ali1688Auth){
	$rootScope.Ali1688Auth = Ali1688Auth;
}]);