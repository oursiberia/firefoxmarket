app.controller("AppViewController",["$window","API","$scope","$rootScope",function($window,API,$scope,$rootScope){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];


    API.request("app_detail",id).then(function(data){
        $scope.author = data.author;
        $scope.categories = data.categories;
        $scope.content_ratings = data.content_ratings;
        $scope.name = data.name[navigator.language];


        //parse out previews
        var previews = [];
        for(var i = 0;i<data.previews.length;++i){
            var preview = {
                image:data.previews[i].image_url,
                thumb:data.previews[i].thumbnail_url
            }

            previews.push(preview);
        }

        $scope.previews = previews;
        $scope.privacy = "http://marketplace.firefox.com" + data.privacy_policy

        $scope.support_email = data.support_email[navigator.language];
        $scope.support_url = data.support_url[navigator.language];
        $scope.tags = data.tags;
        $scope.versions = data.versions;

        $rootScope.loaded();

    });


}]);