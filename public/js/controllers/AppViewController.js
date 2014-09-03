/**
 * Controller for the single App view.
 * displays app info
 */
app.controller("AppViewController",["$window","API","$scope","$rootScope","$filter",function($window,API,$scope,$rootScope,$filter){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];

    $scope.appid = id;

    //get the number of ratings
    API.request("ratings","?app=" + id + "&limit=999999").then(function(data){
        $scope.ratings = data.objects.length + " ratings";
    });


    API.request("app_detail",id + "/").then(function(data){
        console.log(data);
        $scope.author = data.author;
        $scope.categories = data.categories;
        $scope.category = data.categories[0];
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

        //TODO come up with actual page or modal for privacy policy
        $scope.privacy = "http://marketplace.firefox.com" + data.privacy_policy



        //support stuff;
        $scope.support_email = data.support_email[navigator.language];

        //TODO Get people who don't have Support URLs set to add em.
        $scope.support_url = data.support_url[navigator.language];




        //versions of the app published.
        $scope.versions = data.versions;

        //release notes
        $scope.release_notes = data.release_notes;

        //used to trigger download
        $scope.manifest = data.manifest_url;

        $rootScope.loaded();



        /**
         * Search for other apps by the developer
         */

        API.request("search","?q=" + data.author ).then(function(odata){
            var objects = odata.objects;
            var apps = [];
            if(objects.length > 0){
                for(var i = 0;i<objects.length;++i){
                    var oapp = objects[i];

                    if(oapp.name[navigator.language] != data.name[navigator.language]){
                        apps.push({
                            name:oapp.name[navigator.language],
                            rating:oapp.ratings["average"],
                            author:data.author,
                            icon:oapp.icons["64"],
                            id:oapp.id
                        });
                    }

                }


                if(objects.length > 2){
                    //TODO does this link anywhere? Modal? etc
                    $scope.more_other_apps = "View All"
                }


                $scope.other_apps = apps;
            }else{
                //TODO copy aproval
                $scope.other_apps = "No other apps by this devloper";
            }


        });



        /**
         * Get related aps
         */
        API.request("search","?q=" + data.categories[0]).then(function(data){
            console.log(data);
            var objects = data.objects;
            var relatedapps = [];
            for(var i = 0;i<4;++i){
                var oapp = objects[i];

                 relatedapps.push({
                        name:oapp.name[navigator.language],
                        rating:oapp.ratings["average"],
                        author:data.author,
                        icon:oapp.icons["64"],
                        id:oapp.id
                    });

            }

            $scope.relatedapps = relatedapps;
        });



    });//end main app details GET


    /**
     * What happens when we click on a tab trigger
     * @param e
     */
    $scope.changeTabContent = function(e){

        var content = document.querySelector("#tab-content");
        content.innerHTML = "";
        var target = e.target;
        if(e.target.tagName === "H4"){
            target = e.target.parentNode;
        }


        switch(target.getAttribute("data-tabname")){
            case "description":
                console.log($scope.description);
                content.innerHTML = $scope.description;
                break;

            case "screenshots":

                content.innerHTML = "";
                var previewWrap = document.createElement("div");
                previewWrap.className = "screenshots";

                var previews = $scope.previews;
                console.log(previews);
                for(var i = 0;i<previews.length;++i){
                    var image = new Image();
                    image.src = previews[i].thumb;
                    image.setAttribute("large",previews[i].image);
                    previewWrap.appendChild(image);


                }

                content.appendChild(previewWrap);
                break;

            case "releasenotes":
                if($scope.release_notes === null){
                    content.innerHTML = "No release notes available";
                }
                break;
        }
    };


    /**
     * Get the reviews
     */

        //pull the rating
    API.request("ratings","?app=" + id).then(function(data){
        var reviews = [];
        for(var i = 0;i<4;++i){
            var review = data.objects[i];

            review.body = $filter("LongCopyFilter")(review.body);
            reviews.push({
                copy:review.body,
                rating:review.rating,
                username:review.user.display_name
            });

            //build out the star rating now that we have a actual value
            //div(class="review-rating", starrating, data-reviewrating="{{rating}}", data-review="true")

        }
        console.log(reviews);
        $scope.reviews = reviews;
    });




}]);