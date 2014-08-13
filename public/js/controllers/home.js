/**
 * Controller for the home page/view
 */
app.controller("home",["$rootScope","API","$scope",function($rootScope,API,$scope){

    /**
     * Load featured apps
     */
    API.request("featured").then(function(data){

        var apps = [];
        for(var i = 0;i<data.objects.length;++i){
            var name = data.objects[i].name["en-US"];


            var obj = {
                icon:data.objects[i].icons["64"],
                name:data.objects[i].name["en-US"],
                id:data.objects[i].id,
                author:data.objects[i].author
            };



            for(var a = 0;a<data.objects[i].device_types;++a){
                if(data.objects[i].device_types[a] ==="desktop"){
                    obj["device"] = "desktop";
                }
            }



            apps.push(obj);
        }
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
