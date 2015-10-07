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