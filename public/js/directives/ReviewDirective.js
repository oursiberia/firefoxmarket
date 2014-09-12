/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:appreview
 *
 * @description
 * This handles making the modal for reviewers to submit a review and submittings.
 * Note : user needs to be logged in in order for this to trigger
 */
app.directive("appreview",["API",function(){

    return {
        templateUrl:"/build/templates/Review.html",
        controller:function($scope){

        },

        link:function($scope,$el,$attrs){

        }
    }


}]);