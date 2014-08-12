app.controller("AppViewController",["$window","API",function($window,API){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];


    API.request("app_detail",id).then(function(data){
        console.log(data);
    });


}]);