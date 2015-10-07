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