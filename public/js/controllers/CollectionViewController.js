app.controller("CollectionViewController",["$scope","API",function($scope,API){

    //get the app collection out of the url
    var collection = window.location.href.split("/");
    collection = collection[collection.length - 1];

    API.request("collections").then(function(data){
        console.log(data);
    });

}]);