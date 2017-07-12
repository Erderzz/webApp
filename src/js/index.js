/**
 * Created by Erdangjia on 2017/7/10.
 */
 // 创建模板
 var app = angular.module('app',['ui.router'])

// 创建控制器
app.controller('ErController',['$scope','$window','$location',function ($scope,$window,$location) {
    $scope.appTitle = '每日一刻';
    $scope.title = '首页';
    $scope.id = 0;

    // 接受广播
    $scope.$on('tab_natifi',function (e,regs) {
        var tempArray = ['首页','作者','栏目','我的'];
        $scope.id = regs.id;
        $scope.title = tempArray[regs.id];
    })

    // 返回按钮
    $scope.back = function () {
        $window.history.back();
    }

    // 监听路由的变化
    $scope.location = $location;
    $scope.hidden = false
    // 检测是否是首页
    $scope.$watch('location.url()',function (newV,oldV) {
        var index = newV.toString().indexOf('detail');
        if(index == -1){
            $scope.hidden = false
        }else{
            $scope.hidden = true;
        }
    })
}])

// 创建自定义指令--头部区域
app.directive('navs',function () {
    return {
        restrict : 'EA',
        templateUrl : '../views/nav_tpl.html',
        controller : 'TabbarController',
    }
})

// 创建自定义指令--底部区域
app.directive('tabbar',function () {
    return {
        restrict : 'EA',
        templateUrl : '../views/tabbar_tpl.html',
        // link:function ($scope,ele,attr) {
        //     var list = ele.children().children().children();
        //     for(var i=0;i<list.length;i++){
        //         list[i].className=" ";
        //     }
        //
        // }
    }

})

// 创建控制器+tabbar点击切换事件
app.controller('TabbarController',['$scope',function ($scope) {
    $scope.changePage = function (index) {
        // 通过点击事件让nav区域文字更换，所以先发送广播到父级
        $scope.$emit('tab_natifi',{id:index})
    }
}])

// 配置主体显示内容的路由
app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
    $stateProvider.state('home',{
        url : '/home',
        views : {
            home :{
                templateUrl : '../views/home_tpl.html',
                controller : 'HomeController'
            },
            author : {
                templateUrl : '../views/author_tpl.html',
            },
            content : {
                templateUrl : '../views/content_tpl.html',
            },
            my : {
                templateUrl : '../views/my_tpl.html',
            }
        }
    }).state('home.list',{
         url : '/list',
        templateUrl:'../views/homelist_tpl.html'
    }).state('home.detail',{
        url : '/detail/:id',
        template:'<details></details>',
        controller:'DetailController'
    })
    $urlRouterProvider.otherwise('home/list');
}])

//http://127.0.0.1/api/home.php?callback=fn
//http://localhost:8888/#!/home
//  创建首页控制器
app.controller('HomeController',['$scope','$http',function ($scope,$http) {
    $http({
        url : 'http://127.0.0.1/api/home.php',
        method : 'jsonp'
    }).then(function (regs) {
        $scope.homeData = regs.data;
    }).catch(function (err) {
        console.log(err);
    })
}])

// // 配置白名单
app.config(['$sceDelegateProvider',function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://127.0.0.1/api/**'
    ]);
}]);

// 自定义指令details
app.directive('details',function () {
    return {
        restrict:'EA',
        template:'<div class="home_details"><div ui-view></div></div>',
        replace : true,
        link:function ($scope,ele,attr) {
            ele.html($scope.item.content);
        }
    }
})

//  创建详情控制器
app.controller('DetailController',['$scope','$stateParams',function ($scope,$stateParams) {
    var index = $stateParams.id;
    $scope.item = $scope.homeData.posts[index];
    console.log($scope.item);
}])












