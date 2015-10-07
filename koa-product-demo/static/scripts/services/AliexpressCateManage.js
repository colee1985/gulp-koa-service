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