var app = angular.module("EditorialGenerator",[
    "ui.router",
    "LocalStorageModule"
]);


app.controller("main",function($scope,$compile,$http) {


    /**
     * Adds a new item to the number of bits you cna add
     */
    $scope.addItem = function(){
        //get hte number of items
        var items = document.getElementsByClassName("editorial-item");


        var template = document.createElement("div");
        template.setAttribute("editorial-item","");
        template.setAttribute("data-index",items.length + 1);
        template.className = "editorial-item";

        var newDirective = angular.element(template);

        var container = document.getElementById("editorial-bits");
        newDirective.appendTo(container);
        $compile(newDirective)($scope);



    };


    $scope.compile= function(){
        buildJSON();
    };

    function buildJSON(){

            //get the number of entry boxes
            var entries = document.getElementsByClassName("editorial-category");
            var build = [];

            for(var i = 0;i<entries.length;++i){
                var obj = {};
                var item = entries[i];
                var title = item.children[0].children[1].value;
                var copy = item.children[1].children[1].value;
                var appid = item.children[2];


                obj["title"] = title;
                obj["copy"] = copy;
                obj["apps"] = [];

                var ids = item.children[2].getElementsByTagName("input");
                for (var a = 0;a<ids.length;++a){
                    obj["apps"].push(ids[a].value);
                }

                build.push(obj);
            };

        var req = $http({
            method:"post",
            url:"/saveeditorial",
            data:build
        });

        req.success(function(data,status,headers,config){
            console.log(data);
        });

        req.error(function(data,status,headers,config){
            console.log(data);
        });
            

    }
});

