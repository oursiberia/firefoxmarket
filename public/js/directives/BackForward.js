/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:uicontrols
 *
 * @description
 * Responsible for displaying and creating user interface elements.
 */


app.directive("uicontrols",[
    "$location",
    "$window",function($location,$window){

    return {
        templateUrl:"/build/templates/buttons.html",
        controller:function($scope) {},
        link:function($scope,$el,$attrs) {
            /**
             * What happens when we click the back button
             */
            $scope.clickBack = function() {
                $window.history.back();
            };

            /**
             * What happens when we click the forward button
             */
            $scope.clickForward = function() {
                $window.history.forward();
            };

        }
    };

}]);