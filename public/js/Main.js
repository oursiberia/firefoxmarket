var app = angular.module("FireFoxMarket",[
    "ui.router",
    "LocalStorageModule"
]);


app.config(function($stateProvider,$urlRouterProvider,$locationProvider,$httpProvider){
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);

    $stateProvider.state("home",{
        url:"/",
        templateUrl:"/templates/home.html"
    });

    $stateProvider.state("AppNotFound",{
        url:"/app/notfound",
        templateUrl:"/templates/apps/404.html"
    });

    $stateProvider.state("AppView",{
        url:"/app/:name",
        templateUrl:function(urlattr){
            return "/templates/apps/appview.html"
        },
        controller:"AppViewController"
    });

    delete $httpProvider.defaults.headers.common["X-Requested-Width"];
});


app.controller("main",function($window,$rootScope,API,localStorageService){

    /**
     * Check to see if the user is logged in
     */
    if(localStorageService.get("loggedin")){
       var val = localStorageService.get("loggedin");
        $rootScope.loggedin = true;
    };

    /**
     * Starts the login process.
     */
    $rootScope.login = function(){


    }; //end login

});