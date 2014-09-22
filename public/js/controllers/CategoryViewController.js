/**
 * @ngdoc controller
 * @name FirefoxMarket.controller:CategoryViewController
 *
 * @description
 * Controller for the Category view page
 */
app.controller("CategoryViewController",[
    "$scope",
    "API",
    "$rootScope",
    "$filter",function($scope,API,$rootScope,$filter){

        //get the category from the url
        var category = window.location.href.split("/");
        category = category[category.length - 1];

        //set the title of the category page
        var title = document.querySelector("#category-title");
        title.innerHTML = category.charAt(0).toUpperCase() + category.slice(1);


        //index of the currently featured app
        var currentIndex = 0;

        //these are the apps that will get featured
        var fapps = [];

        /**
         *   Do a search for featured apps within a category
         */
        API.request("featured","&cat=" + category).then(function (data) {

            var apps = $filter("DesktopApps")(data.objects);

            //limit to 4
            for(var i = 0;i<4;++i){
                apps[i].index = i;
                fapps.push(apps[i]);
            }

            $scope.featuredapps = fapps;
            swapApp();
        });


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
        };

        $scope.editorial = editorial;

        $scope.staff_one = {
            id:editorial.staff_pics.one,
            image:buildUrl(editorial.staff_pics.one)
        };

        $scope.staff_two = {
            id:editorial.staff_pics.two,
            image:buildUrl(editorial.staff_pics.two)
        };
        $scope.staff_three = {
            id:editorial.staff_pics.three,
            image:buildUrl(editorial.staff_pics.three)
        };


        $scope.games_one = {
            id:editorial.top_three_games.one,
            image:buildUrl(editorial.top_three_games.one)
        };


        $scope.games_two = {
            id:editorial.top_three_games.two,
            image:buildUrl(editorial.top_three_games.two)
        };

        $scope.games_three = {
            id:editorial.top_three_games.three,
            image:buildUrl(editorial.top_three_games.three)
        };



        $scope.workplace_one = {
            id:editorial.workplace_apps.one,
            image:buildUrl(editorial.workplace_apps.one)
        };


        $scope.workplace_two = {
            id:editorial.workplace_apps.two,
            image:buildUrl(editorial.workplace_apps.two)
        };


        $scope.workplace_three = {
            id:editorial.workplace_apps.three,
            image:buildUrl(editorial.workplace_apps.three)
        };






        function buildUrl(app){
            //https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/409/409214-64.png?modified=crushed
            var chars = app.split("");
            return "https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/"+ chars[0] + chars[1] + chars[2] +"/" + app + "-64.png?modified=crushed";
        }

        /**
         * Get all the apps in this category
         */
        API.request("apps_in_category",category).then( function(data) {

            //  var apps = $filter("DesktopApps")(data.objects);
            var objects = data.objects;
            var popular = [];

            //if we have a odd number of apps, pop the last one
            if(objects.length % 4 !== 0){
                objects.pop();
            }

            for (var i = 0; i < objects.length; ++i) {

                var obj = {};

                obj.icon = objects[i].icons["64"];
                obj.name =  objects[i].name["en-US"];
                obj.id = objects[i].id;
                obj.author = objects[i].author;
                obj.classname = "app";
                obj.rating = objects[i].ratings.average;


                popular.push(obj);
            }

            $scope.popularapps = popular;

            //fade the loader
            $rootScope.loaded();
        });




        /**==================== FUNCTIONS ===========================*/
        /**
         * This swaps out the featured apps
         */
        var timer = setInterval( function() {
            if (window.location.href.search("category") !== -1) {
               // swapApp();
            } else {
                clearInterval(timer);
            }
        },10000);


        /**
         * Cycles through the list of featured apps and displays them within the little box
         * over the banner.
         * @param first
         */
        function swapApp (first) {

            var selector = document.querySelector("#in-view-featured");
            var app = null;
            if (first) {
                app = fapps[0];
                currentIndex = 0;

                TweenMax.to(selector,1.5,{
                    opacity:1
                });
            } else {

                TweenMax.to(selector,1,{
                    opacity:0,
                    onComplete:function(){
                        selector.innerHTML = "";

                        if(currentIndex < 3){
                            currentIndex++;
                        }else if(currentIndex >= 3){
                            currentIndex = 0;
                        }
                        app = fapps[currentIndex];



                        var appf = document.querySelectorAll(".featured-app")[currentIndex];

                        selector.appendChild(appf.cloneNode(true));


                        TweenMax.to(selector,1,{
                            opacity:1
                        });
                    }
                });


            }


        }

    }]);
