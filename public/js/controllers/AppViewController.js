/**
 * @ngdoc controller
 * @name FirefoxMarket.controller:AppViewController
 *
 * @description
 * Controller for the when viewing information about a application.
 */
app.controller("AppViewController",[
    "$window",
    "API",
    "$scope",
    "$rootScope",
    "$filter",
    "AgeRatingLookup",
    function($window,API,$scope,$rootScope,$filter,AgeRatingLookup) {

        //get the app id out of the url
        var id = $window.location.href.split("/");
        id = id[id.length - 1];

        //set the appid for use in the template
        $scope.appid = id;

        //get the number of ratings
        API.request ("ratings","?app=" + id + "&limit=999999").then(function(data) {
            $scope.ratings = data.objects.length + " Reviews";
        });


        /**
         *  Grab details about the app.
         */
        API.request ("app_detail",id + "/").then(function(data) {
            $scope.author = data.author;
            $scope.categories = data.categories;
            $scope.category = data.categories[0];
            $scope.content_ratings = data.content_ratings;
            $scope.rating = data.content_ratings.rating;

            $scope.rating_image = AgeRatingLookup.getImage(data);


            $scope.name = data.name[navigator.language];

            //set the main icon to be used
            $scope.icon = data.icons["128"];

            //parse out previews
            var previews = [];
            for (var i = 0;i<data.previews.length;++i) {
                var preview = {
                    image:data.previews[i].image_url,
                    thumb:data.previews[i].thumbnail_url
                };

                previews.push(preview);
            }

            //set the description
            $scope.description = data.description[navigator.language];

            //set the preview images
            $scope.previews = previews;

            //TODO come up with actual page or modal for privacy policy
            $scope.privacy = "http://marketplace.firefox.com" + data.privacy_policy;


            //support stuff;
            $scope.support_email = data.support_email[navigator.language];

            //TODO Get people who don't have Support URLs set to add em.
            $scope.support_url = data.support_url[navigator.language];


            $scope.purchase_type = data.premium_type.charAt(0).toUpperCase() + data.premium_type.slice(1);

            //versions of the app published.
            $scope.versions = data.versions;

            //release notes
            $scope.release_notes = data.release_notes;

            //used to trigger download
            $scope.manifest = data.manifest_url;
            $scope.package_path = data.package_path;

            //if the content has been loaded, trigger the hiding of the loading indicator
            $rootScope.loaded();

            $scope.app_type = data.app_type;


            /**
             * Search for other apps by the developer
             */

            API.request ("search","?q=" + data.author ).then(function(odata) {
                var objects = odata.objects;
                var apps = [];

                if ((objects.length > 0)  && (apps.length < 2)){
                    for(var i = 0;i<objects.length;++i){
                        var oapp = objects[i];

                        if (oapp.name[navigator.language] != data.name[navigator.language]) {
                            apps.push({
                                name:oapp.name[navigator.language],
                                rating:oapp.ratings.average,
                                author:data.author,
                                purchase_type:data.premium_type.charAt(0).toUpperCase() + data.premium_type.slice(1),
                                icon:oapp.icons["64"],
                                id:oapp.id
                            });
                        }

                    }


                    if (objects.length > 2) {
                        //TODO does this link anywhere? Modal? etc
                        $scope.more_other_apps = "View All \u25B8";
                    }


                    $scope.other_apps = apps;
                } else {
                    //TODO copy aproval
                    $scope.other_apps = false;
                }


            });



            /**
             * Get related apps
             */
            API.request ("search","?q=" + data.categories[0]).then(function(data) {

                var objects = data.objects;
                var relatedapps = [];

                for(var i = 0;i<4;++i){
                    var oapp = objects[i];
                    relatedapps.push({
                        name:oapp.name[navigator.language],
                        rating:oapp.ratings.average,
                        author:oapp.author,
                        icon:oapp.icons["64"],
                        id:oapp.id
                    });

                }

                $scope.relatedapps = relatedapps;
            });



    });//end main app details GET


        /**
         * Controls the tabbed content for the App view
         * @param e{Event} the click event that happens when you click on a tab button
         */
        $scope.changeTabContent = function(e,eventFalse) {

            //alias the content section for the panel.
            var content = document.querySelector("#tab-content");

            //clear the current content
            content.innerHTML = "";

            //re-alias the target for ease of use
            var target = null;

            if(eventFalse === true){
                target = e;
            }else{
                target = e.target;
            }


            /**
             * If we've clicked on the tab button but the copy node
             * for the button intercepted the click, re-reference things
             * to work on the parent node.
             */
            if (target.tagName === "H4") {
                target = e.target.parentNode;
            }


            /**
             * Go through, figure out the button we clicked on and react
             * appropriately.
             */
            switch (target.getAttribute("data-tabname")) {
                case "description":

                    if(eventFalse){
                        var s = setInterval(function(){
                            if($scope.description !== undefined){
                                content.innerHTML = $scope.description;
                                clearInterval(s);
                            }
                        }, 1000)
                    }else{
                        content.innerHTML = $scope.description;

                    }
                    break;

                case "screenshots":

                    var previewWrap = document.createElement("div");
                    previewWrap.className = "screenshots";

                    var previews = $scope.previews;

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
        API.request ("ratings","?app=" + id).then(function(data) {
            var reviews = [];

            //loop through the first 4 reviews
            for (var i = 0;i<4;++i) {
                var review = data.objects[i];

                //filter out especially long reviews
                review.body = $filter("LongCopyFilter")(review.body);

                //push the filtered reviews into the array stack
                reviews.push({
                    copy:review.body,
                    rating:review.rating,
                    username:review.user.display_name
                });
            }
            //set the stack on the scope
            $scope.reviews = reviews;
        });


        var tabs = document.getElementsByClassName("tab-trigger")[0];
        $scope.changeTabContent(tabs,true);

        /**
         * Starts the app download process
         */


        $scope.initPurchase = function(app_type){
            console.log("clicked");
            /**
             * first make sure we're in Firefox.
             */
            if(navigator.userAgent.search("Firefox") === -1){
                alert("We're sorry, but apps within the Firefox Marketplace can only be downloaded from the Firefox browser");
                return;
            }

            switch(app_type){
                case "hosted":
                    var req = navigator.mozApps.install($scope.manifest);

                    break;

                case "packaged":
                    var req = navigator.mozApps.installPackage($scope.manifest);
                    break;
            }


            req.onsuccess = function() {

            };
            req.onerror = function() {

            };

        };


}]);