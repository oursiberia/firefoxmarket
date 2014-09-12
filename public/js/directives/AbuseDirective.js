/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:AbuseDirective
 *
 * @description
 */
app.directive("abusedirective",["API",function(API){

    return {
        templateUrl:"/build/templates/Abuse.html",
        controller:function($scope){
            $scope.sendReport = function() {

            };
        },
        link:function($scope,$el,$attr){
            

        }
    }
}]);