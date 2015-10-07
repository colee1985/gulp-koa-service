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