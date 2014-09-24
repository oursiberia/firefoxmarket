/**
 * @ngdoc controller
 * @name FirefoxMarket.controller:AllCategoriesController
 *
 * @description
 * Controller for viewing all of the possible categories
 */
app.controller("AllCategoriesController",["API","$rootScope","$scope",function(API,$rootScope,$scope){



    API.request("categories").then(function(data){
        var categories = data.objects;


        for(var i = 0;i<categories.length;++i){
            var category = categories[i];
            API.request("search","?cat=" + category.slug).then(function(data){



            });
        }


        $scope.appcategories = categories;

        $rootScope.loaded(function() {
            var parent = document.getElementById("HOME");
            angular.element(parent).removeClass("ajax");
        });
    });


}]);
