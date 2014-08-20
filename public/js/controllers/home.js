/**
 * Controller for the home page/view
 */
app.controller("home",["$rootScope","API","$scope","$filter",function($rootScope,API,$scope,$filter){

    //the current category we're showing in the viewbox
    var current_category = "";
    var is_showing_category = false;
    /**
     * Load featured apps
     */
    API.clientRequest("featured").then(function(data){

        //var apps = $rootScope.processData(data);
        var apps = $filter("DesktopApps")(data,10);


        $scope.featured_apps = apps;

        $rootScope.loaded(function(){
            var parent = document.getElementById("HOME");
            angular.element(parent).removeClass("ajax");

        });
    });


    /**
     * Load list of categories
     */
    API.request("categories").then(function(data){
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
