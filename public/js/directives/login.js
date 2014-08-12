/**
 * Handles logging in of user.
 * TODO is doing it all clientside a security risk on packaged app?
 */
app.directive("login",[function(){

    return {
        templateUrl:"/templates/login.html",
        controller:function($scope){

        },

        link:function($scope,$el,$attr){



            $scope.login = function(){

            };

            $scope.logout = function(){
                
            }



        }
    }

}]);