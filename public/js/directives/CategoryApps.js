/**
 *  @ngdoc directive
 *  @name FirefoxMarket.directive:categoryapps
 *
 *  @description
 *  Deals with fetching, then displaying apps within categories.
 *  The category to search for should be specified as a data attribute using the name
 *  data-categoryname
 */
app.directive("categoryapps",["API","$rootScope",function(API,$rootScope) {
    return{
        templateUrl:"/build/templates/apps/categoryapps.html",
        controller:function($scope){
            var popularSection = false;
            $scope.$on("CATEGORY_RECENT",function(){
                var popular = document.getElementsByClassName("popular-category");
                var recent = document.getElementsByClassName("recent-category");


                for(var a = 0;a<popular.length;++a){
                    popular[a].style.display = "none";
                }

                for(var i = 0;i<recent.length;++i){
                    recent[i].style.display = "block";
                }
            });

            $scope.$on("CATEGORY_POPULAR",function(){
                var popular = document.getElementsByClassName("popular-category");
                var recent = document.getElementsByClassName("recent-category");

                for(var a = 0;a<popular.length;++a){
                    popular[a].style.display = "block";
                }

                for(var b = 0;b<recent.length;++b){
                    recent[b].style.display = "none";
                }

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
        },
        link:function($scope,$el,$attrs) {
            var categoryname = $attrs.categoryname;
            var limit = $attrs.limit || 5;

            //run the main search for popular apps.
            var params = "?cat=" + categoryname + "&sort=rating";
            API.request("search",params).then(function(data) {
                var apps = data.objects;
                var shown_apps = [];

                //get a list of all the categories currently being shown
                var names = document.getElementsByClassName("category-title");

                /**
                 * Currently, when attempting to utilize the desktopApps filter,
                 * empty arrays get passed in. On top of which, there don't always seem
                 * to be enough desktop apps for each category. For now, just grab everything.
                 *
                 * TODO Add filtering for desktop apps once there are enough also, figure out why filter isn't working
                 */
                for(var i = 0;i<limit;++i) {
                    var app = apps[i];
                    shown_apps.push({
                        icon:app.icons["128"],
                        id:app.id,
                        app_type:app.premium_type,
                        manifest_url:app.manifest_url,
                        category_name:app.categories,
                        author:app.author,
                        premium_type:app.premium_type.charAt(0).toUpperCase() + app.premium_type.slice(1),
                        name:$rootScope.filterName(app),
                        rating:app.ratings.average
                    });

                }



                localStorage.setItem("home_category_popular_apps",JSON.stringify(shown_apps));
                $scope.capps = shown_apps;

            });


            /**
             * Run the next search for the most recent apps
             */
            var params2 = "?cat=" + categoryname + "&sort=created";
            API.request("search",params2).then(function(data) {
                var apps = data.objects;
                var shown_apps = [];

                //get a list of all the categories currently being shown
                var names = document.getElementsByClassName("category-title");

                /**
                 * Currently, when attempting to utilize the desktopApps filter,
                 * empty arrays get passed in. On top of which, there don't always seem
                 * to be enough desktop apps for each category. For now, just grab everything.
                 *
                 * TODO Add filtering for desktop apps once there are enough also, figure out why filter isn't working
                 */
                for(var i = 0;i<limit;++i) {
                    var app = apps[i];
                    shown_apps.push({
                        icon:app.icons["128"],
                        id:app.id,
                        app_type:app.premium_type,
                        manifest_url:app.manifest_url,
                        category_name:app.categories,
                        author:app.author,
                        premium_type:app.premium_type.charAt(0).toUpperCase() + app.premium_type.slice(1),
                        name:$rootScope.filterName(app),
                        rating:app.ratings.average
                    });

                }

                shown_apps = shown_apps.reverse();


                localStorage.setItem("home_category_recent_apps",JSON.stringify(shown_apps));
                $scope.recent_capps = shown_apps;

            });
        }
    };
}]);