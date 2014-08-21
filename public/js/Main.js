var app = angular.module("FireFoxMarket",[
    "ui.router",
    "LocalStorageModule"
]);


app.config(function($stateProvider,$urlRouterProvider,$locationProvider,$httpProvider){
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);

    /**
     * Home page
     */
    $stateProvider.state("home",{
        url:"/",
        templateUrl:"/templates/home.html"
    });


    /**
     * 404 page
     */
    $stateProvider.state("AppNotFound",{
        url:"/app/notfound",
        templateUrl:"/templates/apps/404.html"
    });

    /**
     * Detail view of the app
     */
    $stateProvider.state("AppView",{
        url:"/app/:name",
        templateUrl:function(urlattr){
            return "/templates/apps/appview.html"
        },
        controller:"AppViewController"
    });

    /**
     * TODO decide what this ought to do? Was thinking it'd just show all the categories
     */
    $stateProvider.state("CategoryView",{
        url:"/category/:name",
        templateUrl:function(urlattr){
            return "/templates/apps/catview.html"
        },
        controller:"CategoryViewController"
    });

    /**
     * TODO decide what this shoudl show? Was thinking it would just show all the collections
     */
    $stateProvider.state("CollectionView",{
        url:"/collection",
        templateUrl:"/templates/apps/collectionview.html",
        controller:"CollectionViewController"
    });

    /**
     * Shows the detail view for a particular collection
     */
    $stateProvider.state("CollectionDetailView",{
        url:"/collection/:id",
        templateUrl:function(urlattr){
            return "/templates/apps/collectionDetail.html"
        },
        controller:"CollectionDetailView"
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


    /**
     * This hides the loader once content has been loaded.
     * @param delay
     */
    $rootScope.loaded = function(callback){

        //get rid of the loader
        TweenMax.to(document.querySelector("#loader"),0.2,{
            opacity:0,
            onComplete:function(){
                callback();
            }
        });


    };


    /**
     * For some things, like bringing down the search pane,
     * we need to prevent scrolling
     */
    $rootScope.lockBody = function(){
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
    }

    $rootScope.unlockBody = function(){
        document.getElementsByTagName("html")[0].style.overflow = "scroll";
    }


});