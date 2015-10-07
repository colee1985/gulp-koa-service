angular.module('SuMaiTong').controller('Ali1688GatherCtrl', ['$scope', '$state', 'ApiManage', '$q',
function ($scope, $state, ApiManage, $q) {
	
	// 拆分URLS成数据
	function splitUlrs(urls){
		// var res = urls.match(/offer\/([\d]*).*/gi);
		var patt = new RegExp(/offer\/([\d]*).*/gi);
		var result, ids=[];
		while ((result = patt.exec(urls)) !== null) {
			ids.push(result[1]);
		}
		return _.uniq(ids);
	}

	// http://detail.1688.com/offer/1225048178.html
	$scope.urls = window.localStorage.gather_urls||'http://detail.1688.com/offer/1244183533.html\r\nhttp://detail.1688.com/offer/1178914841.html';
	$scope.gatherDataByUrls = function(){
		$scope.gather_progress = [];
		var ids = splitUlrs($scope.urls);
		window.localStorage.gather_urls = $scope.urls;
		angular.forEach(ids, function(id){
			ApiManage.get('Ali1688.getherDataBy1688Id', id).then(function(res){
				$scope.gather_progress.push(id+' 采集完成');
				console.log(res);
				return res;
			}).catch(function(err){
				console.log(err,' err');
			});
		});
	};

	$scope.gatherProductByOrders = function(){
		$scope.gather_progress = [];
		$q.when(DB.objectStore('cache_data').get('ali1688authInfo'))
		.then(function(res){
			return ApiManage.get('Ali1688.gatherProductBy1688Orders', {
				buyerMemberId: res.memberId,
				access_token: res.access_token,
				pageNO: 1,
				pageSize: 20
			});
		}).then(function(res){
			$scope.gather_progress.push('已买到的产品采集完成');
		});
	};

	$scope.member_id = 'sll0510';
	$scope.gatherProductByMemberId = function(){
		$scope.gather_progress = [];
		var reqs = [];
		$q.when(DB.objectStore('cache_data').get('ali1688authInfo'))
		.then(function(res){
			return ApiManage.get('Ali1688.gatherProductTotalBy1688MemberId', '手链',  $scope.member_id);
		}).then(function(res){
			var max = Math.ceil(res.data/50);
			var items = [];
			while(max>=0){
				items.push(max+1);
				max--;
			}
			_.each(items, function(i){
				var req = ApiManage.get('Ali1688.gatherProductBy1688MemberId', '手链',  $scope.member_id, i)
				.then(function(res){
					$scope.gather_progress.push('第'+i+'页采集完成');
				});
				reqs.push(req);
			});
			return $q.all(reqs);
		});
	};
}]);