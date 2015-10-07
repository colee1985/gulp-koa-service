
angular.module("SuMaiTong").filter("AliexpressProductLabel", ['AliexpressProductManage', '$sce', function(AliexpressProductManage, $sce) {
	var model = AliexpressProductManage;
	return function(person, sep) {
		var field = model.fields[person];
		return $sce.trustAsHtml(field.label+'(<span style="color:#999">'+person+'</span>)');
	};
}]);