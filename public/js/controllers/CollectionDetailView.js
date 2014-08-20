app.controller("CollectionDetailView",["$window","API",function($window,API){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];

    API.clientRequest("collections_detail", id).then(function(data){
        console.log(data);



    });



}]);