/**
 * Controller for the home page/view
 */
app.controller("home",["$rootScope","API","$scope","$filter","$http",function($rootScope,API,$scope,$filter,$http){

    //the current category we're showing in the viewbox
    var current_category = "";
    var is_showing_category = false;
    /**
     * Load featured apps
     */
    API.clientRequest("featured").then(function(data){

        //var apps = $rootScope.processData(data);
        var apps = $filter("DesktopApps")(data,10);

        //pick one to highlight at random
        var index = Math.floor(Math.random() * apps.length);
        var featured = apps[index];
        featured["classname"] = featured.classname + " " + "highlighted";


        //shift featured to the beginning of the array so it's first in the grid
        for(var i = 0;i<apps.length;++i){
            if(i === index){
                var temp = apps[0];
                apps[0] = apps[index];
                apps[index] = temp;
            }
        }


        $scope.featured_apps = apps;


        $http({
            method:"GET",
            url:"https://marketplace.firefox.com/api/v1/apps/app/473617/"
        }).success(function(data, status, headers, config){
            console.log(data);
        }).error(function(data, status, headers, config){
            console.log(data);
        })

        $rootScope.loaded(function(){
            var parent = document.getElementById("HOME");
            angular.element(parent).removeClass("ajax");

            console.log("done rendering");
            //isotope all things
            var container = document.querySelector(".apps");
            var iso = new Isotope(container,{
                itemSelector: '.app',
                masonry: {

                    gutter:20
                }
            });

        });
    });



    /**
     * Load list of categories
     */
    API.clientRequest("categories").then(function(data){
        $scope.categories = data.objects;
    });


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
