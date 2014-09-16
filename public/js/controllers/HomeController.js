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
    "MasterSearch",
    function($rootScope,API,$scope,$filter,$http,MasterSearch){
        /**
         * Editorial
         * TODO figure out how curated apps would better work.
         */
        var editorial = {
            "staff_pics": {
                "one": "421872",
                "two": "374841",
                "three": "366345"
            },

            "top_three_games": {
                "one": "427566",
                "two": "502203",
                "three": "490020"
            },
            "workplace_apps":{
                "one":"429326",
                "two":"468749",
                "three":"478633"
            }
        };

        $scope.test = {
            name:"apple",
            id:"mapple"
        }

        $scope.editorial = editorial;

        $scope.staff_one = {
            id:editorial.staff_pics.one,
            image:buildUrl(editorial.staff_pics.one)
        }

        $scope.staff_two = {
            id:editorial.staff_pics.two,
            image:buildUrl(editorial.staff_pics.two)
        }
        $scope.staff_three = {
            id:editorial.staff_pics.three,
            image:buildUrl(editorial.staff_pics.three)
        }


        $scope.games_one = {
            id:editorial.top_three_games.one,
            image:buildUrl(editorial.top_three_games.one)
        }


        $scope.games_two = {
            id:editorial.top_three_games.two,
            image:buildUrl(editorial.top_three_games.two)
        }

        $scope.games_three = {
            id:editorial.top_three_games.three,
            image:buildUrl(editorial.top_three_games.three)
        }



        $scope.workplace_one = {
            id:editorial.workplace_apps.one,
            image:buildUrl(editorial.workplace_apps.one)
        }


        $scope.workplace_two = {
            id:editorial.workplace_apps.two,
            image:buildUrl(editorial.workplace_apps.two)
        }


        $scope.workplace_three = {
            id:editorial.workplace_apps.three,
            image:buildUrl(editorial.workplace_apps.three)
        }

        function buildUrl(app){
            //https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/409/409214-64.png?modified=crushed
            var chars = app.split("");
            return "https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/"+ chars[0] + chars[1] + chars[2] +"/" + app + "-64.png?modified=crushed"
        }
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
                    MasterSearch.query($scope);
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