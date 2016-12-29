(function () {
    'use strict';

    angular
        .module('product', ['ngRoute','angular.filter'])
        .config(config);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        
        $routeProvider
            .when('/productlist/:type/:orderby', {
                templateUrl: '/view/productlist.view.html',
                controllerAs: 'vm',
                map:':type'
            })

            .otherwise({ redirectTo: '/productlist/all/name' });
    }
  
  angular
        .module('product')
        .controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', '$filter','$http','$routeParams','$location'];
    
    function ProductController($scope, $filter,$http,$routeParams,$location) {
      
    if($location.path()){
        $scope.location = $location.path().substring(0, $location.path().lastIndexOf("/"));
    }else {
        $scope.location = '/productlist/all';
    }  
    $scope.tab = $routeParams.type;      
    $scope.finalProductList = [];
    $scope.categoryList = [];
    $scope.productlist = [];  
      
    $http.get("../data/data.json").then(function(response) {
  
      for (var i=0 ; i < response.data.length;i++) {    
       $scope.categoryList.push(response.data[i].category);
        if($routeParams.type == 'all' || response.data[i].category == $routeParams.type){        
          for(var j=0 ; j < response.data[i].products.length;j++) {
            $scope.productlist.push(response.data[i].products[j]);
          }
          
        }  
      }
    if($routeParams.orderby=='price-desc'){
      $routeParams.orderby = 'price';
      $scope.reverse = true;
      
    }  
    $scope.productlist = $filter('orderBy')($scope.productlist, $routeParams.orderby,$scope.reverse);  
   });   
  }

})();