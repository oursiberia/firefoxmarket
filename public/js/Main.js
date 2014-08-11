var app = angular.module("FireFoxMarket",[
    "ui.router"
]);


app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home",{
        url:"/",
        templateUrl:"/templates/home.html"
    });
});


app.controller("main",function($window,$rootScope,API){


});