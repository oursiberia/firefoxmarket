/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:appreview
 *
 * @description
 * This handles making the modal for reviewers to submit a review and submittings.
 * Note : user needs to be logged in in order for this to trigger
 */
app.directive("appreview",["$http",function($http){

    return {
        templateUrl:"/build/templates/Review.html",
        controller:function($scope){

        },

        link:function($scope,$el,$attrs){
            //get the app id out of the url
            var id = window.location.href.split("/");
            id = id[id.length - 1];

            $scope.name = $attrs.name;


            $scope.submitReview = function(){
                var content = $el[0].querySelector("textarea");
                var rating = $el[0].querySelector("input").value;

                rating = parseInt(rating);
                if((rating > 5) || (isNaN(rating))){
                    rating = 5;
                }

                console.log(parseInt(id));
                var data = {
                    app:parseInt(id),
                    body:content.value,
                    rating:rating
                };

                $http({
                    method:"post",
                    url:"https://marketplace.firefox.com/api/v1/apps/rating/",
                    data:data
                }).success(function(){
                    console.log("success");
                }).error(function(){
                    console.log("something went wrong");
                });
            };
        }
    };


}]);