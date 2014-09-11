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
        query:function(_$scope){
            $scope = _$scope;
            //get the search term;
            var term = window.document.querySelector("#homesearch");

            /**
             * if theres no search term, reject search attempt.
             */
            if(term.value === ""){
                console.log("no search term entered");
                // alert("please enter a search term");
                return false;
            }else{
                query = term.value;
            }

            //query api
            $http({
                method:"GET",
                url:"https://marketplace.firefox.com/api/v1/apps/search/?q=" + term.value + "&device=desktop"
            }).success(function(data, status, headers, config){

                //need to filter out unecessary content, make new array
                var results = [];

                var author_results = API.filter(API.parseDeveloper(data.objects));
                var name_results = API.filter(API.parseName(data.objects));
                var category_results = API.filter(API.parseCategories(data.objects));
                var description_results = API.filter(API.parseDescriptions(data.objects));

                console.log(author_results);
                //set to the scope
                $scope.author_results = author_results;
                $scope.name_results = name_results;
                $scope.category_results = category_results;
                $scope.description_results = description_results;



            }).error(function(data, status, headers, config) {
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
                if(app.author.toLowerCase().search(query.toLowerCase()) !== -1){
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

                //pull name
           ;
                /**
                 * Some applications currently don't have the name of the application
                 * in all possible languages. If we run into a situation where we
                 * we don't have a application name in the user's language, just reject
                 * that application outright. Otherwise we continue parsing.
                 */

                if(app.name.hasOwnProperty(navigator.language)){
                    if(app.name[navigator.language].match("Games")){
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


        parseDescriptions:function(){
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

            var newset = []
            for(var i = 0;i<len;++i){
                var app = appset[i];

                app.name = app.name[navigator.language];
                app.icon = app.icons["64"];
                app.ratings = app.ratings.average;

                newset.push(app);
            }

            return newset;
        }

    };




    return API;
});