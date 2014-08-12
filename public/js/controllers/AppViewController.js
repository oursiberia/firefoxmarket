app.controller("AppViewController",["$window","API","$scope",function($window,API,$scope){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];


    API.request("app_detail",id).then(function(data){
        $scope.author = data.author;
        $scope.categories = data.categories;
        $scope.content_ratings = data.content_ratings;


    });


}]);