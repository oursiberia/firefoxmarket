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
    var term = localStorage.getItem("search-term");

    $scope.search_results = data;
    $scope.metric = localStorage.getItem("search-metric");
    $scope.search_term = term;
    $rootScope.loaded();

});