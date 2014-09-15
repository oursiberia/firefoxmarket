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
    "$http",
    function($window,API,$scope,$rootScope,$filter,AgeRatingLookup,$http) {

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
            console.log(data);

            $scope.name = data.name[navigator.language];
            $scope.version = data.current_version;

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
            if(data.support_url[navigator.language] !== ""){
                $scope.support_url = data.support_url[navigator.language];
            }else{
                $scope.support_url = false;
            }


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
                        purchase_type:oapp.premium_type.charAt(0).toUpperCase() + oapp.premium_type.slice(1),
                        icon:oapp.icons["64"],
                        id:oapp.id
                    });

                }

                $scope.relatedapps = relatedapps;
            });



    });//end main app details GET


        /**================= TABS ==========================*/
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
                        image.src = previews[i].image;
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


        /**================= APP REVIEWS ==========================*/
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

        /**================= DOWNLOADING/INSTALLING ==========================*/

        $scope.initPurchase = function(app_type){

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
                console.log("Install process initiated");
            };
            req.onerror = function() {
                console.log("Install process failed");
            };

        };

        /**================= FEEDBACK/REVIEW/ABUSE/PRIVACY ==========================*/
        $scope.sendFeedback = function(){
            var box = document.querySelector("#feedback");
            box.className = box.className.replace("closed","");

            //lock body
            document.getElementsByTagName("html")[0].style.overflow = "hidden";


            box.addEventListener("click",function(){

                TweenMax.to(box,0.5,{
                    opacity:0,
                    onComplete:function(){
                        document.getElementsByTagName("html")[0].style.overflow = "scroll";
                        box.className = "modal closed";
                    }
                })
            });
        };

        $scope.writeReview = function(){
            /**
             * If we're not signed in, theres no point, flash message and stop running
             * function
             */
            if(localStorage.getItem("loggedIn") !== "true"){
                alert("you must be logged in to write a review");
                return;
            }
            var box = document.querySelector("#review");
            box.className = box.className.replace("closed","");


            box.addEventListener("click",function(){

                TweenMax.to(box,0.5,{
                    opacity:0,
                    onComplete:function(){
                        document.getElementsByTagName("html")[0].style.overflow = "scroll";
                        box.className = "modal closed";
                    }
                })
            });

            //lock body
            document.getElementsByTagName("html")[0].style.overflow = "hidden";

        };

        $scope.reportAbuse = function(){
            var box = document.querySelector("#abused");
            box.className = box.className.replace("closed","");


            //lock body
            document.getElementsByTagName("html")[0].style.overflow = "hidden";


            box.addEventListener("click",function(){

                TweenMax.to(box,0.5,{
                    opacity:0,
                    onComplete:function(){
                        document.getElementsByTagName("html")[0].style.overflow = "scroll";
                        box.className = "modal closed";
                    }
                })
            });
        };

        $scope.showPrivacyPolicy = function(){
            var box = document.querySelector("#privacy");
            box.className = box.className.replace("closed","");

            //lock body
            document.getElementsByTagName("html")[0].style.overflow = "hidden";

            box.addEventListener("click",function(){

                TweenMax.to(box,0.5,{
                    opacity:0,
                    onComplete:function(){
                        document.getElementsByTagName("html")[0].style.overflow = "scroll";
                        box.className = "modal closed";
                    }
                })
            });

            //get the policy
            $http({
                method:"GET",
                url:"https://marketplace.firefox.com/api/v1/apps/app/"+ $scope.appid + "/privacy/"
            }).success(function(data,status,headers,config){
                $scope.privacy_policy = data.privacy_policy;
            }).error(function(data,status,headers,config){
                console.log("A error occured when fetching the privacy policy");
                console.log(data);
            })
        };


    }]);
