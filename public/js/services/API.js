/**
 * Service to interact with the Firefox Marketplace API
 */
app.factory("API",["Utils","$http","$q","$timeout",function(Utils,$http,$q,$timeout){

    var routes = {
        "featured":"/api/v1/fireplace/search/featured/?limit=100",
        "app_detail":"/api/v1/apps/app/",
        "apps_in_category":"/api/v1/apps/search/?cat=",
        "search":"/api/v1/apps/search/",
        "collections_detail":"/api/v2/feed/collections/"
    }; //end routes


    var base = "https://marketplace.firefox.com";


    function request(endpoint,params){
        var deferred = $q.defer();
        console.log("Need to run : " + endpoint);

        $timeout(function(){
            if(params === undefined){
                params = "";
            }
            $http({
                method:"GET",
                url:base + routes[endpoint] + params
            }).success(function(data,status,headers,config){
                if(data){
                    deferred.resolve(data,status,headers,config);
                }
            }).error(function(data,status,headers,config){
                deferred.resolve(data,status,headers,config);
            });

        },100);


        return deferred.promise;


    }//end request


    return {
        request:request
    }

}]);