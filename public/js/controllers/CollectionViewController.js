app.controller("CollectionViewController",["$scope","API",function($scope,API){

    //get the app collection out of the url
    var collection = window.location.href.split("/");
    collection = collection[collection.length - 1];




    API.request("collections").then(function(data){
        var collections = [];
        var len = data.objects.length;

        for(var i = 0;i<len;++i){
            var collection = data.objects[i];

            var obj = {
                name:collection.name[navigator.language],
                id: collection.id,
                description:collection.name[navigator.language],
                background:collection.background_color,
                slug:collection.slug,
                url:collection.url
            }

            //if there is a background image, lets add that
            if(collection.background_image !== null){
                obj["background_image"] = collection.background_image;
            }

            collections.push(obj);
        }

        $scope.collections = collections;



    });

}]);