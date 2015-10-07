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