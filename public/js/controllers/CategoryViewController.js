/**
 * Controller for the Category view page
 */
app.controller("CategoryViewController",["$scope","API","$rootScope","$filter",function($scope,API,$rootScope,$filter){

    //get the category from the url
    var category = window.location.href.split("/");
    category = category[category.length - 1];

    //set the title of the category page
    var title = document.querySelector("#category-title");
    title.innerHTML = category.charAt(0).toUpperCase() + category.slice(1);



    API.request("featured").then(function(data) {

    });



        /**
     * Get all the apps in this category
     */
    API.request("apps_in_category",category).then(function(data){
        var apps = $filter("DesktopApps")(data);
        $scope.apps = apps;

        //fade the loader
        $rootScope.loaded();
    });


}]);