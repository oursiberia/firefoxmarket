/**
 *
 * @ngdoc directive
 * @name FirefoxMarket.directive:login
 *
 * @description
 * Handles logging in of user.
 * TODO is doing it all clientside a security risk on packaged app?
 */
app.directive("login",["$http",function($http) {
    var currentUser = null;
    return {
        templateUrl:"/templates/login.html",
        controller:function($scope){

        },

        link:function($scope,$el,$attr){


            /**
             * Logs user in
             */
            $scope.login = function() {
                navigator.id.request();
            };


            /**
             * Logs user out
             */
            $scope.logout = function() {
                navigator.id.logout();
            };

            navigator.id.watch({
                loggedInUser:currentUser,

                /**
                 * Here is where we would normally do a assertation verification but might
                 * not need to since there is a API function?
                 * @param assertation{String} the assertation string based on the user's email address
                 * that gets generated for use in authentication.
                 */
                onlogin:function(assertation) {
                    //verify assertation
                    $http.post("/loginassert",{
                        assertation:assertation,
                        audience:window.location.href

                    })
                        .success(function(data,status,headers,config){
                            console.log(data);
                        })
                        .error(function(data,status,headers,config){
                            console.log("issue with verification process");
                            console.log(data);
                        });
                },


                onlogout:function() {
                    currentUser = null;
                }
            });


        }
    };

}]);