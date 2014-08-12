app.controller("home",["$rootScope","API","$scope","$window","$location",function($rootScope,API,$scope,$window,$location){

    /**
     * Load featured apps
     */
    API.request("featured").then(function(data){
        console.log(data);
        var apps = [];
        for(var i = 0;i<data.objects.length;++i){
            var name = data.objects[i].name["en-US"];

            if(name !== undefined){
                name = name.split(" ");
                name = name.join("");
                var obj = {
                    icon:data.objects[i].icons["64"],
                    name:data.objects[i].name["en-US"],
                    id:data.objects[i].id,
                    safename:name,
                    author:data.objects[i].author
                };

            }else{
                var obj = {
                    icon:data.objects[i].icons["64"],
                    name:data.objects[i].name["en-US"],
                    author:data.objects[i].author,
                    id:data.objects[i].id,
                    safename:"/app/notfound"
                };
            }


            apps.push(obj);

        }
        $scope.featured_apps = apps;


    });






}]);
