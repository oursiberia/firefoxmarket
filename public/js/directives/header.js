/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:header
 *
 * @description
 * Directive to show header.
 */
app.directive("header",function(MasterSearch,$rootScope,$location) {

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
                    height:window.innerHeight,
                    ease:"Power3.easeInOut",
                    onComplete:function(){
                        $rootScope.lockBody();
                    }
                });
            };


            $scope.closeSearch = function(){
                var search = document.querySelector("#mainsearch");
                var inputs = document.getElementsByClassName("homesearch");
                TweenMax.to(search,1,{
                    height:0,
                    ease:"Power3.easeInOut",
                    onComplete:function(){
                        //MasterSearch.query($scope);
                        for(var i = 0;i<inputs.length;++i) {
                            if (inputs[i] !== null) {
                                inputs[i].value = "";
                            }
                        }
                        $rootScope.unlockBody();
                    }
                });
            };

            /**
             * Initiates the install process
             * @param app_type the type of app we're trying to download ("hosted" or "packaged")
             * @param manifest the url to the manifest for download.
             */
            $scope.initPurchase = function(app_type,manifest,appname,icon){
                console.log(app_type,manifest,appname,icon);
              $rootScope.initPurchase(app_type,manifest,appname,icon);

            };

            /**
             * Runs a search
             */
            $scope.searchApp = function(){
                MasterSearch.query($scope);
            };


            /**
             * Redirects to view all search results
             * @param classname
             */
            $scope.viewSearchResults = function(classname){
                var column = document.getElementsByClassName(classname);

                var search = document.getElementById("search");

                var metric = "";

                switch(classname){
                    case "name_results":
                        metric = "Name";
                        break;

                    case "author_results":
                        metric = "Developer";
                        break;

                    case "category_results":
                        metric = "Category";
                        break;

                    case "description_results":
                        metric = "Description";
                        break;
                }


                if(search.value !== null) {
                    console.log("saving reesults for " + search.value);
                    var val = search.value.split("").join("");
                    localStorage.setItem("search-term",search.value);
                    var data = JSON.stringify($scope[classname]);

                    localStorage.setItem("search-results",data);

                    $location.path("/searchresults/" + search.value);
                }

            };

        }

    };
});