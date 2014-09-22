/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:footer
 *
 * @description
 * Directive to show footer, really just used as a way to keep things neat and
 * tidy. Could move this directly into index.html if needed.
 */
app.directive("footer",function() {

    return {
        templateUrl:"/build/templates/footer.html",
        controller:function($scope) {

        },

        link:function($scope,$el,$attrs) {

            $scope.toTheHub = function(){
                //https://addons.mozilla.org/en-US/developers/
                window.open("https://addons.mozilla.org/en-US/developers/","target=_blank");
            }
        }
    }
});