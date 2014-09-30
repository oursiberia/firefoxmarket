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
            $scope.urisafe_author = encodeURIComponent(data.author);
            $scope.categories = data.categories;
            $scope.category = data.categories[0];
            $scope.content_ratings = data.content_ratings;
            $scope.rating = data.ratings.average;

            console.log(data);
            $scope.rating_image = AgeRatingLookup.getImage(data);

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

                        //prevent duplicate apps
                        if (oapp.name[navigator.language] != data.name[navigator.language]) {
                            //make sure to only show apps that by the same author
                           if(oapp.author === $scope.author){
                               apps.push({
                                   name:$rootScope.filterName(oapp),
                                   rating:oapp.ratings.average,
                                   author:oapp.author,
                                   purchase_type:data.premium_type.charAt(0).toUpperCase() + data.premium_type.slice(1),
                                   icon:oapp.icons["64"],
                                   id:oapp.id
                               });
                           }
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
                        name:$rootScope.filterName(oapp),
                        rating:oapp.ratings.average,
                        author:oapp.author,
                        purchase_type:oapp.premium_type.charAt(0).toUpperCase() + oapp.premium_type.slice(1),
                        icon:oapp.icons["64"],
                        manifest:oapp.manifest_url,
                        app_type:oapp.app_type,
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

            //remove active status from all triggers
            var triggers = document.getElementsByClassName("tabs")[0].children;
            console.log(triggers);
            for(var i = 0;i<3;++i){
                triggers[i].className = "tab-trigger";
            }


            /**
             * If we've clicked on the tab button but the copy node
             * for the button intercepted the click, re-reference things
             * to work on the parent node.
             */
            if (target.tagName === "H4") {
                target = e.target.parentNode;
            }

            target.className = "tab-trigger active";


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
                        }, 1000);
                    }else{
                        content.innerHTML = $scope.description;

                    }
                    break;

                case "screenshots":

                    var previewWrap = document.createElement("div");
                    previewWrap.className = "screenshots";

                    var previews = $scope.previews;

                    for(var a = 0;a<previews.length;++a){
                        var image = new Image();
                        image.src = previews[a].image;
                        image.setAttribute("large",previews[a].image);
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
            var featured_reviews = [];
            var all_reviews = [];

            //loop through the first 4 reviews
            for (var i = 0;i<4;++i) {
                var review = data.objects[i];

                //filter out especially long reviews
                review.body = $filter("LongCopyFilter")(review.body);

                //push the filtered reviews into the array stack
                featured_reviews.push({
                    copy:review.body,
                    rating:review.rating,
                    username:review.user.display_name
                });
            }

            //collect the rest of the reviews
            for (var i = 0;i<data.objects.length;++i) {
                var review = data.objects[i];

                //filter out especially long reviews
                review.body = $filter("LongCopyFilter")(review.body);

                //push the filtered reviews into the array stack
                all_reviews.push({
                    copy:review.body,
                    rating:review.rating,
                    username:review.user.display_name
                });
            }
            //set the stack on the scope
            $scope.reviews = featured_reviews;
            $scope.all_reviews = all_reviews;
        });


        var tabs = document.getElementsByClassName("tab-trigger")[0];
        $scope.changeTabContent(tabs,true);

        /**
         * Starts the app download process
         */

        /**================= DOWNLOADING/INSTALLING ==========================*/

        $scope.initPurchase = function(app_type,manifest){
            var req = "";
            /**
             * first make sure we're in Firefox.
             */
            if(navigator.userAgent.search("Firefox") === -1){
                alert("We're sorry, but apps within the Firefox Marketplace can only be downloaded from the Firefox browser");
                return;
            }

            var final_manifest = "";

            if(manifest !== undefined){
                final_manifest = manifest;
            }else{
                final_manifest = $scope.manifest;
            }


            if(app_type === "hosted") {

                req = navigator.mozApps.install(final_manifest);
            }else if(app_type === "packaged"){
                req = navigator.mozApps.installPackage(final_manifest);
            }

            req.onsuccess = function() {
                console.log("Install process initiated");
            };
            req.onerror = function() {

                console.log("Install process failed");
            };

        };

        /**================= SHAREING ====================*/
        $scope.shareApp = function(){
            var buttons = document.querySelector("#share-buttons");

            var visible = buttons.getAttribute("isVisible");

            if(visible === "true"){
                TweenMax.to(buttons,0.5,{
                    opacity:0,
                    ease:"Power3.easeInOut",
                    onComplete:function(){

                    }
                });

                buttons.setAttribute("isVisible",false);
            }else{
                TweenMax.to(buttons,0.5,{
                    opacity:1,
                    ease:"Power3.easeInOut",
                    onComplete:function(){

                    }
                });

                buttons.setAttribute("isVisible",true);
            }


        };

        /**================= FEEDBACK/REVIEW/ABUSE/PRIVACY ==========================*/
        $scope.openModal = function(modalName) {
            var box = document.querySelector(modalName);
            var token = localStorage.getItem("token");

            //if the modal is the review one, stop things here since you need to be logged in
            if (modalName === "#review") {

                if ((token === null) || (token === undefined)) {
                    alert("We're sorry but you need to be logged in in order to write a review");
                }else{
                    loadBox();
                }


            } else if ((modalName !== "#review") || (token !== null) || (token !== undefined)){
                loadBox();
            }

            function loadBox(){
                box.className = box.className.replace("closed", "");


                //lock body
                $rootScope.lockBody();

                if (box.style.opacity === "0") {
                    $rootScope.lockBody();

                    TweenMax.to(box, 0.4, {
                        opacity: 1
                    });
                }

                if (modalName === "#privacy") {
                    //get the policy
                    $http({
                        method: "GET",
                        url: "https://marketplace.firefox.com/api/v1/apps/app/" + $scope.appid + "/privacy/"
                    }).success(function (data, status, headers, config) {
                        $scope.privacy_policy = data.privacy_policy;
                    }).error(function (data, status, headers, config) {
                        console.log("A error occured when fetching the privacy policy");
                        console.log(data);

                    });
                }


                box.addEventListener("click", function (e) {
                    if (e.target.className === "modalBox") {
                        TweenMax.to(box, 0.5, {
                            opacity: 0,
                            onComplete: function () {
                                $rootScope.unlockBody();
                                box.className = "modal closed";
                            }
                        });
                    }
                });
            }
        };

        $scope.toggleCategoryTypes = function(e){
            if(e.target.tagName === "SPAN"){
                var parent = e.target.parentNode;
                var target = e.target;

                for(var i = 0; i<parent.children.length;++i){
                    parent.children[i].className = "";

                }
                var recentapps = document.querySelector(".app-reviews");
                var allreviews = document.querySelector(".review-grid");
                target.className = "active";

                switch(target.innerHTML){
                    case "Top Reviews":
                        recentapps.style.display = "block";
                        allreviews.style.display = "none";
                        break;


                    case "All Reviews":
                        recentapps.style.display = "none";
                        allreviews.style.display = "block";
                        break;
                }

            }
        };

    }]);
