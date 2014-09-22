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

            //make burger
            //make the burger elemnt

            for(var i = 0;i<3;++i){
                var item = document.createElement("div");
                item.className = "burger-element";

                var inner = document.createElement("div");
                inner.className = "innerfill";
                item.appendChild(inner);

                document.getElementById("menu-trigger").appendChild(item);
            }


            var hasSearched = false;
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

            $scope.closeSearch = function(){

            };

            $scope.searchApp = function(e){


                MasterSearch.query($scope,document.querySelector("#mainsearch .wrap input").value,4);
            };
        }

    };
});