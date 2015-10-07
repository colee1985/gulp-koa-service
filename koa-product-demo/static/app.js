(function(window){
"use strict"
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

angular.module('SuMaiTong', [
	'pascalprecht.translate',
	'ngSanitize',
	'ui.router',
	'ngMessages',
	'Ali1688Sdk',
	'AliexpressSdk'
]).config(['$locationProvider', '$urlRouterProvider', '$translateProvider', function($locationProvider, $urlRouterProvider, $translateProvider) {
	// html5Mode需要服务端配合指向
	// $locationProvider.html5Mode(true).hashPrefix('!');
	$urlRouterProvider.otherwise("/site");
}]);
angular.module('SuMaiTong')
.config(['$httpProvider', function ($httpProvider) {
	// $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	// $httpProvider.defaults.headers.post["Content-Type"] = "multipart/form-data";
	$httpProvider.interceptors.push(['$q', function($q) {
		return {
			'request': function(config) {
				if (!config.data) {
					config.data = {};
				}
				return config;
			},

			'response': function(response) {
				// same as above
				return response;
			}
		};
	}]);
}]);

var DB = $.indexedDB("smt", {
	// The second parameter is optional
	"version" : 1,  // Integer version that the DB should be opened with
	"upgrade" : function(transaction){
		// Function called when DB is of lower version that specified in the version parameter
		// See transaction for details on the argument
		
	},
	"schema" : {
		"1" : function(transaction){
			// List of instructions to run when DB version is upgraded to 1. 
			// See transaction for details on the argument

			// transaction.deleteObjectStore("my_product");
			// var my_product = transaction.createObjectStore("my_product", {keyPath: '_id', autoIncrement: true});
			// my_product.createIndex('alibaba.offerId', {"unique": true, "multiEntry" : false}, 'alibaba_offerId_idx');
			// my_product.createIndex('alibaba.subject', {"unique": false, "multiEntry" : false}, 'alibaba_subject_idx');
			// my_product.createIndex('alibaba.memberId', {"unique": false, "multiEntry" : false}, 'alibaba_memberId_idx');
			// my_product.createIndex('alibaba.postCategryId', {"unique": false, "multiEntry" : false}, 'alibaba_postCategryId_idx');
			// my_product.createIndex('aliexpress.productId', {"unique": true, "multiEntry" : false}, 'aliexpress_productId_idx');
			// my_product.createIndex('aliexpress.subject', {"unique": false, "multiEntry" : false}, 'aliexpress_subject_idx');
			// my_product.createIndex('aliexpress.categoryId', {"unique": false, "multiEntry" : false}, 'aliexpress_categoryId_idx');
			// my_product.createIndex('aliexpress.groupId', {"unique": false, "multiEntry" : false}, 'aliexpress_groupId_idx');
			
			// transaction.deleteObjectStore("aliexpress_category");
			// var aliexpress_category = transaction.createObjectStore("aliexpress_category", {keyPath: '_id', autoIncrement: true});
			// aliexpress_category.createIndex('isleaf', {"unique": false, "multiEntry" : false}, 'isleaf_idx');
			// aliexpress_category.createIndex('id', {"unique": false, "multiEntry" : false}, 'id');
			// aliexpress_category.createIndex('names.zh', {"unique": false, "multiEntry" : false}, 'name_zh_idx');
			// aliexpress_category.createIndex('parent_id', {"unique": false, "multiEntry" : false}, 'parent_id_idx');

			// transaction.deleteObjectStore("aliexpress_category_configs");
			// var aliexpress_category_configs = transaction.createObjectStore("aliexpress_category_configs", {keyGenerator: 'cate_id'});
			
			// // var aliexpress_category = transaction.objectStore("aliexpress_category");
			// // var my_product = transaction.objectStore("my_product");

			// transaction.deleteObjectStore("alibaba_category");
			// var alibaba_category = transaction.createObjectStore("alibaba_category", {keyPath: '_id', autoIncrement: true});
			// alibaba_category.createIndex('isleaf', {"unique": false, "multiEntry" : false}, 'isleaf');
			// alibaba_category.createIndex('catsId', {"unique": true, "multiEntry" : false}, 'catsId');
			// alibaba_category.createIndex('catsName', {"unique": false, "multiEntry" : false}, 'catsName');
			// alibaba_category.createIndex('path', {"unique": false, "multiEntry" : false}, 'path');
			// alibaba_category.createIndex('aliexpress_cate_id', {"unique": false, "multiEntry" : false}, 'aliexpress_cate_id');

			// 缓存数据
			transaction.deleteObjectStore("cache_data");
			var cache_data = transaction.createObjectStore("cache_data", {keyGenerator: '_id'});
		},
		"2" : function(transaction){
			// SMT与中文站分类属性配置
			// transaction.deleteObjectStore("aliexpress_category_configs");
			// var aliexpress_category_configs = transaction.createObjectStore("aliexpress_category_configs", {keyGenerator: 'cate_id'});
		}
	}
});

// var objectStore = DB.objectStore("aliexpress_category");
// objectStore.add({
// 	id: 200000392,
// 	isleaf: 1,
// 	level: null,
// 	parent_id: 200000297
// });
// objectStore.add({
// 	id: 200000392,
// 	isleaf: true,
// 	level: null,
// 	parent_id: 200000297,
// 	names: {
// 		zh:'中文'
// 	}
// });
// objectStore.index('isleaf').each(function(item){
// 	console.log(item);
// });
	// store.put({
	// 	_id: 1,
	// 	id: 200000392,
	// 	isleaf: true,
	// 	level: 2,
	// 	parent_id: 200000297,
	// 	names: {
	// 		zh:'中文'
	// 	}
	// }).fail(function(res, e){
	// 	console.log(res, e);
	// });
	// store.get(1).then(function(item){
	// 	console.log(item);
	// 	return getAttributesResultByCateId(item.id)
	// 	.then(function(attrs){
	// 		item.attributes = attrs;
	// 		console.log(item);
	// 		return store.put(item, 1);
	// 	}).then(function(res){
	// 		console.log(res,',,,,,');
	// 	}).catch(function(err){
	// 		console.log(err,',,,');
	// 	});
	// });
// 删除数据库存用：
// indexedDB.deleteDatabase(name);

angular.module('SuMaiTong').controller('Ali1688AdminCtrl', ['$scope', '$state', 'ApiManage', '$q', 'KtPager', 'KtAlert',
function ($scope, $state, ApiManage, $q, KtPager, KtAlert) {

	$scope.KtPager = new KtPager(10, 8);
	$scope.search = {
		page: $state.params.page||1,
		subject: $state.params.subject||'',
		postCategryId: $state.params.postCategryId||null
	};
	$scope.KtPager.cur_page = $scope.search.page;
	$scope.products = [];
	ApiManage.get('ali1688.getList', $scope.search).then(function(res){
		$scope.products = res.products;
		$scope.KtPager.setTotal(res.total);
	});
	$scope.KtPager.onSelected = function(page){
		$scope.search.page = page;
		$state.go('ali1688.admin', $scope.search);
	};
	// 搜索
	$scope.toSearch = function(){
		$scope.search.page = 1;
		$state.go('ali1688.admin', $scope.search);
	};

	// 加入我的产品库
	$scope.addToMyproduct = function(product){
		ApiManage.get('Myproduct.createByAli1688Id', product._id).then(function(res){
			console.log(res);
		});
	};

	// 重新采集
	$scope.regether = function(product){
		ApiManage.get('Ali1688.getherDataBy1688Id', product.offerId).then(function(res){
			console.log(res);
			angular.forEach(res, function(v, k){
				product[k] = v;
			});
		});
	};
	
}]);
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
angular.module('SuMaiTong').controller('HeaderCtrl', ['$scope', '$state',
function ($scope, $state) {
	
}]);

angular.module('SuMaiTong').controller('MyproductAdminCtrl', ['$scope', '$state', 'ApiManage', '$q', 'KtPager', 'KtAlert',
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
	var getList = ApiManage.get('Myproduct.getList', $scope.search).then(function(res){
		$scope.products = res.products;
		$scope.KtPager.setTotal(res.total);
	}).then(function(){
		var reqs=[];
		_.each($scope.products, function(product){
			reqs.push(ApiManage.get('Ali1688.findOne', {_id: product.source_of_ali1688_id||'xxx'}).then(function(res){
				product.source_of_ali1688 = res;
			}));
		});
		return $q.all(reqs);
	});
	$scope.KtPager.onSelected = function(page){
		$scope.search.page = page;
		$state.go('myproduct.admin', {q: JSON.stringify($scope.search)});
	};
	// 搜索
	$scope.toSearch = function(){
		$scope.search.page = 1;
		$state.go('myproduct.admin', {q: JSON.stringify($scope.search)});
	};

	// 生成速卖通数据
	$scope.createAliexpress = function(product){
		return $q.when(DB.objectStore('cache_data').get('aliexpressauthInfo')).then(function(res){
			return ApiManage.get('createAliexpressByMyproduct.createAliexpress', product._id, res.access_token);
		}).then(function(res){
			product.aliexpress_id = res._id;
			product.aliexpress = res;
			KtAlert.success('生成成功');
		});
		
	};
	$scope.save = function(product){
		ApiManage.post('Myproduct.update', {_id:product._id}, angular.copy(product)).then(function(res){
			KtAlert.success('保存成功');
			$state.reload();
			console.log(res);
		});
	};
	// SMT数据保存
	$scope.aliexpressSave = function(aliexpress){
		return ApiManage.post('Aliexpress.update', {_id: aliexpress._id}, aliexpress)
		.then(function(res){
			if(!res._id){
				return KtAlert.error('保存出错');
			}
			aliexpress.productId = res.productId;
			KtAlert.success('保存成功');
		});
	};
	// 更新或发布到SMT线上
	$scope.aliexpressPut = function(aliexpress){
		return $q.when(DB.objectStore('cache_data').get('aliexpressauthInfo')).then(function(res){
			return ApiManage.post('Aliexpress.putProduct', aliexpress._id, res.access_token);
		}).then(function(res){
			console.log(res);
			if(!res._id){
				return KtAlert.error('发布出错');
			}
			aliexpress.productId = res.productId;
			KtAlert.success('发布成功');
		});
	};

	// 自动发布列表中的数据
	function eachPut(i){
		console.log('处理 '+i);
		if($scope.products[i]){
			var product = $scope.products[i];
			$q.when().then(function(){
				if(product.aliexpress && product.aliexpress._id){
					return ;
				}
				return $scope.createAliexpress(product);
			}).then(function(){
				if(product.aliexpress && !product.aliexpress.productId && product.source_of_ali1688.memberId=='sll0510'){
					return $scope.aliexpressPut(product);
				}
			}).then(function(){
				eachPut(i+1);
			}).finally();
		}else{
			console.log('自动处理完成');
			KtAlert.warning('自动处理完成');
			$scope.search.page++;
			// $state.go('myproduct.admin', $scope.search);
		}
	}
	getList.then(function(){
		// eachPut(0);
	}).finally();
}]);

angular.module('SuMaiTong').controller('ProductAdminCtrl', ['$scope', '$state', 'ApiManage', '$q', 'KtPager', 'KtAlert',
function ($scope, $state, ApiManage, $q, KtPager, KtAlert) {

	$scope.KtPager = new KtPager(10, 8);
	$scope.search = {
		page: $state.params.page||1,
		subject: $state.params.subject||'',
		postCategryId: $state.params.postCategryId||null
	};
	$scope.KtPager.cur_page = $scope.search.page;
	$scope.products = [];
	ApiManage.get('Product.getList', $scope.search).then(function(res){
		$scope.products = res.products;
		$scope.KtPager.setTotal(res.total);
	});
	$scope.KtPager.onSelected = function(page){
		$scope.search.page = page;
		$state.go('product.admin', $scope.search);
	};
	// 搜索
	$scope.toSearch = function(){
		$scope.search.page = 1;
		$state.go('product.admin', $scope.search);
	};

	// 创建SMT产品信息
	$scope.createSmt = function(product, index){
		ApiManage.get('AutoCreateAliexpressBy1688.run', product._id).then(function(res){
			console.log(res);
			angular.forEach(res, function(v, k){
				product[k] = v;
			});
		});
	};

	// PUT到SMT
	$scope.put = function(product){
		var access_token;
		$q.when(DB.objectStore('cache_data').get('aliexpressauthInfo')).then(function(res){
			access_token = res.access_token;
			if(product.aliexpress_productId){
				return product;
			}
			console.log('正在上传图片');
			return ApiManage.post('Product.uploadImages', product._id, access_token);
		}).then(function(res){
			return ApiManage.post('Product.putProduct', product._id, access_token);
		}).then(function(res){
			console.log(res);
			if(res.error){
				if(res.error.error_code=="13001024"){
					product.aliexpress_productId = '';
					ApiManage.post('Product.bindAliexpressId', product._id, product.aliexpress_productId);
				}
				return KtAlert.error(res.error.error_message);
			}
			angular.forEach(res, function(v, k){
				product[k] = v;
			});
			KtAlert.success('发布成功');
		}).catch(function(err){
			return KtAlert.error(res);
			console.log('err:', err);
		});
	};

	// 绑定ID
	$scope.bindSmtId = function(product){
		return ApiManage.post('Product.bindAliexpressId', product._id, product.aliexpress_productId);
	};
	
}]);
angular.module('SuMaiTong').controller('ProductUpdateCtrl', ['$scope', '$state', 'ApiManage', '$q', function ($scope, $state, ApiManage, $q) {

	$scope.product = {};
	ApiManage.get('Product.detail', $state.params._id).then(function(res){
		console.log(res);
		$scope.product = res;
		$scope.setEdit(res.aliexpress_zh);
	});

	// 绑定ID
	$scope.bindSmtId = function(product){
		return ApiManage.post('Product.bindAliexpressId', product._id, product.aliexpress_productId);
	};
	
	$scope.setEdit = function(data){
		$scope.$broadcast('edit.product', data);
	};

	// 打开速卖通编辑
	$scope.windowEdit = function(product){
		var url = 'http://posting.aliexpress.com/wsproduct/edit_wholesale_product.htm?productId='+product.aliexpress_en.productId;
		var edit_window = window.open(url);
		edit_window.window.location.href = (url);
	};
}]);
angular.module('SuMaiTong').controller('SidebarCtrl', ['$scope', '$state',
function ($scope, $state) {
	
	
}]);
/**
分类选择器
USE: <div aliexpress-cate-select></div>
*/
angular.module('SuMaiTong').directive('aliexpressCateSelect', ['ApiManage', '$q', '$translate', function (ApiManage, $q, $translate) {
	return {
		require : ['^form', 'ngModel'],
		restrict: 'AE',
		replace: true,
		templateUrl: 'templates/directives/aliexpressCateSelect.html',
		// transclude: true,
		scope: {
			name: '@'
		},
		link: function(scope, element, attrs, ctrl) {
			// console.log(ctrl);
			var rule_key;
			var _form = scope._form = ctrl[0];
			var _input = scope._input = ctrl[1];

			_input.$render = function(){
				// scope.selected_id = _input.$viewModel;
			};
			scope.selects = [];//每一层的
			scope.categorys = [];
			scope.selected_id = 0;

			scope.onSelectedItem = function(index){
				var category = scope.selects[index];
				if(Boolean(category.isleaf)===true){
					scope.selected_id = category.id;
					_input.$setViewValue(category.id);
					scope.selects[index+1] = null;
				}else{//否则递归处理后面的默认选择项
					scope.selects[index+1] = scope.selects[index].childs[0];
					scope.onSelectedItem(index+1);
				}
			};

			ApiManage.get('Cache.get', 'AliexpressCates').then(function(res){
				// console.log(res);
				scope.categorys = res;
				scope.selects[0] = res[0];
				scope.onSelectedItem(0);
			});
		}
	};
}]);
// 
/*
	错误警告提示组件
	可在controller或view中分别使用
	在controller中使用示例：
		KtAlert.success(msg);
		KtAlert.error(msg);
		KtAlert.warning(msg);

	模板中引用示例：
		<div kt-alert-success>成功信息</div>
		<div kt-alert-error>错误信息</div>
		<div kt-alert-warning>警告信息</div>
*/
angular.module('SuMaiTong').factory('KtAlert', ['$compile', '$rootScope', '$timeout', '$translate', function ($compile, $rootScope, $timeout, $translate) {
	function generateUI(conf){
		var msg_html = $translate.instant(String(conf.message));
		var scope = $rootScope.$new();
		var template = '<div kt-alert-'+conf.status+'>'+msg_html+'</div>';
		var linkup = $compile(template);
		var ui = linkup(scope);
		var wrap = $('<div class="kt-alert-server"></div>').append(ui);

		function alertClose(){
			scope.$destroy();
			wrap.remove();
		}
		scope.alertClose = alertClose;
		// 编译没有JQ加CSS快，所以做点延迟。
		$timeout(function () {
			wrap.appendTo('body');
			ui.css({
				position: 'absolute',
				top: 100,
				left: ($('body').width()-ui.width())*0.5
			});
			ui.find('.kt-alert-message-closebtn').click(function(event) {
				scope.$apply(function(){
					alertClose();
				});
			});
		},360);
		$timeout(function() {
			alertClose();
		}, 3000);
	}
	return {
		success: function(msg){
			generateUI({
				status: 'success',
				message: msg
			});
		}, 
		error: function(msg){
			generateUI({
				status: 'error',
				message: msg
			});
		}, 
		warning: function(msg){
			generateUI({
				status: 'warning',
				message: msg
			});
		}
	}
}]).directive('ktAlertSuccess', [ function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'templates/directives/kt_alert.html',
		transclude: true,
		scope: {
			
		},
		link: function(scope, element, attrs, ctrl) {
			scope.status = 'success';
			scope.alertClose = function(){
				console.log('ktAlertSuccess alertClose');
				scope.$destroy();
				element.remove();
			}
		}
	}
}]).directive('ktAlertError', [ function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'templates/directives/kt_alert.html',
		transclude: true,
		scope: {
			
		},
		link: function(scope, element, attrs, ctrl) {
			scope.status = 'error';
			scope.alertClose = function(){
				scope.$destroy();
				element.remove();
			}
		}
	}
}]).directive('ktAlertWarning', [ function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'templates/directives/kt_alert.html',
		transclude: true,
		scope: {
			
		},
		link: function(scope, element, attrs, ctrl) {
			scope.status = 'warning';
			scope.alertClose = function(){
				scope.$destroy();
				element.remove();
			}
		}
	}
}]);

