angular.module('SuMaiTong').controller('DemoCtrl', ['$scope', '$state', 'AlibabaProductModel','AliexpressProductManage',
	'AlibabaCategryModel',
function ($scope, $state, AlibabaProductModel, AliexpressProductManage, AlibabaCategryModel) {
	
	AlibabaProductModel.getProductById('1244183533').then(function(res){
		console.log('阿里巴巴', res);
		// res.postCategryId
		return AlibabaCategryModel.getCategryPathById(res.postCategryId);
	}).then(function(res){
		console.log('阿里巴巴分类：',res);
	});

	AlibabaProductModel.getProductListBySearch({memberId: 'mingyangpd3', pageSize:30}).then(function(res){
		console.log('阿里巴巴列表',res, res.toReturn.length);
	});

	AliexpressProductManage.getProductById('32250823981').then(function(res){
		console.log('速卖通',res);
	});

	// window.indexedDB.deleteDatabase('smt');
}]);