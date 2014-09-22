/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:appfeedback
 *
 * @description
 * Responsible for handling and sending app feedback
 */
app.directive("appfeedback",["API",function(){

    return {
        templateUrl:"/build/templates/Feedback.html",
        controller:function($scope){

        },

        link:function($scope,$el,$attrs){

            /**
             * Sends feedback
             */
            $scope.sendFeedback = function(){

            };
        }
    };

}]);