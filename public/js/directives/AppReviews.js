/**
 * @ngdoc directive
 * @name appreviews
 *
 * @description
 * This is a directive responsible for pulling and displaying a review of a
 * application.
 */
app.directive("appreviews",["API","$filter",function(API,$filter) {

    return {
        templateUrl:"/build/templates/apps/rating.html",
        link:function($scope,$el,$attr,$ctrl,$transclude) {
            var appid = $attr.appid;



            //pull the rating
            API.request("ratings","?app=" + appid).then(function(data) {
                for(var i = 0;i<data.objects.length;++i){
                    var review = data.objects[i];

                    review.body = $filter("LongCopyFilter")(review.body);

                    //set the values
                    $scope.copy = review.body;
                    $scope.rating = review.rating;
                    $scope.username = review.user.display_name;

                    //build out the star rating now that we have a actual value
                    //div(class="review-rating", starrating, data-reviewrating="{{rating}}", data-review="true")

                }

            });
        }
    }

}]);