/**
 * @ngdoc controller
 * @name FirefoxMarket.controller:SearchResults
 *
 * @description
 * a controller for displaying the results of a search
 */
app.controller("SearchResults",function($scope,$rootScope){

    //get the data to show
    var data = JSON.parse(localStorage.getItem("search-results"));
    console.log(data);
    $scope.search_results = data;

    $rootScope.loaded();


});