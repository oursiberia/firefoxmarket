/**
 *
 */
app.directive("backforward_buttons",["$location","$window",function($location,$window){

    //alias' to refer to common pages
    var pages = {
        HOME_PAGE:"home",
        CATEGORY_PAGE:"categories"
    };









    /**
     * Writes the current page to local storage
     * @param page
     */
    function writePage(page,previousPage){
        //take the current page and write to storage
        var url = previousPage || $location.url();
        localStorage.setItem("previousPage",url);


        //set the new page that we want to go to
        localStorage.setItem("currentPage",page);

        //navigate to new page
        $location.url(page);
    }

    /**
     * Gets the current page
     * @returns {*}
     */
    function getPage(){
        return localStorage.getItem("currentPage");
    }


    function getPreviousPage(){
        return localStorage.getItem("previousPage");
    }


    return {
        controller:function($scope){

        },

        link:function($scope,$el,$attrs){


            /**
             * What happens when we click the back button
             */
            $scope.clickBack = function(){
                $location.url(getPreviousPage());
            };

            /**
             * What happens when we click the forward button
             */
            $scope.clickForward = function(){

            };

        }
    }

}]);