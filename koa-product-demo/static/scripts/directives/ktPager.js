// 分页组件
/*
控制器里先配置一个分页服务:
参数：KtPager(每页条数，显示页码个数)
$scope.KtPager = new KtPager(10, 8);
	$scope.pagelistdemo = [];
	$scope.KtPager.onSelected = function (page){
		communityManager.searchAllGames({
			keyword: 'a',
			type: 1,
			pagesize:5,
			pageindex: page
		}).then(function(data){
			console.log('pagelistdemo:',data);
			console.log('pagelistdemo:',data.data.total);
			$scope.pagelistdemo = data.data.games;
			$scope.KtPager.total = data.data.total;
		});
	}
	$scope.KtPager.onSelected(1);
模板使用配置好的服务：
	<div kt-pager="KtPager"></div>
	注意：kt-pager 的参数不能为空
参数说明：
	$scope.KtPager.onSelected：页码被选择事件
	$scope.KtPager.setPage: 主动设置页码
*/
angular.module('SuMaiTong').factory('KtPager', [function () {
	function generateUiData()
	{
		var total = this.total;
		var page_size = this.page_size;
		var tag_count = this.tag_count;
		// 最大页码
		var max_page = this.max_page = Math.ceil( parseInt(total)/parseInt(page_size));
		var start = 1;
		var end = max_page;
		var front_move = Math.ceil(parseInt(tag_count)*0.5)-1;
		var back_move = Math.ceil(parseInt(tag_count)*0.5);

		this.cur_page = parseInt(this.cur_page);
		// 最大页码大于1才显示分页组件
		if(max_page>1){
			this.is_shown = true;
		}else{
			this.is_shown = false;
		}
		// 置空
		this.page_items = [];
		start = this.cur_page-front_move;
		end = this.cur_page+back_move;

		if(start<1){
			start = 1;
		}
		var max_start = max_page-tag_count;
		if(start>max_start && max_start>0){
			start = max_start;
		}

		var min_end = tag_count;
		if(end<min_end){
			end = min_end;
		}
		if(end>max_page){
			end = max_page;
		}
		var i=start;
		while(i<=end){
			this.page_items.push({
				number: i
			});
			i++;
		}
	}
	return function (page_size, tag_count){
		this._generateUiData = generateUiData;
		this.total = 0;
		this.page_size = page_size || 10;
		this.tag_count = tag_count || 5;
		this.cur_page = 1;
		this.is_shown = false;
		this.max_page = 0;
		this.page_items = [];
		this.onSelected = function(number){
			// 自行重写此接口
		};
		this.setPage = function(number){
			if(number==this.cur_page){
				return false;
			}
			if(number<1){
				number = 1;
			}
			if(number>this.max_page){
				number = this.max_page;
			}
			
			this.cur_page = number;
			this._generateUiData();
			this.onSelected(number);
			
			// event.preventDefault();
		};
		this.setTotal = function(total){
			this.total = Number(total);
			this._generateUiData();
		};
		this.init = function () {
			this._generateUiData();
		};
	};
}]).directive('ktPager', ['KtPager', function (KtPager) {
	return {
		restrict: 'AE',
		// require: 'ngModel',
		templateUrl: 'templates/directives/kt_pager.html',
		scope: {
			pageModel: '=ktPager',
		},
		link: function(scope, element, attrs, ctrl) {
			if(!scope.pageModel){
				scope.pageModel = new KtPager();
			}
			scope.pageModel.init();
			// console.log(scope.KtPager);
		}
	};
}]);