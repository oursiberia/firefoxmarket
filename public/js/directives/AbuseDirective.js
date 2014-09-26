/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:AbuseDirective
 *
 * @description
 * This is a directive that handles submitting abuse reports to the
 * marketplace.
 *
 * Note - currently there is a 500 server error that occurs when submitting.
 */
app.directive("abusedirective",["API","$http",function(API,$http){

    return {
        templateUrl:"/build/templates/Abuse.html",
        controller:function($scope){
            $scope.sendReport = function() {

            };
        },
        link:function($scope,$el,$attr){

            $scope.submitAbuse = function(){
                //get the id of the app
                var id = window.location.href.split("/");
                id = id[id.length - 1];

                //get the text of the abuse
                var abuse = $el[0].children[0].getElementsByTagName("textarea")[0];
                var request = $http({
                    method:"post",
                    url:"https://marketplace.firefox.com/api/v2/abuse/app/?lang=en-US&limit=25&region=us&_user=" + encodeURIComponent(localStorage.getItem("token")),
                    data:{
                        text:abuse.value,
                        app:id,
                        sprout:"potato"
                    }
                });

                request.error(function(){
                    console.log("problem submitting request");
                });



            };

        }
    };
}]);