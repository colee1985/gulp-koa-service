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