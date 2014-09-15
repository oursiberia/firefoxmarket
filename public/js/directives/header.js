/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:header
 *
 * @description
 * Directive to show header.
 */
app.directive("header",function(MasterSearch) {

    return {
        templateUrl:"/build/templates/header.html",
        controller:function($scope) {

        },

        link:function($scope,$el,$attrs) {

        	// Returns back home
        	$scope.returnHome = function() {
        		window.location = "/";
            };

            $scope.search = function(){
                var search = document.querySelector("#mainsearch");
                TweenMax.to(search,1,{
                    height:"100%",
                    ease:"Power3.easeInOut"
                })
            };

            $scope.searchApp = function(){
                MasterSearch.query($scope,document.querySelector("#mainsearch .wrap input").value);
            };
        }

    };
});