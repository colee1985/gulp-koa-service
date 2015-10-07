// AliexpressProductManage
/**
	速卖通产品模型
	注意点：POST数据不需要签名，只需TOKEN。
	分类属性和SKU为JSON串
*/
angular.module('SuMaiTong').factory('AliexpressProductManage', ['$timeout', 'AliexpressAuthManage','$http', '$q', function($timeout, AliexpressAuthManage, $http, $q) {
	var manage = {};
	var fields = {
		productId             : {label: 'ID'},
		detail                : {label: '详情'},
		aeopAeProductSKUs     : {label: '颜色价格'},
		deliveryTime          : {label: '备货期', default: 7},
		categoryId            : {label: '商品所属类目ID', default: 200000298},
		subject               : {label: '商品标题'},
		keyword               : {label: '搜索关键词'},
		productMoreKeywords1  : {label: '关键词一'},
		productMoreKeywords2  : {label: '关键词二'},
		summary               : {label: '简要描述'},
		groupId               : {label: '产品组ID'},
		promiseTemplateId     : {label: 'promiseTemplateId'},
		productPrice          : {label: '商品一口价'},
		freightTemplateId     : {label: '运费模版ID'},
		isImageDynamic        : {label: '商品主图图片类型'},
		imageURLs             : {label: '图片URL'},
		isImageWatermark      : {label: '图片是否加水印的标识'},
		productUnit           : {label: '商品单位'},
		packageType           : {label: '打包销售', type:'boolean', default: false},
		lotNum                : {label: '每包件数'},
		packageLength         : {label: '商品包装长度'},
		packageWidth          : {label: '商品包装宽度'},
		packageHeight         : {label: '商品包装高度'},
		grossWeight           : {label: '商品毛重'},
		isPackSell            : {label: '是否自定义计重'},
		baseUnit              : {label: 'baseUnit'},
		addUnit               : {label: 'addUnit'},
		addWeight             : {label: 'addWeight'},
		wsValidNum            : {label: '商品有效天数', default: 14},
		src                   : {label: '指此商品发布的来源', default: 'ISV'},
		aeopAeProductPropertys: {label: '商品属性类型'},
		bulkOrder             : {label: '批发最小数量'},
		bulkDiscount          : {label: '批发折扣'}
	};
	function Model(){
		var ths = this;
		var _fields = angular.copy(fields);
		angular.forEach(_fields, function(item, k){
			ths[k] = item.default||null;
		});
		return this;
	}
	function SkuModel(){
		return {
			ipmSkuStock: 999,
			skuCode: "",
			skuPrice: "",
			skuStock: true,
			aeopSKUProperty: [{
				propertyValueId: null,
				skuPropertyId: null,
				skuImage: null,
				propertyValueDefinitionName: null
			}]
		};
	}

	var units = {
		100000000:'袋 (bag/bags)',
		100000001:'桶 (barrel/barrels)' ,
		100000002:'蒲式耳 (bushel/bushels)' ,
		100078580:'箱 (carton)',
		100078581:'厘米 (centimeter)' ,
		100000003:'立方米 (cubic meter)' ,
		100000004:'打 (dozen)' ,
		100078584:'英尺 (feet)' ,
		100000005:'加仑 (gallon)' ,
		100000006:'克 (gram)' ,
		100078587:'英寸 (inch)' ,
		100000007:'千克 (kilogram)' ,
		100078589:'千升 (kiloliter)' ,
		100000008:'千米 (kilometer)' ,
		100078559:'升 (liter/liters)' ,
		100000009:'英吨 (long ton)' ,
		100000010:'米 (meter) 10',
		100000011:'公吨 (metric ton)' ,
		100078560:'毫克 (milligram)' ,
		100078596:'毫升 (milliliter)' ,
		100078597:'毫米 (millimeter)' ,
		100000012:'盎司 (ounce)' ,
		100000014:'包 (pack/packs)' ,
		100000013:'双 (pair)' ,
		100000015:'件/个 (piece/pieces)' ,
		100000016:'磅 (pound)' ,
		100078603:'夸脱 (quart)' ,
		100000017:'套 (set/sets)' ,
		100000018:'美吨 (short ton)' ,
		100078606:'平方英尺 (square feet)' ,
		100078607:'平方英寸 (square inch)' ,
		100000019:'平方米 (square meter)' ,
		100078609:'平方码 (square yard)' ,
		100000020:'吨 (ton)' ,
		100078558:'码 (yard/yards)'
	};
	var alibabaUnitMap = {
		'PCS': 100000015,
		'条': 100000015
	};
	function getKeys(){
		var res=[];
		for (var k in fields){
			res.push(k);
		}
		return res;
	}
	var keys = getKeys();

	// 通过ID获取产品
	function getProductById(id){
		return AliexpressAuthManage.http({
			method: 'GET',
			api_name: 'api.findAeProductById',
			params : {
				productId: id
			}
		}).then(function(res){
			return res.data;
		});
	}
	// 发布商品数据 
	function puhlishProductToSMT(aliexpress_en){
		// JSON.stringify
		var data = angular.copy(aliexpress_en);
		data.aeopAeProductPropertys = JSON.stringify(data.aeopAeProductPropertys);
		data.aeopAeProductSKUs = JSON.stringify(data.aeopAeProductSKUs);
		// data.aeopAeProductSKUs = [];

		data.isImageDynamic = true;
		data.imageURLs = data.imageURLs.join(';');
		return AliexpressAuthManage.http({
			method: 'POST',
			api_name: 'api.postAeProduct',
			data : data
		}).then(function(res){
			return res.data;
		});
	}
	// 更新商品数据 
	function updateProductToSMT(aliexpress_en){
		// JSON.stringify
		var data = angular.copy(aliexpress_en);
		data.aeopAeProductPropertys = JSON.stringify(data.aeopAeProductPropertys);
		data.aeopAeProductSKUs = JSON.stringify(data.aeopAeProductSKUs);
		data.isImageDynamic = true;
		data.imageURLs = data.imageURLs.join(';');
		return AliexpressAuthManage.http({
			method: 'POST',
			api_name: 'api.editAeProduct',
			data : data
		}).then(function(res){
			return res.data;
		});
	}
	// 上架商品
	// onlineProduct(32215051685);
	function onlineProduct(productIds_str){
		return AliexpressAuthManage.http({
			method: 'POST',
			api_name: 'api.onlineAeProduct',
			data : {productIds: productIds_str}
		}).then(function(res){
			return res.data;
		});
	}
	

	// 产品属性转换为表单数据
	function formatProductAeop(aeopAeProductPropertys, aeopAeProductSKUs, category_attrs, category_skus){
		var sku_attrs = category_skus, custom_attrs = [], selected_skus={};
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
		// SKU属性
		if(sku_attrs){
			// 为产品已有SKU设置勾选状态
			angular.forEach(aeopAeProductSKUs, function(sku, k){
				angular.forEach(sku_attrs, function(sku_attr, i){
					if(sku.aeopSKUProperty && sku.aeopSKUProperty[i]){
						sku_attr.values.filter(function(value) {
							if(value.id==sku.aeopSKUProperty[i].propertyValueId){
								value.is_selected = true;
							}
						});
					}
				});
				selected_skus[k] = sku;
			});
		}
		
		return {
			category_attrs: category_attrs,
			custom_attrs: custom_attrs,
			sku_attrs: sku_attrs,
			select_skus: selected_skus
		};
	}
	// 产品属性反向转换回提交数据
	function unformatProductAeop(category_attrs, product_custom_attrs, sku_attrs){
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
		// 处理生成SKU属性列表
		if(sku_attrs && sku_attrs[0]){
			angular.forEach(sku_attrs[0].values, function(sku, i){
				if(sku.is_selected===true){
					skus.push(sku.aeop);
				}
			});
		}
		return {
			skus: (skus),
			propertys: (propertys)
		};
	}

	/**
	 * 上传图片到图片银行
	 */
	function uploadImage(img_url){
		var defer = $q.defer();
		var request_path = 'param2/1/aliexpress.open/api.uploadImage/'+AliexpressAuthManage.appKey;
		var url = AliexpressAuthManage.request_url+request_path;
		var request = require('request');
		request.get(img_url).pipe(request.post(url, {qs: {
			access_token: AliexpressAuthManage.access_token,
			fileName: img_url.replace(/\?.*$/gi, '')
		}}, function(err, res, body){
			// console.log('body:',res, body);
			if(err){
				return defer.reject(err);
			}
			defer.resolve(JSON.parse(body));
		})).on('error', function(error){
			console.log('图片上传错误',error);
		}).on('response', function(response){
			// console.log('response:', response);
		});
		return defer.promise;
	}
	// uploadImage('http://img.china.alibaba.com/img/ibank/2014/214/713/1702317412_2118088041.jpg');
	/**
	 * 上传图片到临时目录
	 */
	function uploadTmpImage(img_url){
		var defer = $q.defer();
		var request_path = 'param2/1/aliexpress.open/api.uploadTempImage/'+AliexpressAuthManage.appKey;
		var url = AliexpressAuthManage.request_url+request_path;
		var request = require('request');
		request.get(img_url).pipe(request.post(url, {qs: {
			access_token: AliexpressAuthManage.access_token,
			srcFileName: img_url
		}}, function(err, res, body){
			// console.log('body:',res, body);
			if(err){
				return defer.reject(err);
			}
			defer.resolve(JSON.parse(body));
		})).on('error', function(error){
			console.log('图片上传错误',error);
		}).on('response', function(response){
			// console.log('response:', response);
		});
		return defer.promise;
	}

	manage.fields = fields;
	manage.keys = keys;
	manage.getProductById = getProductById;
	manage.formatProductAeop = formatProductAeop;
	manage.unformatProductAeop = unformatProductAeop;
	manage.SkuModel = SkuModel;
	manage.puhlishProductToSMT = puhlishProductToSMT;
	manage.updateProductToSMT = updateProductToSMT;
	manage.Model = Model;
	manage.alibabaUnitMap = alibabaUnitMap;
	manage.uploadImage = uploadImage;
	manage.uploadTmpImage = uploadTmpImage;
	return manage;
}]);