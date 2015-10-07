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