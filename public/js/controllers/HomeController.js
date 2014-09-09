/**
 * @ngdoc controller
 * @name FirefoxMarket.controller:HomeController
 *
 * @description
 * Controller for the home page/view
 */
app.controller("home",[
    "$rootScope",
    "API","$scope",
    "$filter",
    "$http",
    function($rootScope,API,$scope,$filter,$http){


        /**================ FEATURED APPS ==================*/
        var current_category = "";
        var is_showing_category = false;
        /**
         * Load featured apps
         */
        API.request("featured").then( function(data) {

            //var apps = $rootScope.processData(data);
            var apps = $filter("DesktopApps")(data.objects,40);

            //pick one to highlight at random
            var index = Math.floor(Math.random() * apps.length);
            var featured = apps[index];
            featured.classname = featured.classname + " " + "highlighted";

            //hide everything in the beginning cept first 4 apps
            var first = [];
            for (var i = 0;i< 4;++i) {
                first.push(apps[i]);
            }

            $scope.featured_apps = first;

            $rootScope.loaded(function() {
                var parent = document.getElementById("HOME");
                angular.element(parent).removeClass("ajax");
            });
        });



        /**================ SEARCH ==================*/
        /**
         * Does the searching. Tween to open up
         */
        $scope.searchApp = function() {
            var selector = document.querySelector("#search-home-result");
            TweenMax.to(selector,1,{
                height:window.innerWidth,
                onComplete:function(){
                    query();
                    $rootScope.lockBody();
                }
            });
        };

        /**
         * Runs the search query
         * @returns {boolean}
         */
        function query() {
            //get the search term;
            var term = document.getElementById("homesearch");

            /**
             * if theres no search term, reject search attempt.
             */
            if(term.value === ""){
                console.log("no search term entered");
                closeSearch();
                // alert("please enter a search term");
                return false;
            }

            //query api
            $http({
                method:"GET",
                url:"https://marketplace.firefox.com/api/v1/apps/search/?q=" + term.value + "&device=desktop"
            }).success(function (data, status, headers, config) {

                //need to filter out unecessary content, make new array
                var results = [];

                //get the length
                var len = data.objects.length;

                //loop through an get all the elements we needed
                for(var i = 0;i<len;++i){
                    var obj = data.objects[i];

                    //make a new object
                    var newobj = {
                        name:obj.name[navigator.language],
                        icon:obj.icons["64"],
                        id:obj.id
                    };

                    results.push(newobj);
                }

                //set to the scope
                $scope.results = results;


            }).error( function(data, status, headers, config) {
                console.error("Something went wrong with the search");
            });

        }

        /**
         * Closes the search panel
         */
        function closeSearch() {
            var selector = document.querySelector("#search-home-result");
            TweenMax.to(selector,0.5,{
                opacity:0,
                onComplete:function() {
                    TweenMax.to(selector,0.5,{
                        height:0,
                        onComplete:function(){

                            $rootScope.unlockBody();
                        }

                    });
                    selector.innerHTML = "";
                }
            });


        }


        /**============ CATEGORIES =============*/

        $scope.appcategories = [
            {
                name:"Games",
                slug:"games"
            },
            {
                name:"Productivity",
                slug:"productivity"
            },

            {
                name:"Music",
                slug:"music"
            },
            {
                name:"Social",
                slug:"social"
            }
        ]



    }]);//end controller