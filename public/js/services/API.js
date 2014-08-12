/**
 * Service to interact with the Firefox Marketplace API
 */
app.factory("API",["Utils","$http","$q","$timeout",function(Utils,$http,$q,$timeout){
    var routes = {
        //TAKEN FROM FIREPLACE
        'app': '/api/v1/fireplace/app/{0}/?cache=1&vary=0',
        'app/privacy': '/api/v1/apps/app/{0}/privacy/?cache=1&vary=0',
        'category': '/api/v1/fireplace/search/featured/?cat={0}&cache=1&vary=0',
        'collection': '/api/v1/fireplace/collection/{0}/?cache=1&vary=0',
        'reviews': '/api/v1/apps/rating/',
        'review': '/api/v1/apps/rating/{0}/',
        'settings': '/api/v1/account/settings/mine/',
        'installed': '/api/v1/account/installed/mine/',
        'login': '/api/v1/account/login/',
        'fxa-login': '/api/v1/account/fxa-login/',
        'logout': '/api/v1/account/logout/',
        'newsletter': '/api/v1/account/newsletter/',
        'record_free': '/api/v1/installs/record/',
        'record_paid': '/api/v1/receipts/install/',
        'app_abuse': '/api/v1/abuse/app/',
        'search': '/api/v1/fireplace/search/?cache=1&vary=0',
        'feedback': '/api/v1/account/feedback/',
        'consumer_info': '/api/v1/fireplace/consumer-info/',
        'features': '/api/v1/apps/features/',

        'prepare_nav_pay': '/api/v1/webpay/prepare/',
        'payments_status': '/api/v1/webpay/status/{0}/',

        //KNOWN TO WORK
        "collections":"/api/v2/feed/collections/",
        "collections_detail":"/api/v2/feed/collections/-id",

        //list of featured apps
        "featured":"/api/v1/fireplace/search/featured/",

        /**============ NOTE : CORS NOT ENABLED==============*/
        //app detail
        "app_detail":"/api/v1/apps/app/-id"
    };

    //base path for the api
    var base = "https://marketplace.firefox.com";

   // CDN path but not CORS complient var base = "https://marketplace.cdn.mozilla.net";
    /**
     * Makes a request to the API
     * @param endpoint the enpoint in the "routes" object to hit
     * @param params any parameters should be in string format like (/93280/ or ?app=test)
     * @param callback callback functino to run once the request goes through
     *
     * Uses a promises based form to handle async-ness
     */
    function request(endpoint,parameters){
        var deferred = $q.defer();

        $timeout(function(){
            for(var i in routes){
                if(i === endpoint){

                    var request_url = "";

                    //append the main url
                    request_url += base +=routes[endpoint];

                    /**
                     * If there is a dash in the url, we know we need a
                     * param. Check params.
                     */
                    if(request_url.search("-") !== -1){

                        if(parameters === undefined){
                            var params = routes[endpoint].split("-");

                            var needed_param = "";
                            switch(params.length){
                                case 2:
                                    needed_param = params[1];
                                    break;
                            }

                            console.error("The selected route requires a parameter of : " + needed_param);


                            return false;

                        }else{
                            var url = request_url.split("-");
                            var temp = url[0];
                            request_url = temp  + parameters;


                        }


                    }

                    //TODO temporaryily sending to server to resolve CORS issues.
                    request_url = request_url.replace("https://marketplace.firefox.com","");

                    $http({
                        method:"GET",
                        url:"/marketplaceAPI/" + endpoint + " " + parameters
                    })
                        .success(function(data,status,headers,config){
                            if(data){
                          //      callback(data,status,headers,config);
                                deferred.resolve(data,status,headers,config);
                            }
                        })
                        .error(function(data,status,headers,config){
                            deferred.resolve(data,status,headers,config);
                        });
                }
            }


        },100);


        return deferred.promise;


    }

    return {
        request:request
    };
}]);