/**
 * Directive to show header
 */
app.directive("header",function() {

    return {
        templateUrl:"/build/templates/header.html",
        controller:function($scope) {

        },

        link:function($scope,$el,$attrs) {

        	// Returns back home
        	$scope.returnHome = function() {
        		window.location = "/";
     		}

        }

    };
});