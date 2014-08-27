/**
 * Controller for the home page/view
 */
app.controller("home",["$rootScope","API","$scope","$filter","$http",function($rootScope,API,$scope,$filter,$http){
    //Isotope reference
    var iso;

    //the current category we're showing in the viewbox
    var current_category = "";
    var is_showing_category = false;
    /**
     * Load featured apps
     */
    API.request("featured").then(function(data){
        console.log(data);
        //var apps = $rootScope.processData(data);
        var apps = $filter("DesktopApps")(data.objects);

        //pick one to highlight at random
        var index = Math.floor(Math.random() * apps.length);
        var featured = apps[index];
        featured["classname"] = featured.classname + " " + "highlighted";


        //shift featured to the beginning of the array so it's first in the grid
       /* for(var i = 0;i<apps.length;++i){
        if(i === index){
        var temp = apps[0];
        apps[0] = apps[index];
        apps[index] = temp;
        }
        }*/

        //hide everything in the beginning cept first 4 apps
        var first = [];
        for(var i = 0;i<4;++i){
            apps[i].showfirst = "showfirst";
        }



        $scope.featured_apps = apps;


        $scope.loadAll = function(){
            iso.arrange({
                filter:".app"
            })
        };


        $rootScope.loaded(function(){
            var parent = document.getElementById("HOME");
            angular.element(parent).removeClass("ajax");

            console.log("done rendering");

            //isotope all things
            var container = document.querySelector(".apps");
            iso = new Isotope(container,{
                itemSelector: '.app',
                filter:".showfirst",
                masonry: {
                    gutter:20
                }
            });



        });
    });


    $scope.searchApp = function(){
        var selector = document.querySelector("#search-home-result");
        TweenMax.to(selector,1,{
            height:window.innerWidth,
            onComplete:function(){
                query();
                $rootScope.lockBody();
            }
        })
    };

    function query(){
        //get the search term;
        var term = document.getElementById("homesearch");

        /**
         * if theres no search term, reject search attempt.
         */
        if(term.value == ""){
            console.log("no search term entered");
            // alert("please enter a search term");
            return false;
        }

        //query api
        $http({
            method:"GET",
            url:"https://marketplace.firefox.com/api/v1/apps/search/?q=" + term.value + "&device=desktop"
        }).success(function(data, status, headers, config){

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


        }).error(function(data, status, headers, config){
            console.error("Something went wrong with the search");
        })

    }



    /**
     * Category preview trigger
     * @param name category name
     */
    $scope.showCategory = function(e){
        current_category = e.target.getAttribute("data-slug");
        var params = "?cat=" + current_category;

        if(is_showing_category === true){
            TweenMax.to(document.querySelector(".category-wrap"),1,{
                opacity:0
            });

            is_showing_category = false;
        }
        //load up some apps from that category
        API.clientRequest("search",params ).then(function(data){
            var apps = $filter("DesktopApps")(data,10);
            console.log(apps);
            $scope.category_apps = apps;
            if(is_showing_category === false){
                TweenMax.to(document.querySelector(".category-wrap"),1,{
                    opacity:1
                });

                is_showing_category = true;
            }


        });

    };


}]);
