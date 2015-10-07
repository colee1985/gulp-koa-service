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
