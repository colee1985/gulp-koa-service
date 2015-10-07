
angular.module('SuMaiTong').controller('CategoryAdminCtrl', [
'$scope', '$state', 'ApiManage',
function ($scope, $state, ApiManage) {
	
	$scope.form_is_shown = false;
	$scope.categoryId = null;
	$scope.activeModel = null;
	$scope.models = [];
	ApiManage.get('AliCateConf.getList').then(function(res){
		$scope.models = res;
	});

	$scope.getProductCount = function(model){
		ApiManage.get('Ali1688.count', {postCategryId: model.ali1688_cate_id})
		.then(function(res){
			model.product_count = res.data;
		});
	};

	// 将要选择的数据对象，用于弹出分类选择框
	$scope.willSelectModel = function(model){
		$scope.form_is_shown = true;
		$scope.save = function(){
			var cate = null;
			$scope.form_is_shown = false;
			model.aliexpress_cate_id = $scope.categoryId;
			ApiManage.post('AliCateConf.save', model).then(function(res){
				model.aliexpress_cate_id = res.aliexpress_cate_id;
				$state.reload();
			});
		};
	};
	/**
	 * 从所有产品提取分类
	 */
	$scope.gatherByProducts = function(){
		ApiManage.get('AliCateConf.extractionAttrsToConfByAll1688Product').then(function(res){
			$state.reload();
		});
	};

}]);