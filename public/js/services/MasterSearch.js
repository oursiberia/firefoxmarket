/**
 * @ngdoc service
 * @name FirefoxMarket.service:MasterSearch
 *
 * @description
 * This is the service that pings the API when it comes to search and filters
 *
 */
app.factory("MasterSearch",function($http){

    var query = "";
    var $scope = null;
    var API = {
        search:function(){
            TweenMax.to(document.getElementById("searchresults"),1,{
                top:0,
                ease:"Power3.easeInOut",
                onComplete:function() {
                    $rootScope.lockBody();
                }
            });
        },

        /**
         * Runs a query against the API.
         * @param $scope the scope to attach the end result to.
         * @returns {boolean}
         */
        query:function(_$scope,term,limit){
            //reference to search field.
            var results = document.getElementsByClassName("resultsbyname")[0];
            var close = document.getElementsByClassName("close-search")[0];

            $scope = _$scope;
            if(term === undefined){
                //get the search term;
                term = window.document.querySelector("#homesearch") || window.document.querySelector("#search");

                /**
                 * if theres no search term, reject search attempt.
                 */
                if(term.value === ""){
                    console.log("no search term entered");

                    //hide the results list if there is no search input
                    results.style.display = "none";
                    close.style.display = "none";
                    return false;
                }else{
                    query = term.value;

                    //show the results list
                    results.style.display = "block";
                    close.style.display = "block";
                }
            }

            //query api
            $http({
                method:"GET",
                url:"https://marketplace.firefox.com/api/v1/apps/search/?q=" + query //+ "&device=desktop"
            }).success(function(data, status, headers, config){


                //need to filter out unecessary content, make new array
                var results = [];

                var author_results = API.filter(API.parseDeveloper(data.objects));
                var name_results = API.filter(API.parseName(data.objects));
                var category_results = API.filter(API.parseCategories(data.objects));
                var description_results = API.filter(API.parseDescriptions(data.objects));



                //set to the scope
                $scope.author_results = author_results;
                $scope.name_results = name_results;
                $scope.category_results = category_results;
                $scope.description_results = description_results;


            }).error(function(data, status, headers, config) {
                console.log(data);
                console.error("Something went wrong with the search");
            });

        },

        /**
         * Parses out the applications to see if the query matches the developer name.
         * @param{Array} appset the apps to look through;
         * @returns {Array}
         */
        parseDeveloper:function(appset){
            //get the number of objects
            var len = appset.length;

            //prepare new array to return
            var newset = [];

            //loop through apps to figure out if there is a author match
            for(var i = 0;i<len;++i){
                var app = appset[i];

                //just to make sure, convert both to lowercase and search for the query in the author name
                if(app.author.toLowerCase().search(query) !== -1){
                    newset.push(app);
                }
            }

            return newset;
        },

        /**
         * Compares the query with the name of the application.
         * If theres at least 5 characters(or less) matching then we consider it a hit.
         * @param appset
         */
        parseName:function(appset){
            //get the number of objects
            var len = appset.length;

            //prepare new array to return
            var newset = [];

            //loop through apps to figure out if there is a author match
            for(var i = 0;i<len;++i){
                var app = appset[i];

                /**
                 * Some applications currently don't have the name of the application
                 * in all possible languages. If we run into a situation where we
                 * we don't have a application name in the user's language, just reject
                 * that application outright. Otherwise we continue parsing.
                 */

                if(app.name.hasOwnProperty(navigator.language)){
                    if(app.name[navigator.language].search(query)){
                        newset.push(app);
                    }
                }
            }

            return newset;
        },


        /**
         * Parses app information to see if app category matches query
         * @param appset
         * @returns {Array}
         */
        parseCategories:function(appset){
            //get the number of objects
            var len = appset.length;

            //prepare new array to return
            var newset = [];

            //loop through apps to figure out if there is a author match
            for(var i = 0;i<len;++i){
                var app = appset[i];

                for(var a = 0;a<app.categories.length;++a){
                    if(app.categories[a].match(query)){
                        newset.push(app);
                    }
                }



            }

            return newset;
        },


        parseDescriptions:function(appset){
            //get the number of objects
            var len = appset.length;

            //prepare new array to return
            var newset = [];

            //loop through apps to figure out if there is a match in the description
            for(var i = 0;i<len;++i){
                var app = appset[i];

                if(app.description.hasOwnProperty(navigator.language)){
                    var description = app.description[navigator.language];
                    if(description.match(query)){
                        newset.push(app);
                    }
                }


            }

            return newset;
        },

        /**=================== UTILS ===================*/
        /**
         * This filters things out so that it makes things easier to
         * work within a angular template, example, for languages, it sets it
         * so that the language is parsed out and not a part of a object.
         * @param appset
         */
        filter:function(appset){
            var len = appset.length;

            var newset = [];
            for(var i = 0;i<len-1;++i){
                var app = appset[i];

                var name = app.name[navigator.language];
                var icon = app.icons["64"];
                var ratings = app.ratings.average;
                var id = app.id;
                newset.push({
                    name:name,
                    icon:icon,
                    id:id,
                    author:app.author,
                    rating:ratings
                });
            }

            return newset;
        }

    };




    return API;
});