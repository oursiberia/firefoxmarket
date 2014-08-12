app.controller("AppViewController",function($window,$location){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];

    console.log(id);

});