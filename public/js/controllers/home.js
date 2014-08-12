app.controller("home",["$rootScope","API",function($rootScope,API,$scope){
    var BASE_URL = $rootScope.BASE_URL;
    /**
     * Load the feed of apps
     */
    API.request("collections",function(data){

       console.log(data);




    });

}]);
