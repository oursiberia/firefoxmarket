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
    "$location",
    function($rootScope,API,$scope,$filter,$http,MasterSearch,$location){
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
        /**================ FEATURED APPS ==================*/


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

                apps[i].description = $filter("LongCopyFilter")(apps[i].description,apps[i].id);
                first.push(apps[i]);
            }


            $scope.featured_apps = first;

            $rootScope.loaded(function() {
                var parent = document.getElementById("HOME");
                angular.element(parent).removeClass("ajax");
            });
        });

        /**
         * Initiates the install process
         * @param app_type the type of app we're trying to download ("hosted" or "packaged")
         * @param manifest the url to the manifest for download.
         */
        $scope.initPurchase = function(app_type,manifest){

            var req = "";
            /**
             * first make sure we're in Firefox.
             */
            if(navigator.userAgent.search("Firefox") === -1){
                alert("We're sorry, but apps within the Firefox Marketplace can only be downloaded from the Firefox browser");
                return;
            }

            var final_manifest = "";

            if(manifest !== undefined){
                final_manifest = manifest;
            }else{
                final_manifest = $scope.manifest;
            }


            if(app_type === "hosted") {

                req = navigator.mozApps.install(final_manifest);
            }else if(app_type === "packaged"){
                req = navigator.mozApps.installPackage(final_manifest);
            }

            req.onsuccess = function() {
                console.log("Install process initiated");
            };
            req.onerror = function(e) {

                console.log("Install process failed");
            };

        };

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
                name:"games",
                slug:"games"
            },
            {
                name:"productivity",
                slug:"productivity"
            },

            {
                name:"music",
                slug:"music"
            },
            {
                name:"social",
                slug:"social"
            }
        ];


        $scope.closeSearch = function(){
            var selector = document.querySelector("#search-home-result");
            TweenMax.to(selector,1,{
                height:0,
                onComplete:function(){
                    MasterSearch.query($scope);
                    $rootScope.unlockBody();
                }
            });
        };

        $scope.toggleCategoryTypes = function(e){
            if(e.target.tagName === "SPAN"){
                var parent = e.target.parentNode;
                var target = e.target;

                for(var i = 0; i<parent.children.length;++i){
                    parent.children[i].className = "";

                }

                target.className = "active";

                switch(target.innerHTML){
                    case "Popular":
                        $rootScope.$broadcast("CATEGORY_POPULAR");
                        break;


                    case "Recent":
                        $rootScope.$broadcast("CATEGORY_RECENT");
                        break;
                }

            }
        };


        /**
         * Redirects to view all search results
         * @param classname
         */
        $scope.viewSearchResults = function(classname){
            var column = document.getElementsByClassName(classname);

            var search = document.getElementById("homesearch");

            var metric = "";

            switch(classname){
                case "name_results":
                    metric = "Name";
                    break;

                case "author_results":
                    metric = "Developoer";
                    break;

                case "category_results":
                    metric = "Category";
                    break;

                case "description_results":
                    metric = "Description";
                    break;
            }

            if(search.value !== ""){
                var val = search.value.split("").join("");
                localStorage.setItem("search-term",search.value);
                localStorage.setItem("search-metric",metric);
                var data = JSON.stringify($scope[classname]);

                localStorage.setItem("search-results",data);

                $location.path("/searchresults/" + val);
            }

        };

    }]);//end controller