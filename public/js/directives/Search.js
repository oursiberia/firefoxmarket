
app.directive("appsearch",["$http",function($http){

    return {
        templateUrl:"/templates/searchbox.html",
        controller:function($scope,$http){


        },

        link:function($scope,$el,$attrs){


            /**
             * Run the query.
             * search docs here http://firefox-marketplace-api.readthedocs.org/en/latest/topics/search.html
             */
            $scope.searchApp = function(){

                //get the search term;
                var term = document.getElementById("searchterm");

                /**
                 * if theres no search term, reject search attempt.
                 */
                if(term.value == ""){
                    console.log("no search term entered");
                   // alert("please enter a search term");
                    return false;
                }

                //query api
                $http({
                    method:"GET",
                    url:"https://marketplace.firefox.com/api/v1/apps/search/?q=" + term.value + "&device=desktop"
                }).success(function(data, status, headers, config){

                    //need to filter out unecessary content, make new array
                    var results = [];

                    //get the length
                    var len = data.objects.length;

                    //loop through an get all the elements we needed
                    for(var i = 0;i<len;++i){
                        var obj = data.objects[i];

                        //make a new object
                        var newobj = {
                            name:obj.name[navigator.language],
                            icon:obj.icons["64"],
                            id:obj.id
                        };

                        results.push(newobj);
                    }

                    //set to the scope
                    $scope.results = results;


                }).error(function(data, status, headers, config){
                    console.error("Something went wrong with the search");
                })

            }
        }
    }


}]);