// 分页组件
/*
控制器里先配置一个分页服务:
参数：KtPager(每页条数，显示页码个数)
$scope.KtPager = new KtPager(10, 8);
	$scope.pagelistdemo = [];
	$scope.KtPager.onSelected = function (page){
		communityManager.searchAllGames({
			keyword: 'a',
			type: 1,
			pagesize:5,
			pageindex: page
		}).then(function(data){
			console.log('pagelistdemo:',data);
			console.log('pagelistdemo:',data.data.total);
			$scope.pagelistdemo = data.data.games;
			$scope.KtPager.total = data.data.total;
		});
	}
	$scope.KtPager.onSelected(1);
模板使用配置好的服务：
	<div kt-pager="KtPager"></div>
	注意：kt-pager 的参数不能为空
参数说明：
	$scope.KtPager.onSelected：页码被选择事件
	$scope.KtPager.setPage: 主动设置页码
*/
angular.module('SuMaiTong').factory('KtPager', [function () {
	function generateUiData()
	{
		var total = this.total;
		var page_size = this.page_size;
		var tag_count = this.tag_count;
		// 最大页码
		var max_page = this.max_page = Math.ceil( parseInt(total)/parseInt(page_size));
		var start = 1;
		var end = max_page;
		var front_move = Math.ceil(parseInt(tag_count)*0.5)-1;
		var back_move = Math.ceil(parseInt(tag_count)*0.5);

		this.cur_page = parseInt(this.cur_page);
		// 最大页码大于1才显示分页组件
		if(max_page>1){
			this.is_shown = true;
		}else{
			this.is_shown = false;
		}
		// 置空
		this.page_items = [];
		start = this.cur_page-front_move;
		end = this.cur_page+back_move;

		if(start<1){
			start = 1;
		}
		var max_start = max_page-tag_count;
		if(start>max_start && max_start>0){
			start = max_start;
		}

		var min_end = tag_count;
		if(end<min_end){
			end = min_end;
		}
		if(end>max_page){
			end = max_page;
		}
		var i=start;
		while(i<=end){
			this.page_items.push({
				number: i
			});
			i++;
		}
	}
	return function (page_size, tag_count){
		this._generateUiData = generateUiData;
		this.total = 0;
		this.page_size = page_size || 10;
		this.tag_count = tag_count || 5;
		this.cur_page = 1;
		this.is_shown = false;
		this.max_page = 0;
		this.page_items = [];
		this.onSelected = function(number){
			// 自行重写此接口
		};
		this.setPage = function(number){
			if(number==this.cur_page){
				return false;
			}
			if(number<1){
				number = 1;
			}
			if(number>this.max_page){
				number = this.max_page;
			}
			
			this.cur_page = number;
			this._generateUiData();
			this.onSelected(number);
			
			// event.preventDefault();
		};
		this.setTotal = function(total){
			this.total = Number(total);
			this._generateUiData();
		};
		this.init = function () {
			this._generateUiData();
		};
	};
}]).directive('ktPager', ['KtPager', function (KtPager) {
	return {
		restrict: 'AE',
		// require: 'ngModel',
		templateUrl: 'templates/directives/kt_pager.html',
		scope: {
			pageModel: '=ktPager',
		},
		link: function(scope, element, attrs, ctrl) {
			if(!scope.pageModel){
				scope.pageModel = new KtPager();
			}
			scope.pageModel.init();
			// console.log(scope.KtPager);
		}
	};
}]);
/**
显示转成可编辑状态
USE: <div view-to-edit on-blur=""></div>
事件：on-blur 失去焦点时触发
*/
angular.module('SuMaiTong').directive('viewToEdit', ['$parse', '$timeout', function ($parse, $timeout) {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'templates/directives/view_to_edit.html',
		scope: {
			value: '=viewToEdit',
			onBlur: '&'
		},
		link: function(scope, element, attrs, ctrl) {
			var span = $(element).find('.view-to-edit-show');
			var input = $(element).find('input:first');
			scope.is_edit = false;

			span.click(function(){
				input.css({
					width: span.eq(0).width(),
					minWidth: 30
				});
				scope.$apply(function(){
					scope.is_edit=true;
				});
			});

			input.blur(function(){
				scope.$apply(function(){
					scope.is_edit=false;
					if(scope.onBlur){
						$timeout(function (argument) {
							scope.onBlur();
						},300);
					}
				});
			});
		}
	};
}]);

