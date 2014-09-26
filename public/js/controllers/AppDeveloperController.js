/**
 * @ngdoc controller
 * @name FirefoxMarket.controller:AppDeveloperController
 *
 * @description
 * A view to show all the applications a developer has developed.
 */

app.controller("AppDeveloperController",["$scope","API","$window",function($scope,API,$window){

    //get the app id out of the url
    var id = $window.location.href.split("/");
    id = id[id.length - 1];

    $scope.author = decodeURIComponent(id);

    API.request ("search","?q=" + decodeURIComponent(id) ).then(function(data) {
        var objects = data.objects;
        var apps = [];
            for (var i = 0; i < objects.length; ++i) {
                var oapp = objects[i];

                    if(oapp.author === decodeURIComponent(id)){
                        apps.push({
                            name: oapp.name[navigator.language],
                            rating: oapp.ratings.average,
                            author: oapp.author,
                            purchase_type: oapp.premium_type.charAt(0).toUpperCase() + oapp.premium_type.slice(1),
                            icon: oapp.icons["64"],
                            id: oapp.id
                        });
                    }
            }
        $scope.apps = apps;
    });

 }]);

