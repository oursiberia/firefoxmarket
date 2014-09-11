/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:appsearch
 *
 * @description
 * Deals with pinging the API for search queries.
 */

app.directive("appsearch",["$http","$rootScope","MasterSearch",function($http,$rootScope){

    return {
        templateUrl:"/templates/searchbox.html",
        controller:function($scope,$http) {
        },
        link:function($scope,$el,$attrs) {


            $scope.search = function() {


                TweenMax.to(document.getElementById("searchresults"),1,{
                    top:0,
                    ease:"Power3.easeInOut",
                    onComplete:function() {
                        $rootScope.lockBody();
                    }
                });
            };



        }
    };


}]);