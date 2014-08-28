app.controller("AppViewController",["$window","API","$scope","$rootScope",function($window,API,$scope,$rootScope){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];




    /** TODO /api/v1/apps/app/:id is still not CORS enabled */
    API.request("app_detail",id + "/").then(function(data){
        console.log(data);
        $scope.author = data.author;
        $scope.categories = data.categories;
        $scope.content_ratings = data.content_ratings;
        $scope.rating = data.content_ratings["rating"];
        $scope.name = data.name[navigator.language];

        $scope.icon = data.icons["64"];

        //parse out previews
        var previews = [];
        for(var i = 0;i<data.previews.length;++i){
            var preview = {
                image:data.previews[i].image_url,
                thumb:data.previews[i].thumbnail_url
            }

            previews.push(preview);
        }

        $scope.description = data.description[navigator.language];
        $scope.previews = previews;
        $scope.privacy = "http://marketplace.firefox.com" + data.privacy_policy

        $scope.support_email = data.support_email[navigator.language];
        $scope.support_url = data.support_url[navigator.language];
        $scope.tags = data.tags;
        $scope.versions = data.versions;

        $rootScope.loaded();

    });


    $scope.changeTabContent = function(e){
        var content = document.querySelector("#tab-content");

        switch(e.target.getAttribute("tabname")){
            case "description":
                content.innerHTML = $scope.description;
                break;

            case "screenshots":
                
                break;

            case "releasenotes":

                break;
        }
    };

}]);