/**
 * Controller for the single App view.
 * displays app info
 */
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



        //support stuff;
        $scope.support_email = data.support_email[navigator.language];
        $scope.support_url = data.support_url[navigator.language];




        //versions of the app published.
        $scope.versions = data.versions;

        //release notes
        $scope.release_notes = data.release_notes;

        //used to trigger download
        $scope.manifest = data.manifest_url;

        $rootScope.loaded();

    });


    /**
     * What happens when we click on a tab trigger
     * @param e
     */
    $scope.changeTabContent = function(e){
        var content = document.querySelector("#tab-content");

        switch(e.target.getAttribute("data-tabname")){
            case "description":
                console.log($scope.description);
                content.innerHTML = $scope.description;
                break;

            case "screenshots":
                console.log(screenshots);
                content.innerHTML = "";
                var previews = $scope.previews;
                for(var i = 0;i<previews.length;++i){
                    var image = new Image();
                    image.src = previews[i].thumbnail_url;
                    image.setAttribute("large",previvews[i].image_url);
                    content.appendChild(image);


                }
                break;

            case "releasenotes":
                if($scope.release_notes === null){
                    content.innerHTML = "No release notes available";
                }
                break;
        }
    };

}]);