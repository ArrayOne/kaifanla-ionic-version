//

var app = angular.module('kaifanla', ['ionic']);



//配置路由模块
app.config(function($stateProvider,$urlRouterProvider){
  $stateProvider

    .state('main',{url:'/main',templateUrl:'tpl/main.html',controller:'mainCtrl'})

    .state('myOrder',{url:'/myOrder',templateUrl:'tpl/myOrder.html',controller:'myOrderCtrl'})

    .state('order',{url:'/order/:did',templateUrl:'tpl/order.html',controller:'orderCtrl'})

    .state('detail',{url:'/myDetail/:did',templateUrl:'tpl/detail.html',controller:'detailCtrl'})


    .state('start', {url:'/start',templateUrl:"tpl/start.html", controller:"startCtrl"})

  $urlRouterProvider.otherwise('start');//异常情况的处理

});


//父级控制器
app.controller('parentCtrl',['$scope','$state',function($scope,$state){
  $scope.jump=function(arg,data){
    $state.go(arg,data);
  }
}]);

app.controller('detailCtrl',['$scope','$http','$stateParams',function($scope,$http,$stateParams){
debugger;
  console.log($stateParams.did);
  $http.
    get('data/dish_getbyid.php?id=' + $stateParams.did)
    .success(function(data){$scope.dish=data[0];
  //  console.log($scope.dish);
  });
}]);

//main 的控制器
app.controller('mainCtrl',['$scope','$http',function($scope,$http){
  //$scope.$watch('kw',function(){
  //  console.log($scope.kw);
  //});


  //在用户打开界面的时候要显示数据
  $http.get("data/dish_getbypage.php?start=0").success(function(data){
    //console.log(data);
    $scope.dishList=data;
  });

   //监听用户的输入，经行操作。
  $scope.inputTxt={kw:''};
  $scope.$watch('inputTxt.kw',function(){
    if($scope.inputTxt.kw){//只有有意义的关键字才经行操作
      $http.get('data/dish_getbykw.php?kw='+$scope.inputTxt.kw).success(function(data){

        $scope.dishList=data;
      });
    }

 });
  $scope.hasMore=true;
  //当用户点击，加载更多的按钮，就查找
 $scope.loadMore=function(){

   $http
     .get('data/dish_getbypage.php?start='+ $scope.dishList.length)
     .success(function(data){

       if(data.length<5){//如果返回的数据小于5条就进行判断
         $scope.hasMore=false;

       }
       $scope.dishList=  $scope.dishList.concat(data);
       console.log(data);

    //   $scope.$broadcast("scroll.scrollInfiniteComplete");
     });

 }


}]);



app.controller('myOrderCtrl',['$scope','$http',function($scope,$http){
   $http
     .get('data/order_getbyphone.php?phone='+sessionStorage.getItem('phone')).success(function(data){
     console.log(data);
     $scope.orderList=data;
   });

}]);

app.controller('orderCtrl',['$scope','$http','$stateParams',
  '$httpParamSerializerJQLike',function($scope,$http,$stateParams,$httpParamSerializerJQLike){

    $scope.order={did : $stateParams.did};

  $scope.submitOrder=function(){

    var  orderData=$httpParamSerializerJQLike($scope.order);
  console.log($stateParams.id);
  console.log(orderData);

    $http.get("data/order_add.php?"+orderData).success(function(data){

      console.log(data);

      if( data[0].msg=='succ'){

        $scope.succMsg="订单已经下达";
        sessionStorage['phone']=$scope.order.phone;
      }

      else{
        $scope.errMsg="请完善信息....";
      }
    });
  }
}]);

app.controller('startCtrl',['$scope','$http',function($scope,$http){

}]);