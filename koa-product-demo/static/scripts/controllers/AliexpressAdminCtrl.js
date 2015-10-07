
angular.module('SuMaiTong').controller('AliexpressAdminCtrl', ['$scope', '$state', 'ApiManage', '$q', 'KtPager', 'KtAlert',
function ($scope, $state, ApiManage, $q, KtPager, KtAlert) {

	var q = JSON.parse($state.params.q||'{}');
	$scope.KtPager = new KtPager(10, 8);
	$scope.search = {
		query:q.query,
		page: q.page||1,
		postCategryId: q.postCategryId||null
	};
	$scope.KtPager.cur_page = $scope.search.page;
	$scope.products = [];
	ApiManage.get('Aliexpress.getList', $scope.search).then(function(res){
		$scope.products = res.products;
		$scope.KtPager.setTotal(res.total);
	});
	$scope.KtPager.onSelected = function(page){
		$scope.search.page = page;
		$state.go('aliexpress.admin', {q: JSON.stringify($scope.search)});
	};
	// 搜索
	$scope.toSearch = function(){
		$scope.search.page = 1;
		$state.go('aliexpress.admin', {q: JSON.stringify($scope.search)});
	};

	$scope.syncByPid = function(pid){
		$q.when(DB.objectStore('cache_data').get('aliexpressauthInfo'))
		.then(function(res){
			return ApiManage.get('Aliexpress.syncByPid', pid, res.access_token);
		}).then(function(res){
			console.log(res);
		}).finally();
	};

	$scope.syncAllToLocal = function(){
		var access_token;
		$q.when(DB.objectStore('cache_data').get('aliexpressauthInfo'))
		.then(function(res){
			access_token = res.access_token;
			return $q.all([
				ApiManage.get('Aliexpress.gatherIds', 'onSelling', access_token),
				ApiManage.get('Aliexpress.gatherIds', 'offline', access_token),
				ApiManage.get('Aliexpress.gatherIds', 'auditing', access_token),
				ApiManage.get('Aliexpress.gatherIds', 'editingRequired', access_token)
			]);
		}).then(function(res){
			console.log('所有产品ID已得到，正在同步产品详情……');
			var ids = _.union.apply(_, res);
			var reqs = [];
			_.each(ids, function(id){
				var req = ApiManage.get('Aliexpress.syncByPid', id, access_token).then(function(res){
					if(res.error_code){
						console.log(id+' 同步失败',res);
					}else{
						console.log(res.subject+' 完成');
					}
				});
				reqs.push(req);
			});
			return Q.all(reqs);
		}).then(function(res){
			console.log('同步完成');
			$state.reload();
		}).finally();
	};

	$scope.del = function(_id){
		ApiManage.get('Aliexpress.del', _id).then(function(res){
			$state.reload();
		});
	};

	// 获取对应我的产品的信息
	$scope.getMyproductByAliexpress = function(product){
		ApiManage.get('Myproduct.findOne', {aliexpress_id: product._id}).then(function(res){
			product.Myproduct = res;
			return ApiManage.get('Ali1688.findOne', {_id: res.source_of_ali1688_id||''});
		}).then(function(res){
			product.source_of_ali1688 = res;
		});

		// 同步设置已有数据
		ApiManage.get('Product.findOne', {aliexpress_productId: product.productId}).then(function(res){
			if(!res){
				return ;
			}
			return ApiManage.get('Ali1688.findOne', {offerId: res.ali1688.offerId}).then(function(res){
				product.source_of_ali1688 = res;
				return ApiManage.post('Myproduct.update', {source_of_ali1688_id: res._id}, {aliexpress_id: product._id});
			}).then(function(res){
				product.Myproduct = res;
			});
		});
		
	};
	
}]);