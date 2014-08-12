app.controller("home",["$rootScope","API","$scope","$window","$location",function($rootScope,API,$scope,$window,$location){

    /**
     * Load featured apps
     */
    API.request("featured").then(function(data){
        console.log(data);
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


    });






}]);
