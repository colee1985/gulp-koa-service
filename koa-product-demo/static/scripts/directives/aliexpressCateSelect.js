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