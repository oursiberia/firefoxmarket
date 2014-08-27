/**
 * Controller for the Category view page
 */
app.controller("CategoryViewController",["$scope","API","$rootScope","$filter",function($scope,API,$rootScope,$filter){

    //get the category from the url
    var category = window.location.href.split("/");
    category = category[category.length - 1];

    //set the title of the category page
    var title = document.querySelector("#category-title");
    title.innerHTML = category.charAt(0).toUpperCase() + category.slice(1);


    //index of the currently featured app
    var currentIndex = 0;

    //these are the apps that will get featured
    var fapps = [];

    API.request("featured","&cat=" + category).then(function(data) {

        /**
        TODO fix this so it actually features featured apps. The DB query seems to be a little weak and returns only one result
         var apps = $filter("DesktopApps")(data.featured);

         */

        var apps = $filter("DesktopApps")(data.objects);



        //limit to 4
        for(var i = 0;i<4;++i){
            fapps.push(apps[i]);
        }

        $scope.featuredapps = fapps;

        swapApp();
    });



        /**
     * Get all the apps in this category
     */
    API.request("apps_in_category",category).then(function(data){

        var apps = $filter("DesktopApps")(data.objects);
        $scope.popularapps = apps;

        console.log(apps);

        //fade the loader
        $rootScope.loaded();
    });


    /**
     * This swaps out the featured apps
     */
    var timer = setInterval(function(){

        //swapApp();
    },2000);



    function swapApp(first){
        var selector = document.querySelector("#in-view-featured");
        var app = null;
        if(first){
            var app = fapps[0];
            currentIndex = 0;

            TweenMax.to(selector,1.5,{
                opacity:1
            });
        }else{

            TweenMax.to(selector,1,{
                opacity:0,
                onComplete:function(){
                    selector.innerHTML = "";

                    if(currentIndex < 3){
                        currentIndex++;
                    }else if(currentIndex >= 3){
                        currentIndex = 0;
                    }
                    app = fapps[currentIndex];


                    var img = new Image();
                    img.src = app.icon;

                    var h1 = document.createElement("h1");
                    var h3 = document.createElement("h3");


                    h1.innerHTML = app.name;
                    h3.innerHTML = app.author;

                    selector.appendChild(img);
                    selector.appendChild(h1);
                    selector.appendChild(h3);

                    TweenMax.to(selector,1,{
                        opacity:1
                    })
                }
            })


        }


    }

}]);