angular.module('SuMaiTong').controller('AliexpressProductFormCtrl', ['$scope', '$state', 'ApiManage', '$q', function ($scope, $state, ApiManage, $q) {
	
	$scope.category_attrs = [];
	$scope.sku_attrs = [];
	$scope.product_custom_attrs = {};
	$scope.aeopAeProductSKUs = {};

	$scope.$on('edit.product', function(event, product_data){
		$scope.product_data = product_data;
		ApiManage.get('AliexpressCate.detailByCateId', product_data.categoryId)
		.then(function(category){
			var data = formatAeopAeProductPropertys(product_data.aeopAeProductPropertys, category.cate_attrs);
			$scope.product_custom_attrs = data.custom_attrs;
			$scope.category_attrs = data.category_attrs;

			$scope.sku_attrs = category.cate_skus;
			$scope.select_skus = product_data.aeopAeProductSKUs;
		});
	});

	$scope.submit = function(){
		var data = unformatAeopAeProductPropertys($scope.category_attrs,$scope.product_custom_attrs);
		// product_data.aeopAeProductSKUs = data.skus;
		$scope.product_data.aeopAeProductPropertys = data;
		console.log($scope.product_data);
	};

	/**
	 * 产品属性转换为表单数据
	 * 主要是分离成系统属性和自定义属性
	 */
	function formatAeopAeProductPropertys(aeopAeProductPropertys, category_attrs){
		var custom_attrs = [];
		angular.forEach(category_attrs, function(item, i){
			aeopAeProductPropertys.filter(function(select){
				if(select.attrNameId==item.id){
					if(item.attributeShowTypeValue=='check_box'){
						angular.forEach(item.values, function(value){
							if(value.id==select.attrValueId){
								value.is_selected = true;
							}
						});
					}else if(item.attributeShowTypeValue=='list_box'){
						item.selectedValue=select.attrValueId;
					}else if(item.units){
						var units = select.attrValue.split(' ');
						item.selectedValue=units;
					}else{
						item.selectedValue=select.attrValue;
					}
				}
			});
		});
		// 自定义属性
		aeopAeProductPropertys.filter(function(item){
			if(item.attrName){
				custom_attrs.push(item);
			}
		});
		return {
			category_attrs: category_attrs,
			custom_attrs: custom_attrs
		};
	}
	/**
	 * 产品属性反向转换回提交数据
	 * 需要将系统属性和自定义属性合并
	 */
	function unformatAeopAeProductPropertys(category_attrs, product_custom_attrs){
		var skus = [], propertys = [];
		angular.forEach(category_attrs, function(item, i){
			if(item.sku===true){
				return false;
			}
			if(item.attributeShowTypeValue=='check_box'){
				angular.forEach(item.values, function(value){
					if(value.is_selected===true){
						propertys.push({
							attrNameId: item.id,
							attrValueId: value.id
						});
					}
				});
			}else if(item.attributeShowTypeValue=='list_box'){
				if(item.selectedValue){
					var attrValue;
					item.values.filter(function(value){
						if(value.id==item.selectedValue){
							attrValue = value;
						}
					});
					propertys.push({
						attrNameId: item.id,
						attrValueId: item.selectedValue
					});
				}
			}else if(item.units){
				if(item.selectedValue){
					propertys.push({
						attrNameId: item.id,
						attrValue: item.selectedValue.join(' ')
					});
				}
			}else{
				if(item.selectedValue){
					propertys.push({
						attrNameId: item.id,
						attrValue: item.selectedValue
					});
				}
			}
		});
		// 追加入自定义属性
		angular.forEach(product_custom_attrs, function(item, key){
			propertys.push(item);
		});
		return propertys;
	}

}]);