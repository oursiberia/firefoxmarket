/**
 * @ngdoc service
 * @name FirefoxMarket.service:API
 *
 * @description
 * Service to interact with the Firefox Marketplace API
 */
app.factory("API",[
    "Utils",
    "$http",
    "$q",
    "$timeout",function(Utils,$http,$q,$timeout){

    var routes = {
        "featured":"/api/v1/fireplace/search/featured/?limit=100",
        "app_detail":"/api/v1/apps/app/",
        "apps_in_category":"/api/v1/apps/search/?cat=",
        "search":"/api/v1/apps/search/",
        "collections_detail":"/api/v2/feed/collections/",
        "categories":"/api/v1/apps/category/",
        "ratings":"/api/v1/apps/rating/",
        "abuse":"/api/v1/abuse/app/", ////TODO Getting 500 error currently even with _user param set
        "review":"/api/v1/apps/rating/?_user=" // takes app, body, and rating
    }; //end routes


    var base = "https://marketplace.firefox.com";

    function request(endpoint,params,extradata) {
        var deferred = $q.defer();
        var extra = null;

        if (extradata !== undefined) {
            extra = extradata;
        }

        $timeout(function() {
            if (params === undefined) {
                params = "";
            }
            $http({
                method:"GET",
                url:base + routes[endpoint] + params
            }).success(function(data,status,headers,config){
                if (data) {
                    deferred.resolve(data,routes[endpoint] + params);
                }
            }).error(function(data,status,headers,config){
                deferred.resolve(data,status,headers,config);
            });

        },100);


        return deferred.promise;


    }//end request


    return {
        request:request
    };

}]);