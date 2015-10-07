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