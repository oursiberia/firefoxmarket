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
    "$http",
    "$filter",function($scope,API,$rootScope,$http,$filter){

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
         * See readme for the explanation about the editorial editor
         * TODO real workflow ought to be implemented or move code to
         * other server
         * http://54.84.190.82:3000/editorial.json
         */
        $http({
            method:"get",
            url:"/js/editorial.json"
        }).success(function(data){
           var editorials = data;

            //pick out the ones we want first
            var sections = [];
            for(var i = 0;i<editorials.length;++i){
                var item = editorials[i];
                if(item.type === category){
                    sections.push(item);
                }

            }

            for(var a = 0;a<sections.length;++a){
                var section = sections[a];
                $scope["section_" + a] = {
                    title:section.title,
                    copy:section.copy
                }
                for(var c = 0;c<section.apps.length;++c){
                    var app = section.apps[c];

                    $scope["section_" + a + "_" + c] = {
                        id:app,
                        image:buildUrl(app),
                    }
                }

            }

        }).error(function(){

        });

        function buildUrl(app){
            //https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/409/409214-64.png?modified=crushed
            var chars = app.split("");
            return "https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/"+ chars[0] + chars[1] + chars[2] +"/" + app + "-64.png?modified=crushed";
        }


        ///// App grid /////
        var popular_offset = 0;
        var recent_offset = 0;

        //current sets of apps
        var popular_set = [];
        var recent_set = [];

        //limit to return
        var searchLimit = 16;


        loadCategoryApps();
        loadRecentApps();

        var grid = document.querySelectorAll(".app-grid")[0];
        var popular_grid = grid.children[0];
        var recent_grid = grid.children[1];

        function loadCategoryApps(){
            /**
             * Get all the apps in this category
             */
            API.request("apps_in_category",category + "&limit=" + searchLimit + "&offset=" + popular_offset).then( function(data) {

                //  var apps = $filter("DesktopApps")(data.objects);
                var objects = data.objects;
                //var popular_set = [];

                //if we have a odd number of apps, pop the last one
                if(objects.length % 4 !== 0){
                    objects.pop();
                }

                for (var i = 0; i < objects.length; ++i) {

                    var obj = {};

                    obj.icon = objects[i].icons["64"];
                    obj.name =  $rootScope.filterName(objects[i]);
                    obj.id = objects[i].id;
                    obj.author = objects[i].author;
                    obj.classname = "app";
                    obj.app_type = objects[i].app_type || "hosted";
                    obj.manifest_url = objects[i].manifest_url;
                    obj.rating = objects[i].ratings.average;


                    popular_set.push(obj);
                }




                if(popular_offset <= 0){
                    $scope.popularapps = popular_set;
                    console.log("HERE");
                }else{
                   setTimeout(function(){
                       $scope.popularapps.concat(popular_set);

                       $scope.$apply();
                   },100);
                }


                //fade the loader
                $rootScope.loaded();

                //increase the offset count
                popular_offset += searchLimit;

            });
        }



      function loadRecentApps(){
          /**
           * Get all the recent apps in this category
           */
          API.request("apps_in_category","&cat=" + category + "&limit=" + searchLimit + "&sort=created&offset=" + recent_offset).then(function (data) {
              //  var apps = $filter("DesktopApps")(data.objects);
              var objects = data.objects;


              //if we have a odd number of apps, pop the last one
              if(objects.length % 4 !== 0){
                  objects.pop();
              }

              for (var i = 0; i < objects.length; ++i) {
                  var obj = {};
                  obj.icon = objects[i].icons["64"];
                  obj.name =  $rootScope.filterName(objects[i]);
                  obj.id = objects[i].id;
                  obj.author = objects[i].author;
                  obj.classname = "app";
                  obj.app_type = objects[i].app_type || "hosted";
                  obj.manifest_url = objects[i].manifest_url;
                  obj.rating = objects[i].ratings.average;
                  recent_set.push(obj);
              }

              if(recent_offset <= 0){
                  $scope.recentapps = recent_set;
              }else{
                  setTimeout(function(){
                      $scope.recentapps.concat(recent_set);

                      $scope.$apply();
                  },100);
              }



              //increase the offset
              recent_offset += searchLimit;

          });

      }

        /**==================== FUNCTIONS ===========================*/
        /**
         * This swaps out the featured apps
         */
        var timer = setInterval( function() {
            if (window.location.href.search("category") !== -1) {
                swapApp();
            } else {
                clearInterval(timer);
            }
        },7000);


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
        $scope.toggleCategoryTypes = function(e){
            if(e.target.tagName === "SPAN"){
                var parent = e.target.parentNode;
                var target = e.target;

                for(var i = 0; i<parent.children.length;++i){
                    parent.children[i].className = "";

                }
                var recentapps = document.querySelector(".category-recent");
                target.className = "active";

                switch(target.innerHTML){
                    case "Popular":
                        recentapps.style.display = "none";
                        break;


                    case "Recent":
                        recentapps.style.display = "block";
                        break;
                }

            }
        };

        $scope.getMessage = function() {
            loadRecentApps();
            loadCategoryApps();
        }
    }]);
