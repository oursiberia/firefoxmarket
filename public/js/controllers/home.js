/**
 * Controller for the home page/view
 */
app.controller("home",["$rootScope","API","$scope","$filter",function($rootScope,API,$scope,$filter){

    /**
     * Load featured apps
     */
    API.request("featured").then(function(data){

        //var apps = $rootScope.processData(data);
        var apps = $filter("DesktopApps")(data);
        console.log(apps);

        $scope.featured_apps = apps;

        $rootScope.loaded();
    });


    /**
     * Load list of categories
     */
    API.request("categories").then(function(data){
        $scope.categories = data.objects;
    });



}]);
