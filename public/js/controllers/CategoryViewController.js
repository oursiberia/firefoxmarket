/**
 * Controller for the Category view page
 */
app.controller("CategoryViewController",["$scope","API","$rootScope","$filter",function($scope,API,$rootScope,$filter){

    //get the category from the url
    var category = window.location.href.split("/");
    category = category[category.length - 1];

    //make a API request
    API.request("apps_in_category",category).then(function(data){
        var apps = $filter("DesktopApps")(data);
        $scope.apps = apps;
    });


}]);