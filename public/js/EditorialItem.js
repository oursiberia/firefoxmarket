app.directive("editorialItem",function(){

    return {
        templateUrl:"/templates/editorialitem.html",
        controller:function($scope){

        },
        link:function($scope,$el,$attr){

            /**
             * Adds another slot to add another app
             */
            $scope.addNewApp = function(e){
                var target = e.target.parentNode.getElementsByClassName("section appids")[0];
                var inputs = target.getElementsByTagName("input");
                var input = document.createElement("input");
                var len = inputs.length + 1;
                input.placeholder = "Enter id " + len;
                target.appendChild(input);

            };

        }
    }

});