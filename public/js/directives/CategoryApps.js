/**
 *  Deals with fetching, then displaying apps within categories.
 *  The category to search for should be specified as a data attribute using the name
 *  data-categoryname
 */
app.directive("categoryapps",["API",function(API){
    return{
       templateUrl:"/build/templates/apps/categoryapps.html",
        link:function($scope,$el,$attrs){
            var categoryname = $attrs.categoryname;
            var limit = $attrs.limit || 5;

            //run a search
            var params = "?cat=" + categoryname;
            API.request("search",params).then(function(data){
                var apps = data.objects;
                var shown_apps = [];

                //get a list of all the categories currently being shown
                var names = document.getElementsByClassName("category-title");

                /**
                 * Currently, when attempting to utilize the desktopApps filter,
                 * empty arrays get passed in. On top of which, there don't always seem
                 * to be enough desktop apps for each category. For now, just grab everything.
                 *
                 * TODO Add filtering for desktop apps once there are enough also, figure out why filter isn't working
                 */
                for(var i = 0;i<limit;++i){
                    var app = apps[i];
                    shown_apps.push({
                        icon:app.icons["64"],
                        id:app.id,
                        category_name:app.categories,
                        author:app.author,
                        rating:app.ratings["average"]
                    });

                }

                $scope.capps = shown_apps;

            });
        }
    }
}]);