angular.module("SuMaiTong").filter("AliexpressProductLabel", ['AliexpressProductManage', '$sce', function(AliexpressProductManage, $sce) {
	var model = AliexpressProductManage;
	return function(person, sep) {
		var field = model.fields[person];
		return $sce.trustAsHtml(field.label+'(<span style="color:#999">'+person+'</span>)');
	};
}]);
angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/ali1688', '/ali1688/admin');
	$stateProvider.state('ali1688', {
		url: "/ali1688",
		views: {
			"container": { templateUrl: "templates/ali1688/layout.html" }
		}
	}).state('ali1688.gather', {
		url: "/gather",
		views: {
			"container": { templateUrl: "templates/ali1688/gather.html" }
		}
	}).state('ali1688.admin', {
		url: "/admin?page&subject&postCategryId",
		views: {
			"container": { templateUrl: "templates/ali1688/admin.html" }
		}
	});
}]);
angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/aliexpress', '/aliexpress/admin');
	$stateProvider.state('aliexpress', {
		url: "/aliexpress",
		views: {
			"container": { templateUrl: "templates/aliexpress/layout.html" }
		}
	}).state('aliexpress.admin', {
		url: "/admin?q",
		views: {
			"container": { templateUrl: "templates/aliexpress/admin.html" }
		}
	}).state('aliexpress.create', {
		url: "/create",
		views: {
			"container": { templateUrl: "templates/aliexpress/update.html" }
		}
	}).state('aliexpress.update', {
		url: "/update/:_id",
		views: {
			"container": { templateUrl: "templates/aliexpress/update.html" }
		}
	}).state('aliexpress.detail', {
		url: "/detail",
		views: {
			"container": { templateUrl: "templates/aliexpress/update.html" }
		}
	});
}]);
angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/category', '/category/admin');
	$stateProvider.state('category', {
		url: "/category",
		views: {
			"container": { templateUrl: "templates/category/category_layout.html" }
		}
	}).state('category.admin', {
		url: "/admin",
		views: {
			"container": { templateUrl: "templates/category/category_admin.html" }
		}
	}).state('category.attrconfig', {
		url: "/attrconfig/:cateId",
		views: {
			"container": { templateUrl: "templates/category/category_attr_config.html" }
		}
	});
}]);
angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/myproduct', '/myproduct/admin');
	$stateProvider.state('myproduct', {
		url: "/myproduct",
		views: {
			"container": { templateUrl: "templates/myproduct/layout.html" }
		}
	}).state('myproduct.admin', {
		url: "/admin?q",
		views: {
			"container": { templateUrl: "templates/myproduct/admin.html" }
		}
	}).state('myproduct.create', {
		url: "/create",
		views: {
			"container": { templateUrl: "templates/myproduct/update.html" }
		}
	}).state('myproduct.update', {
		url: "/update/:_id",
		views: {
			"container": { templateUrl: "templates/myproduct/update.html" }
		}
	}).state('myproduct.detail', {
		url: "/detail",
		views: {
			"container": { templateUrl: "templates/myproduct/update.html" }
		}
	});
}]);
angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/product', '/product/admin');
	$stateProvider.state('product', {
		url: "/product",
		views: {
			"container": { templateUrl: "templates/product/product_layout.html" }
		}
	}).state('product.admin', {
		url: "/admin?page&subject&postCategryId",
		views: {
			"container": { templateUrl: "templates/product/product_admin.html" }
		}
	}).state('product.create', {
		url: "/create",
		views: {
			"container": { templateUrl: "templates/product/product_update.html" }
		}
	}).state('product.update', {
		url: "/update/:_id",
		views: {
			"container": { templateUrl: "templates/product/product_update.html" }
		}
	}).state('product.detail', {
		url: "/detail",
		views: {
			"container": { templateUrl: "templates/product/product_update.html" }
		}
	});
}]);
angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('site', {
		url: "/site",
		views: {
			"container": { templateUrl: "templates/dashboard.html" }
		}
	});
}]);
angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('user', {
		url: "/user",
		views: {
			"appContainer": { templateUrl: "templates/layouts/user_layout.html" }
		}
	}).state('user.login', {
		url: "/login",
		views: {
			"container": { templateUrl: "templates/user_login.html" }
		}
	}).state('user.signup', {
		url: "/signup/:id",
		views: {
			"container": { templateUrl: "templates/user_signup.html" }
		}
	});
}]);
/**
	阿里巴巴登录验证管理
*/
angular.module('SuMaiTong').factory('AlibabaAuthManage', ['$timeout', '$http', function($timeout, $http) {
	var request_url = 'http://gw.open.1688.com/openapi/';
	var appKey = '1016528';
	var appSignature= 'f9AnShmLUKj';
	var redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';
	var site = 'china';// china|aliexpress
	var state = 'smt';
	var auth_scope = '';

	var gui = {};
	var login_Window = null;
	var username = window.localStorage.alibaba_username;
	var access_token = window.localStorage.alibaba_access_token;
	var memeber_id = window.localStorage.alibaba_memeber_id;
	var refresh_token_timeout = window.localStorage.alibaba_refresh_token_timeout;

	//生成签名
	function _appSignature(urlParam, secretPassphrase){
		var msg = "";
		var msgArray = [];
		var tmp = urlParam.split('&');
		for(var i=0;i<tmp.length;i++){
			var f = tmp[i].indexOf('=');
			if(f>0){
				msgArray.push(tmp[i].substring(0, f) + tmp[i].substr(f + 1));
			}else{
				msgArray.push(tmp[i]);
			}
		}
		msgArray.sort();
		msg += msgArray.join('');
		var hmacBytes = Crypto.HMAC(Crypto.SHA1, msg, secretPassphrase, { asBytes: true });
		var hmacString = Crypto.util.bytesToHex(hmacBytes);
		return [msg,hmacString.toUpperCase()];
	}
	// 获取访问令牌
	function getCode(){
		var url = 'http://gw.open.1688.com/auth/authorize.htm';
		var urlParam = "client_id=" + appKey +"&site=" + site + "&redirect_uri=" + redirect_uri;
		if(state.length > 0){
			urlParam += "&state=" + state;
		}
		if(auth_scope.length > 0){
			urlParam += "&scope=" + auth_scope;
		}
		var result = _appSignature(urlParam, appSignature);
		var signUrl = urlParam + "&_aop_signature=" + result[1];
		var deferred = Q.defer();
		login_Window = gui.Window.get( window.open(url+'?'+signUrl) );
		login_Window.on('loaded', function(){
			if(this.title.indexOf("code")>=0){
				var code = this.window.location.href.split('code=');
				if(code && code[1]){
					deferred.resolve(code[1]);
				}else{
					deferred.reject('验证失败');
				}
			}
		});
		return deferred.promise;
	}
	// 用令牌换TOKEN
	function getToken(code){
		var baseUrl = "https://gw.open.1688.com/openapi/http/1/system.oauth2/getToken/" + appKey;
		var data = {};
		data.client_id = appKey;
		data.redirect_uri= redirect_uri;
		data.code=code;
		data.client_secret=encodeURIComponent(appSignature);
		data.grant_type="authorization_code";
		data.need_refresh_token="true";
		return $http({
			url: baseUrl,
			data : $.param(data),
			method : "POST",
			responseType: "json",
			timeout : 8000
		}).then(function(res){
			console.log('getToken data:',res);
			login_Window.close();
			return res.data;
		});
	}
	
	// 授权验证过程
	function login(){
		if(typeof(access_token)=='string'){
			return Q.fcall(function(){
				return true;
			});
		}
		return getCode().then(function(code){
			return getToken(code);
		}).then(function(res){
			username = window.localStorage.alibaba_username = res.resource_owner;
			access_token = window.localStorage.alibaba_access_token = res.access_token;
			memeber_id = window.localStorage.alibaba_memeber_id = res.memberId;
			refresh_token_timeout = window.localStorage.alibaba_refresh_token_timeout = res.refresh_token_timeout;
			return true;
		});
	}
	//清除本地登录信息
	function clear(){
		window.localStorage.removeItem(alibaba_username);
		window.localStorage.removeItem(alibaba_access_token);
		window.localStorage.removeItem(alibaba_memeber_id);
		window.localStorage.removeItem(alibaba_refresh_token_timeout);
	}

	// 生成API访问签名
	function _apiSignature(api_name, data){
		var request_path = 'param2/1/cn.alibaba.open/'+api_name+'/'+appKey;
		var msg = request_path;
		var msgArray = [];
		for( var k in data ){
			if(data[k]){
				msgArray.push( String(k)+data[k]);
			}
		}
		msgArray.sort();
		msg += msgArray.join("");
		var hmacBytes = Crypto.HMAC(Crypto.SHA1, msg, appSignature, { asBytes: true });
		var hmacString = Crypto.util.bytesToHex(hmacBytes);
		var sign = [msg,hmacString.toUpperCase()];
		// console.log('sign:',msgArray, sign);
		return sign;
	}

	// 阿里巴巴专用请求
	function http(params){
		var request_path = 'param2/1/cn.alibaba.open/'+params.api_name+'/'+appKey;
		var url = request_url+request_path;
		if(params.data){
			params.data['access_token'] = access_token;
			var sign = _apiSignature(params.api_name, params.data);
			params.data['_aop_signature'] = sign[1];
		}else{
			params.params['access_token'] = access_token;
			var sign = _apiSignature(params.api_name, params.params);
			params.params['_aop_signature'] = sign[1];
		}
		return $http({
			method: params.method||'GET',
			url: url,
			params : params.params||null,
			data: params.data||null
		});
	}

	// login();
	return {
		appKey: appKey,
		request_url: request_url,
		getCode: getCode,
		getToken: getToken, 
		login: login, 
		clear: clear,
		username: username,
		access_token: access_token,
		memeber_id: memeber_id, 
		_apiSignature: _apiSignature,
		http: http
	};
}]);
// AlibabaProductManage
/**
	阿里巴巴分类管理
*/
angular.module('SuMaiTong').factory('AlibabaCateManage', ['$q', 'AlibabaAuthManage', function($q, AlibabaAuthManage) {
	var manage = {};
	var store = DB.objectStore('alibaba_category');
	manage.store = store;
	var fields = {
		catsId              : {label:'分类ID'},
		catsName            : {label:'类目名称'},
		catsDescription     : {label:'类目说明', type:'String'},
		isLeaf              : {label:'是否叶子类目'},
		tradeType           : {label:'贸易类型'},
		parentCats          : {label:'父类目信息'},
		applySPU            : {label:'是否支持SPU'},
		isSupportOnlineTrade: {label: '是否支持网上订购'},
		isSupportSKUPrice   : {label: '是否支持SKU报价'},
		supportMixWholesale : {label: '是否支持混批'},
		path                : {label:'路径'},
		aliexpress_cate_id  : {label: '对应SMT分类ID'}
	};

	// 通过分类ID获取子类目
	function gatherCategorysByCid(cid){
		var data = {
			getAllChildren: 'T',
			parentCategoryID: cid
		};
		return AlibabaAuthManage.http({
			method: 'GET',
			api_name: 'category.getCatListByParentId',
			params : data
		}).then(function(res){
			return res.data.result;
		});
	}
	
	// 通过分类ID获取类目路径
	function gatherCategoryPathByCid(cid){
		var data = {
			categoryID: cid
		};
		return AlibabaAuthManage.http({
			method: 'GET',
			api_name: 'category.getCatePath',
			params : data
		}).then(function(res){
			var data = res.data.result, path=[], obj={}, len, defer = $q.defer();
			len = data.toReturn.length;
			$.each(data.toReturn, function (i, item) {
				path.push(item.catsName);
			});
			obj = data.toReturn[len-1];
			obj.path = path.join(' / ');
			obj.isLeaf = obj.leaf;

			store.add(obj).then(function(res){
				defer.resolve(res);
			}).fail(function(e,err){
				defer.reject(err);
			});
			return defer.promise;
		});
	}
	manage.gatherCategoryPathByCid = gatherCategoryPathByCid;

	/**
	 * 通过分类ID获取类目产品属性
	 */
	manage.gatherCateAttrsByCid = function(cid){
		var data = {
			categoryID: cid
		};
		return AlibabaAuthManage.http({
			method: 'GET',
			api_name: 'productAttributes.get',
			params : data
		}).then(function(res){
			return res.data.result.toReturn;
		});
	};

	manage.findAll = function(){
		var defer = $q.defer(), datas=[];
		store.each(function(item){
			datas.push(item.value);
		}, null, 'prev').then(function(res){
			defer.resolve(datas);
		}).fail(function(e, err){
			defer.reject(err);
		});
		return defer.promise;
	};

	/**
	 * 从产品中提取出所有的阿里巴巴分类ID
	 */
	manage.extractByProducts = function(){
		var defer = $q.defer(), gathers=[], pstore=DB.objectStore('my_product');
		pstore.index('alibaba_postCategryId_idx').each(function(item){
			store.index('catsId').get(item.value.alibaba.postCategryId)
			.then(function(res){
				if(typeof(res)=='undefined'){
					var gather = gatherCategoryPathByCid(item.value.alibaba.postCategryId);
					gathers.push(gather);
				}
			}).fail(function(e, err){
				console.log(err);
			});
		}).then(function(res){
			return $q.all(gathers);
		}).then(function(res){
			defer.resolve(res);
		}).fail(function(e, err){
			defer.reject(err);
		});
		return defer.promise;
	};

	/**
	 * 根据阿里巴巴ID取速卖通分类ID
	 */
	manage.getAliexpressIdByCatsId = function(catsId){
		var defer = $q.defer();
		store.index('catsId').get(catsId).then(function(res){
			defer.resolve(res.aliexpress_cate_id);
		}).fail(function(e, err){
			defer.reject(err);
		});
		return defer.promise;
	};

	return manage;
}]);
// AlibabaProductManage
/**
	阿里巴巴产品管理
*/
angular.module('SuMaiTong').factory('AlibabaProductManage', ['$q', 'AlibabaAuthManage', function($q, AlibabaAuthManage) {
	var model = {};
	var fields = {
		skuPics                  :	['List'                ,	'否',	'SKU图片'],
		isPrivateOffer           :	['Boolean'             ,	'否',	'是否有私密信息'],
		isPriceAuthOffer         :	['Boolean'             ,	'否',	'是否价格私密'],
		isPicAuthOffer           :	['Boolean'             ,	'否',	'是否图片私密'],
		offerId                  :	['long'                ,	'否',	'商品ID'],
		isPrivate                :	['Boolean'             ,	'否',	'是否为私密offer的标志位。true：私密产品 false：普通产品'],
		detailsUrl               :	['String'              ,	'否',	'商品详情地址'],
		type                     :	['String'              ,	'否',	'商品类型。Sale：供应信息，Buy：求购信息'],
		tradeType                :	['Integer'             ,	'否',	'贸易类型。1：产品，2：加工，3：代理，4：合作，5：商务服务'],
		postCategryId            :	['Integer'             ,	'否',	'所属叶子类目ID'],
		offerStatus              :	['String'              ,	'是',	'状态。auditing：审核中；online：已上网；FailAudited：审核未通过；outdated：已过期；member delete(d)：用户删除；delete：审核删除'],
		memberId                 :	['String'              ,	'否',	'卖家会员ID'],
		subject                  :	['String'              ,	'否',	'商品标题'],
		details                  :	['String'              ,	'否',	'详情说明'],
		qualityLevel             :	['String'              ,	'否',	'商品信息质量星级( 取值为1到5)。1：一星；2：二星；3：三星；4：四星；5：五星'],
		imageList                :	['offerImageInfo[]'    ,	'否',	'商品图片列表'],
		productFeatureList       :	['productFeatureInfo[]',	'否',	'商品属性信息'],
		isOfferSupportOnlineTrade:	['Boolean'             ,	'否',	'是否支持网上交易。首先需要类目支持，如果类目支持，需要有价格，供货总量，最小起订量。true：支持网上订购；false：不支持网上订购'],
		tradingType              :	['String'              ,	'否',	'支持的交易方式。当isOfferSupportOnlineTrade为true的时候本字段有效：Escrow:支付宝担保交易； PreCharge：支付宝预存款交易；ForexPay：支付宝境外支付交易；多种交易方式间通过;分隔。'],
		isSupportMix             :	['Boolean'             ,	'否',	'是否支持混批。true：支持混批；false：不支持混批'],
		unit                     :	['String'              ,	'否',	'计量单位'],
		priceUnit                :	['String'              ,	'否',	'交易币种'],
		amount                   :	['Integer'             ,	'否',	'供货量'],
		amountOnSale             :	['Integer'             ,	'否',	'可售数量'],
		saledCount               :	['Integer'             ,	'否',	'已销售量'],
		retailPrice              :	['double'              ,	'否',	'建议零售价'],
		unitPrice                :	['double'              ,	'否',	'单价'],
		priceRanges              :	['priceRangeInfo[]'    ,	'否',	'价格区间'],
		termOfferProcess         :	['Integer'             ,	'否',	'有效期(单位：天)'],
		freightTemplateId        :	['Integer'             ,	'否',	'物流模板id'],
		sendGoodsId              :	['Integer'             ,	'否',	'发货地址id'],
		productUnitWeight        :	['Integer'             ,	'否',	'单位重量'],
		freightType              :	['Integer'             ,	'否',	'T:运费模板 D：运费说明 F：卖家承担运费'],
		isSkuOffer               :	['Boolean'             ,	'否',	'是否为SKU商品'],
		isSkuTradeSupported      :	['Boolean'             ,	'否',	'是否支持按照规格报价'],
		skuArray                 :	['Map'                 ,	'否',	'SKU规格属性信息{fid:value}当有多个值时用"#"联接'],
		gmtCreate                :	['String'              ,	'是',	'创建日期'],
		gmtModified              :	['String'              ,	'是',	'最近修改时间'],
		gmtLastRepost            :	['String'              ,	'是',	'最近重发时间'],
		gmtApproved              :	['String'              ,	'是',	'审核通过时间'],
		gmtExpire                :	['String'              ,	'是',	'过期日期']
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
	function gatherProductById(id){
		var data = {
			offerId: id,
			returnFields: (keys).join(',')
		};

		return AlibabaAuthManage.http({
			method: 'GET',
			api_name: 'offer.get',
			params : data
		}).then(function(res){
			return res.data.result.toReturn[0];
		});
	}

	// 搜索产品数据
	function gatherProductListBySearch(params){
		var _params = {
			pageNo: 1,
			returnFields: null,
			pageSize: 50, //最大50
			orderBy: null,
			offerId: null,
			q: null,
			isTradeOffer: null,
			category: null,
			gmtModifiedBegin: null,
			gmtModifiedEnd: null,
			address: null,
			memberId: null,
			tpType: null,
			tpYear: null,
			creditMoney: null,
			tradeType: null,
			soldQuantity: null,
			showType: null,
			bizType: null,
			province: null,
			city: null,
			price: null,
			qualityLevel: null,
			quantityBegin: null,
			online: null,
			groupIds: null,
			status: null,
			other: null
		};
		for( var k in _params ){
			if(!params[k]){
				params[k] = _params[k];
			}
		}
		return AlibabaAuthManage.http({
			method: 'GET',
			api_name: 'offer.search',
			params : params
		}).then(function(res){
			return res.data.result;
		});
	}
	// 获取当前登录会员的购物订单列表
	function getAllOrders(params){
		params = params||{};
		return AlibabaAuthManage.http({
			method: 'GET',
			api_name: 'trade.order.orderList.get',
			params : {
				buyerMemberId: window.localStorage.alibaba_memeber_id,
				pageNO: params.pageNO||1,
				pageSize: 20
			}
		}).then(function(res){
			return res.data.result;
		});
	}
	// 已买到的宝贝ID列表
	function getBuyProductIds(){
		var ids = [];
		return getAllOrders().then(function(res){
			angular.forEach(res.toReturn, function(v){
				angular.forEach(v.orderEntries, function(item){
					ids.push(item.sourceId);
				});
			});
			return _.uniq(ids);
		});
	}
	
	model.fields = fields;
	model.keys = keys;
	model.gatherProductById = gatherProductById;
	model.gatherProductListBySearch = gatherProductListBySearch;
	model.getAllOrders = getAllOrders;
	model.getBuyProductIds = getBuyProductIds;
	return model;
}]);
/**
	速卖通登录验证管理
*/
angular.module('SuMaiTong').factory('AliexpressAuthManage', ['$timeout', '$http', function($timeout, $http) {
	var request_url = 'http://gw.api.alibaba.com/openapi/';
	var appKey = '3647787';
	var appSignature= 'jKMnbD3gs7B';
	var redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';
	var site = 'aliexpress';// china|aliexpress
	var state = 'smt';
	var auth_scope = '';

	// var gui = require('nw.gui');
	var login_Window = null;
	var username = window.localStorage.aliexpress_username;
	var access_token = window.localStorage.aliexpress_access_token;
	var memeber_id = window.localStorage.aliexpress_memeber_id;
	var refresh_token_timeout = window.localStorage.aliexpress_refresh_token_timeout;

	//生成签名
	function _appSignature(urlParam, secretPassphrase){
		var msg = "";
		var msgArray = [];
		var tmp = urlParam.split('&');
		for(var i=0;i<tmp.length;i++){
			var f = tmp[i].indexOf('=');
			if(f>0){
				msgArray.push(tmp[i].substring(0, f) + tmp[i].substr(f + 1));
			}else{
				msgArray.push(tmp[i]);
			}
		}
		msgArray.sort();
		msg += msgArray.join('');
		var hmacBytes = Crypto.HMAC(Crypto.SHA1, msg, secretPassphrase, { asBytes: true });
		var hmacString = Crypto.util.bytesToHex(hmacBytes);
		return [msg,hmacString.toUpperCase()];
	}
	// 获取访问令牌
	function getCode(){
		var url = 'http://gw.api.alibaba.com/auth/authorize.htm';
		var urlParam = "client_id=" + appKey +"&site=" + site + "&redirect_uri=" + redirect_uri;
		if(state.length > 0){
			urlParam += "&state=" + state;
		}
		if(auth_scope.length > 0){
			urlParam += "&scope=" + auth_scope;
		}
		var result = _appSignature(urlParam, appSignature);
		var signUrl = urlParam + "&_aop_signature=" + result[1];
		var deferred = Q.defer();
		login_Window = gui.Window.get( window.open(url+'?'+signUrl) );
		login_Window.on('loaded', function(){
			if(this.title.indexOf("code")>=0){
				var code = this.window.location.href.split('code=');
				if(code && code[1]){
					deferred.resolve(code[1]);
				}else{
					deferred.reject('验证失败');
				}
			}
		});
		return deferred.promise;
	}
	// 用令牌换TOKEN
	function getToken(code){
		var baseUrl = "https://gw.api.alibaba.com/openapi/http/1/system.oauth2/getToken/" + appKey;
		var data = {};
		data.client_id = appKey;
		data.redirect_uri= redirect_uri;
		data.code=code;
		data.client_secret=encodeURIComponent(appSignature);
		data.grant_type="authorization_code";
		data.need_refresh_token="true";
		return $http({
			url: baseUrl,
			data : $.param(data),
			method : "POST",
			responseType: "json",
			timeout : 8000
		}).then(function(res){
			console.log('getToken data:',res);
			login_Window.close();
			return res.data;
		});
	}
	
	// 授权验证过程
	function login(){
		if(typeof(access_token)=='string'){
			return Q.fcall(function(){
				return true;
			});
		}
		return getCode().then(function(code){
			return getToken(code);
		}).then(function(res){
			username = window.localStorage.aliexpress_username = res.resource_owner;
			access_token = window.localStorage.aliexpress_access_token = res.access_token;
			memeber_id = window.localStorage.aliexpress_memeber_id = res.memberId;
			refresh_token_timeout = window.localStorage.aliexpress_refresh_token_timeout = res.refresh_token_timeout;
			return true;
		});
	}
	//清除本地登录信息
	function clear(){
		window.localStorage.removeItem('aliexpress_username');
		window.localStorage.removeItem('aliexpress_access_token');
		window.localStorage.removeItem('aliexpress_memeber_id');
		window.localStorage.removeItem('aliexpress_refresh_token_timeout');
	}

	// 生成API访问签名
	function _apiSignature(api_name, data){
		var request_path = 'param2/1/aliexpress.open/'+api_name+'/'+appKey;
		var msg = request_path;
		var msgArray = [];
		var data_str = $.param(data);
		var tmp = data_str.split('&');
		for(var i=0;i<tmp.length;i++){
			var f = tmp[i].indexOf('=');
			if(f>0){
				msgArray.push(tmp[i].substring(0, f) + tmp[i].substr(f + 1));
			}else{
				msgArray.push(tmp[i]);
			}
		}
		/**
		for( var k in data ){
			// console.log(k,data[k]);
			if(data[k]){
				msgArray.push( String(k)+data[k]);
			}
		}
		*/
		msgArray.sort();
		msg += msgArray.join("");
		var hmacBytes = Crypto.HMAC(Crypto.SHA1, msg, appSignature, { asBytes: true });
		var hmacString = Crypto.util.bytesToHex(hmacBytes);
		var sign = [msg,hmacString.toUpperCase()];
		// console.log('sign:',msgArray, sign);
		return sign[1];
	}

	// 速卖通专用请求
	function http(params){
		var sign, request_path = 'param2/1/aliexpress.open/'+params.api_name+'/'+appKey;
		var url = request_url+request_path;
		if(params.data){
			params.data['access_token'] = access_token;
			// params.data['_aop_signature'] = sign;//POST数据时不需要签名
			params.data = $.param(params.data);
		}else{
			params.params['access_token'] = access_token;
			sign = _apiSignature(params.api_name, params.params);
			params.params['_aop_signature'] = sign;
		}
		return $http({
			method: params.method||'GET',
			url: url,
			params : params.params||null,
			data: params.data||null
		});
	}

	// login();
	return {
		appKey: appKey,
		request_url: request_url,
		getCode: getCode,
		getToken: getToken,
		login: login,
		clear: clear,
		username: username,
		access_token: access_token,
		memeber_id: memeber_id,
		http: http
	};
}]);
// AliexpressCateManage
/**
	速卖通类目管理
*/
angular.module('SuMaiTong').factory('AliexpressCateManage', ['$timeout','$rootScope', '$q', 'AliexpressAuthManage', function($timeout, $rootScope, $q, AliexpressAuthManage) {
	var model = {};
	var store = DB.objectStore('aliexpress_category');
	var cache = DB.objectStore('cache_data');
	var fields = {
		id    : {label: 'ID'},
		isleaf: {label: '是否是叶子类目', type: 'Boolean'},
		level : {label: '类目层级', type: 'int'}, //顶层为0
		names : {label: '类目名称', type: 'Object'},
		parent_id: {label: '父类ID'}
	};

	model.sync_progress = [];//用于显示同步进度

	function getKeys(){
		var res=[];
		for (var k in fields){
			res.push(k);
		}
		return res;
	}

	// 获取一级类目列表
	function gatherTopCategorys(){
		return gatherChildrenPostCategoryById(0);
	}

	// 获取类目下的子类目列表
	function gatherChildrenPostCategoryById(cateId){
		return AliexpressAuthManage.http({
			method: 'GET',
			api_name: 'api.getChildrenPostCategoryById',
			params : {cateId: cateId}
		}).then(function(res){
			var list = res.data.aeopPostCategoryList;
			return list;
		});
	}

	// 通过ID类目属性
	function gatherAttributesResultByCateId(cateId){
		return AliexpressAuthManage.http({
			method: 'GET',
			api_name: 'api.getAttributesResultByCateId',
			params : {cateId: cateId}
		}).then(function(res){
			return res.data.attributes;
		});
	}

	// 所有分类数据与结构
	function getAllDatasByAli(){
		var counter = 0, success_counter = 0, deferred = $q.defer(), datas = [];
		// 递归获取数据
		function recursion(cid){
			counter++;
			return gatherChildrenPostCategoryById(cid)
			.then(function(res){
				var list = res;
				angular.forEach(list, function(v, i){
					v.parent_id = cid||0;
					if(v.isleaf===false){
						v.recursion = function(){
							return recursion( v.id )
							.then(function(res){
								v.childs = res;
								v.recursion = null;
							});
						};
						v.recursion();
					}
				});
				successReturn();
				return list;
			}).catch(function(err){
				deferred.reject(err);
			});
		}
		// 处理判断是否全部请求完成
		function successReturn(){
			success_counter++;
			model.sync_progress = ['internet',success_counter,counter];
			if(counter==success_counter){
				$timeout(function(){
					deferred.resolve(datas);
				},500);
			}
		}
		datas = recursion(0);
		return deferred.promise.then(function(res){
			cache.delete('aliexpress_categorys').then(function(){
				return cache.add(res, 'aliexpress_categorys');
			}).fail(function(e,err){
				console.log(err);
			});
			return res;
		});
	}

	// 递归将完整线上数据插入本地数据库,目前看到的总记录数是4495
	function recursionInsert(res){
		var counter = 0, success_counter = 0, deferred = $q.defer(), datas = [];
		function recursion(res){
			angular.forEach(res, function(v, i){
				counter++;
				var data = {};
				for(var k in fields){
					data[k] = v[k]||null;
					data.isleaf = Number(v.isleaf||null);
				}
				if( v.isleaf === false ){
					recursion(v.childs);
				}
				return store.add(data).then(function(e){
					successReturn();
				}).fail(function(err){
					deferred.reject(err);
				});
			});
		}
		function successReturn(){
			success_counter++;
			model.sync_progress = ['inser',success_counter,counter];
			if(counter==success_counter){
				deferred.resolve(datas);
			}
			console.log(model.sync_progress);
		}
		recursion(res);
		return deferred.promise;
	}
	// 同步线上数据到本地
	function syncCategoryDatas() {
		var defer = $q.defer();
		store.clear().then(function(){
			defer.resolve(true);
		}).fail(function(e, err){
			defer.reject(err);
		});
		return defer.promise.then(function(){
			return getAllDatasByAli();
		}).then(function(res){
			return recursionInsert(res);
		}).then(function(res){
			console.log('同步完成');
			return res;
		});
	}
	// 同步分类属性
	function syncCategoryAttributes(){
		var reqs = [], counter=0, success_counter=0,defer = $q.defer();
		store.each(function(item){
			if(item.value.isleaf){
				counter++;
				model.sync_progress = ['同步属性', success_counter, counter];
				var req = gatherAttributesResultByCateId(item.value.id)
				.then(function(attrs){
					item.value.attributes = attrs;
					return store.put(item.value);
				}).then(function(res){
					success_counter++;
					model.sync_progress = ['同步属性', success_counter,counter];
					if(counter==success_counter){
						console.log(counter,success_counter);
						defer.resolve(true);
					}
					return res;
				}).catch(function(m, err){
					defer.reject(err);
				});
			}
		});
		return defer.promise.then(function(res){
			console.log('同步完成',res);
			model.sync_progress = ['同步属性完成', success_counter,counter];
			return res;
		}).catch(function(e, err){
			throw err;
		});
	}
	/**
	 * SKU与属性分离
	 */
	function separateSkusAttrs(){
		var defer = $q.defer(), sas = [];
		store.index('isleaf_idx').each(function(item){
			item.value.skus = [];
			item.value.attrs = [];
			item.value.attributes.filter(function(attr) {
				if(attr.sku===true && attr.spec==1){
					item.value.skus[0] = attr;
				}else if(attr.sku===true && attr.spec==2){
					item.value.skus[1] = attr;
				}if(attr.sku===true && attr.spec==3){
					item.value.skus[2] = attr;
				}else{
					item.value.attrs.push(attr);
				}
			});
			sas.push(item.update(item.value));
		},1).then(function(res){
			console.log('........');
			return $q.all(sas);
		}).then(function(){
			defer.resolve(true);
		}).fail(function(e,err){
			defer.reject(err);
		});
		return defer.promise;
	}
	// separateSkusAttrs();

	/**
	 * 采集的产品分类属性配置信息
	 */
	function getCatesAttrsConfig(aliexpress_cate_id){
		var datas=[];
		var promise = DB.objectStore('aliexpress_category_configs').get(Number(aliexpress_cate_id))
		.then(function(cate){
			if(!cate){
				cate = {};
			}
			return DB.objectStore('my_product').index('aliexpress_categoryId_idx')
			.each(function(item){
				datas = datas.concat(item.value.alibaba.productFeatureList);
			}, Number(aliexpress_cate_id)).then(function(res){
				angular.forEach(datas, function(item, i){
					var k=String(item.fid);
					if(typeof(cate[k])=='undefined'){
						cate[k] = item;
					}else{
						cate[k].values = _.uniq(cate[k].values.concat(item.values));
					}
				});
				return cate;
			});
		}).then(function(res){
			return res;
		}).fail(function(err){
			return err;
		});
		return $q.when(promise);
	}
	// getCatesAttrsConfig(200000298);
	
	/**
	 * 从本地获取分类
	 */
	function getCateByCateId(cateId){
		var defer = $q.defer();
		store.index('id').get(Number(cateId)).then(function(item){
			defer.resolve(item);
		}).fail(function(e, err){
			console.log(err);
			defer.reject(err);
		});
		return defer.promise;
	}

	/**
	 * 从缓存池获取分类结构
	 */
	function getCategroysByCache(){
		var defer = $q.defer(), cates=[];
		cache.get('aliexpress_categorys').then(function(res){
			defer.resolve(res);
		}).fail(function(e, err){
			defer.reject(err);
		});
		return defer.promise;
	}

	model.store = store;
	model.fields = fields;
	model.keys = getKeys();
	model.gatherTopCategorys = gatherTopCategorys;
	model.gatherChildrenPostCategoryById = gatherChildrenPostCategoryById;
	model.gatherAttributesResultByCateId = gatherAttributesResultByCateId;
	model.syncCategoryDatas = syncCategoryDatas;
	model.syncCategoryAttributes = syncCategoryAttributes;
	model.separateSkusAttrs = separateSkusAttrs;
	model.getCateByCateId = getCateByCateId;
	model.getCategroysByCache = getCategroysByCache;
	model.getCatesAttrsConfig = getCatesAttrsConfig;
	return model;
}]);
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
// MyProductModel
/**
	产品管理
*/
angular.module('SuMaiTong').factory('MyProductManage', ['$q', 'AlibabaProductManage', 'AliexpressProductManage',
	'AlibabaCateManage', 'AliexpressCateManage',
function($q, AlibabaProductManage, AliexpressProductManage, AlibabaCateManage, AliexpressCateManage) {
	var store = DB.objectStore('my_product');
	var manage = {};
	var YoudaoFanyi = {};
	manage.fields = {
		alibaba: {
			type: 'object',
			label: '原始数据'
		},
		aliexpress: {
			type: 'object',
			label: '生成原始SMT的数据'
		},
		aliexpress_zh: {
			type: 'object',
			label: '使用的中文数据'
		},
		aliexpress_en: {
			type: 'object',
			label: '使用的英文数据'
		}
	};
	manage.store = store;
	
	manage.save = function(data){
		return $q.when(store.put(data));
	};
	
	// 通过主键载入产品数据到当前模型
	manage.loadByPk = function(pk){
		return $q.when(store.get(pk));
	};

	// 通过阿巴巴产品ID载入产品数据到当前模型,不存在则自动采集下来
	manage.loadByAlibabaPid = function(pid){
		return $q.when(store.index('alibaba_offerId_idx').get(pid)).then(function(res){
			if(res){
				return res;
			}
			return AlibabaProductManage.gatherProductById(pid);
		}).then(function(res){
			var data = {alibaba: res};
			return data;
		});
	};
	// 通过阿巴巴产品URL载入产品数据到当前模型
	manage.loadByAlibabaPUrl = function(purl){
		var defer = $q.defer();
		var res = purl.match(/offer\/([\d]*).*/);
		if(!res || !res[1]){
			defer.reject('网址错误');
			return defer.promise;
		}
		return manage.loadByAlibabaPid(res[1]);
	};

	// 通过阿里巴巴订单列表
	manage.gatherProductByOrders = function(){
		var reqs = [];
		return AlibabaProductManage.getBuyProductIds().then(function(ids){
			angular.forEach(ids, function(id){
				var req = manage.loadByAlibabaPid(id).then(function(data){
					manage.save(data);
				});
				reqs.push(req);
			});
			return $q.all(reqs);
		});
	};
	
	manage.findAll = function(){
		var defer = $q.defer(), datas=[];
		store.each(function(item){
			datas.push(item.value);
		}, null, 'prev').then(function(res){
			defer.resolve(datas);
		}).fail(function(e, err){
			defer.reject(err);
		});
		return defer.promise;
	};
	// 通过重量与人民币成本生成美元价格
	function _createPrice(weight, cost){
		var $cost = Number(cost);//成本
		var weightcost = Number(weight)*1.5*85;//重量成本，每公斤85元平邮.
		var price = ($cost+weightcost)/6.15;
		// console.log($cost, weight, weightcost, price);
		if(price<0.7){
			return 0.99;
		}else if(price<1.2){
			return 1.59;
		}else if(price<1.2){
			return 1.59;
		}else if(price<1.6){
			return 1.99;
		}else if(price<1.9){
			return 2.49;
		}else if(price<2.3){
			return 2.99;
		}else if(price<2.8){
			return 3.89;
		}else{
			return price+2.5;
		}
	}

	// 数据复制到SMT
	function _alibabaCopyToAliexpress(alibaba){
		var data = new AliexpressProductManage.Model(), defer = $q.defer();
		data.detail = alibaba.details;
		data.subject = alibaba.subject;
		data.keyword = alibaba.subject;
		
		data.productPrice = _createPrice(alibaba.productUnitWeight, Number(alibaba.priceRanges[0].price));
		if(alibaba.productUnitWeight<0.2){
			data.freightTemplateId = 701731738;
			data.packageLength = 1;
			data.packageWidth = 1;
			data.packageHeight = 1;
		}else{
			data.freightTemplateId = 700077439;
			data.packageLength = 10;
			data.packageWidth = 10;
			data.packageHeight = 10;
		}
		data.grossWeight = alibaba.productUnitWeight;
		data.productUnit = AliexpressProductManage.alibabaUnitMap[alibaba.unit]||100000015;

		data.imageURLs = [];
		alibaba.imageList.filter(function(item){
			data.imageURLs.push(item.originalImageURI);
		});
		// data.imageURLs.join(';');

		// 设置属性
		data.aeopAeProductPropertys = [];

		// 设置分类
		return AlibabaCateManage.getAliexpressIdByCatsId(alibaba.postCategryId).then(function(aliexpress_cate_id){
			data.categoryId = aliexpress_cate_id;
			return AliexpressCateManage.getCateByCateId(aliexpress_cate_id);
		}).then(function(cate){
			// 设置SKU
			var reqs=[];
			data.aeopAeProductSKUs = [];
			if(alibaba.isSkuOffer){
				var pics = [];
				alibaba.skuArray.filter(function(item, i){
					if(!cate.skus[0].values[i]){
						return true;
					}
					var sku = AliexpressProductManage.SkuModel();
					item.price = Number(item.price)>0?item.price:alibaba.priceRanges[0].price;
					sku.skuPrice = String(_createPrice(alibaba.productUnitWeight, item.price));
					sku.aeopSKUProperty[0].propertyValueId = cate.skus[0].values[i].id;
					sku.aeopSKUProperty[0].skuPropertyId = cate.skus[0].id;
					sku.aeopSKUProperty[0].propertyValueDefinitionName = item.value;
					// SKU图片处理
					if(alibaba.skuPics && alibaba.skuPics[item.fid]){
						alibaba.skuPics[item.fid].filter(function(imgO){
							for(var k in imgO){
								pics[k] = 'http://img.china.alibaba.com/'+imgO[k];
							}
						});
						item.pic = pics[item.value];
						sku.aeopSKUProperty[0].skuImage = item.pic;
					}
					data.aeopAeProductSKUs.push(sku);
				});
			}
			return $q.all(reqs).then(function(){
				return data;
			});
		});
	}

	/**
	 * 指定产品转换为速卖通产品
	 * @param product_data: 产品信息
	 */
	manage.alibabaCopyToAliexpress = function(product_data){
		return $q.when().then(function(){
			return _alibabaCopyToAliexpress(product_data.alibaba);
		}).then(function(aliexpress_data){
			product_data.aliexpress = aliexpress_data;
			return $q.when(store.put(product_data));
		}).then(function(res){
			return product_data;
		});
	};

	/**
	 * 设置分类属性
	 * 注意：必须先把采集原数据转换为SMT数据
	 */
	manage.setProductsAttrs = function(product_data){
		var tmp = [];//临时记录属性是否已存在
		return $q.when().then(function(){
			return AliexpressCateManage.getCatesAttrsConfig(product_data.aliexpress.categoryId);
		}).then(function(configs){
			product_data.aliexpress.aeopAeProductPropertys = [];
			product_data.alibaba.productFeatureList.filter(function(item){
				var conf = configs[item.fid];
				if(conf && conf.ref_cate_id===0){//无效属性

				}else if(conf && conf.ref_cate_id===null){//自定义属性
					product_data.aliexpress.aeopAeProductPropertys.push({
						attrName: item.name,
						attrValue: item.value
					});
				}else if(conf && conf.ref_cate_id>0){//有效属性
					var data = {};
					var value_id = conf.ref[item.value];
					// 如果有单位
					if(conf.ref_cate && conf.ref_cate.units){
						var pattr = value_id.match(/[\d]+/gi)||[];
						value_id = pattr[0]+' '+conf.ref_cate.units[0].unitName;
					}
					// console.log(conf.ref_cate.inputType, value_id, conf);
					// name和value必须同时存在
					if(value_id){
						data.attrNameId = conf.ref_cate_id;
						if(conf.attributeShowTypeValue=='input'){
							data.attrValue = value_id;
						}else{
							data.attrValueId = value_id;
						}
					}
					
					var tmp_key;
					if(conf.attributeShowTypeValue=='checkbox'){
						tmp_key = conf.ref_cate_id+'|'+value_id;
					}else{
						tmp_key = conf.ref_cate_id;
					}
					// console.log(conf.attributeShowTypeValue, tmp, tmp_key, _.indexOf(tmp, tmp_key));
					if(_.indexOf(tmp, tmp_key)<0 && value_id){
						tmp.push(tmp_key);
						product_data.aliexpress.aeopAeProductPropertys.push(data);
					}
				}
			});
			
			return $q.when(store.put(product_data));
		}).then(function(){
			return product_data;
		});
	};
	/**
	 * 复制到中文数据
	 */
	manage.copyToAliexpressZh = function(product_data){
		return $q.when().then(function(){
			product_data.aliexpress_zh = angular.copy(product_data.aliexpress);
			return $q.when(store.put(product_data));
		}).then(function(res){
			return product_data;
		});
	};

	/**
	 * 正则提取内容正文，去除多余内容
	 */
	manage.regularTakeContent = function (detail, start, end){
		var patt = new RegExp(start+"[\\s\\S]*"+end);
		var res = detail.match(patt)||[];
		return res[0]||detail;
	};
	/**
	 * 翻译内容成英文
	 */
	manage.fanyiProductDetail = function(detail){
		var result, words=[];
		return $q.when().then(function(){
			var patt = new RegExp(/([\u4E00-\u9FA5]+)/gi);
			while ((result = patt.exec(detail)) !== null) {
				words.push(result[1]);
			}
			words = _.uniq(words);
			return words;
		}).then(function(words){
			return YoudaoFanyi.yi(words.join(','));
		}).then(function(res){
			var fys = res.split(',');
			angular.forEach(words, function(word, i){
				var patt =new RegExp(word, 'g');
				detail = detail.replace(patt, fys[i]);
			});
			return detail;
		});
	};
	/**
	 * 翻译产品到英文数据
	 */
	manage.fanyiProduct = function(product_data){
		var aliexpress_zh = angular.copy(product_data.aliexpress_zh);
		return $q.when().then(function(){
			product_data.aliexpress_en = aliexpress_zh;
			return YoudaoFanyi.yi(aliexpress_zh.subject).then(function(word){
				product_data.aliexpress_en.subject = word;
			});
		}).then(function(){
			return YoudaoFanyi.yi(aliexpress_zh.keyword).then(function(word){
				product_data.aliexpress_en.keyword = word;
			});
		}).then(function(){
			if(!aliexpress_zh.productMoreKeywords1){
				return true;
			}
			return YoudaoFanyi.yi(aliexpress_zh.productMoreKeywords1).then(function(word){
				product_data.aliexpress_en.productMoreKeywords1 = word;
			});
		}).then(function(){
			if(!aliexpress_zh.productMoreKeywords2){
				return true;
			}
			return YoudaoFanyi.yi(aliexpress_zh.productMoreKeywords2).then(function(word){
				product_data.aliexpress_en.productMoreKeywords2 = word;
			});
		}).then(function(){
			var aeopAeProductPropertys = [], reqs=[];
			aliexpress_zh.aeopAeProductPropertys.filter(function(item, i){
				aeopAeProductPropertys[i] = item;
				var req;
				if(item.attrName){
					req = YoudaoFanyi.yi(item.attrName).then(function(word){
						aeopAeProductPropertys[i].attrName = word;
					});
					reqs.push(req);
				}
				if(item.attrValue){
					req = YoudaoFanyi.yi(item.attrValue).then(function(word){
						console.log(item.attrValue, word);
						aeopAeProductPropertys[i].attrValue = word;
					});
					reqs.push(req);
				}
			});
			return $q.all(reqs).then(function(){
				console.log(aeopAeProductPropertys);
				product_data.aliexpress_en.aeopAeProductPropertys = aeopAeProductPropertys;
			});
		}).then(function(){
			var aeopAeProductSKUs = [], reqs=[];
			aliexpress_zh.aeopAeProductSKUs.filter(function(item, i){
				aeopAeProductSKUs[i] = item;
				aeopAeProductSKUs[i].aeopSKUProperty.filter(function(prty, k){
					if(prty.propertyValueDefinitionName){
						var req = YoudaoFanyi.yi(prty.propertyValueDefinitionName).then(function(word){
							prty.propertyValueDefinitionName = word.replace(/[^\w\d]+/gi, ' ').substr(0, 20);
						});
						reqs.push(req);
					}
				});
			});
			return $q.all(reqs).then(function(){
				product_data.aliexpress_en.aeopAeProductSKUs = aeopAeProductSKUs;
			});
		}).then(function(){//内容要我翻译三次
			return manage.fanyiProductDetail(aliexpress_zh.detail);
		}).then(function(detail){
			return manage.fanyiProductDetail(detail);
		}).then(function(detail){
			return manage.fanyiProductDetail(detail);
		}).then(function(detail){
			product_data.aliexpress_en.detail = detail;
			return $q.when(store.put(product_data));
		}).then(function(){
			return product_data;
		});
	};


	/**
	 * 上传所有图片
	 */
	manage.uploadIamges = function (product_data){
		var reqs = [], imageURLs = [];
		return $q.when().then(function(){
			angular.forEach(product_data.aliexpress_zh.imageURLs, function (url, i) {
				reqs[i] = AliexpressProductManage.uploadImage(url).then(function(imginfo){
					imageURLs[i] = imginfo.photobankUrl;
				});
			});
			return $q.all(reqs).then(function(){
				product_data.aliexpress_zh.imageURLs = imageURLs;
			});
		}).then(function(){
			reqs = [];
			var dimgs = $(product_data.aliexpress_zh.detail);
			dimgs.find('img').each(function(i){
				var ths = this;
				if( (/.*\.gif.*/i).test(this.src) ){
					$(this).remove();
				}else{
					reqs[i] = AliexpressProductManage.uploadImage(this.src).then(function(imginfo){
						ths.src = imginfo.photobankUrl;
					});
				}
			});
			return $q.all(reqs).then(function(){
				return $('<div></div>').append(dimgs).html();
			});
		}).then(function(res){
			product_data.aliexpress_zh.detail = res;
			// 处理SKU
			reqs = [];
			angular.forEach(product_data.aliexpress_zh.aeopAeProductSKUs, function(sku, i){
				// console.log(sku.aeopSKUProperty);
				if(sku.aeopSKUProperty[0].skuImage){
					reqs[i] = AliexpressProductManage.uploadTmpImage(sku.aeopSKUProperty[0].skuImage).then(function(imginfo){
						sku.aeopSKUProperty[0].skuImage = imginfo.url;
					});
				}
			});
			return $q.all(reqs);
		}).then(function(){
			return $q.when(store.put(product_data));
		}).then(function(){
			return product_data;
		});
	};
	// 发布到SMT
	manage.putToSmt = function(product_data){
		product_data.aliexpress_en.subject = product_data.aliexpress_en.subject.substr(0,126);
		product_data.aliexpress_en.keyword = product_data.aliexpress_en.keyword.substr(0,126);
		product_data.aliexpress_en.productUnit = 100000015;
		return $q.when().then(function(){
			if(product_data.aliexpress_en.productId){
				return AliexpressProductManage.updateProductToSMT(product_data.aliexpress_en);
			}
			return AliexpressProductManage.puhlishProductToSMT(product_data.aliexpress_en);
		}).then(function(res){
			product_data.aliexpress_en.productId = res.productId;
			product_data.aliexpress_zh.productId = res.productId;
			product_data.aliexpress_productId = res.productId;
			return $q.when(store.put(product_data));
		}).then(function(){
			return product_data;
		});
	};

	return manage;
}]);
})(window);