
angular.module('SuMaiTong').controller('CategoryAttrConfigCtrl', [
'$scope', '$state', 'ApiManage', 'KtAlert',
function ($scope, $state, ApiManage, KtAlert) {

	var aliexpress_cate_id = Number($state.params.cateId);
	var AlicateConfModel = {};
	// 产品的分类属性配置
	$scope.ref_cates = [];
	ApiManage.get('AliexpressCate.detailByCateId',aliexpress_cate_id)
	.then(function(res){
		res.cate_attrs.push({names:{zh:'无效属性'},id: 0});
		$scope.aliexress_attrs = res.cate_attrs;
		return ApiManage.get('AliCateConf.detailByAliexpressCid', aliexpress_cate_id);
	}).then(function(res){
		AlicateConfModel = res;
		$scope.aliexpress_cate_configs = res.conf_info;
	}).catch(function(err){
		console.log('出错了',err);
	});
	$scope.onSelectedAttr = function(attr, k){
		$scope.ref_cates[k]= null;
		$scope.aliexress_attrs.filter(function(index) {
			if(index.id==attr.ref_cate_id){
				$scope.ref_cates[k] = index;
				attr.attributeShowTypeValue = index.attributeShowTypeValue;
				attr.ref_cate = index;
				// console.log(attr, index);
			}
		});
	};
	$scope.saveAttrsConfig = function(){
		ApiManage.post('AliCateConf.save', AlicateConfModel)
		.then(function(res){
			console.log('保存成功');
			KtAlert.success('保存成功');
		});
	};
	$scope.value2string = function(value){
		return String(value.replace('.','0'));
	};
}]);