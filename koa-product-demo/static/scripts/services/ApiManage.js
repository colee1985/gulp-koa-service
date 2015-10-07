/**
 * API管理服务
 * eg: /api/Ali1688Sdk.getLoginUrl
 */
angular.module('SuMaiTong').factory('ApiManage', ['$http', '$q', function($http, $q) {
	return {
		get: function(ctrl_action){
			var params=[];
			angular.forEach(arguments, function(v, i){
				if(i>0){
					params.push(v);
				}
			});
			return $http({
				method: 'GET',
				responseType: 'JSON',
				url: '/call/'+ctrl_action,
				params: {
					jsondata: JSON.stringify(params)
				}
			}).then(function(res){
				return res.data;
			});
		},
		post: function(ctrl_action){
			var datas=[];
			angular.forEach(arguments, function(v, i){
				if(i>0){
					datas.push(v);
				}
			});
			return $http({
				method: 'POST',
				responseType: 'JSON',
				url: '/call/'+ctrl_action,
				data: datas
			}).then(function(res){
				return res.data;
			});
		}
	};
}]);