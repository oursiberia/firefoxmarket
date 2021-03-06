/**
 * the main initialization file for the app.
 */

var app = angular.module("FirefoxMarket",[
    "ui.router",
    "LocalStorageModule"
]);

app.config(function($stateProvider,$urlRouterProvider,$locationProvider,$httpProvider) {
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);

    //Enable cross domain calls
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    /**
     * Home page
     */
    $stateProvider.state("home",{
        url:"/",
        templateUrl:"/build/templates/home.html",
        onEnter:function(){
            document.querySelector("#searchbutton").style.display = "none";
        },
        onExit:function(){
            document.querySelector("#searchbutton").style.display = "inline-block";
        }
    });

    /**
     * All category page
     */
    $stateProvider.state("categories",{
        url:"/categories",
        templateUrl:"/build/templates/categories.html",
        controller:"AllCategoriesController"
    });

    /**
     * Search results page
     */
    $stateProvider.state("SearchResults",{
        url:"/searchresults/:name",
        templateUrl:function(urlattr){
            return "/build/templates/searchresults.html";
        },
        controller:"SearchResults"
    });

    /**
     * 404 page
     */
    $stateProvider.state("AppNotFound",{
        url:"/app/notfound",
        templateUrl:"/templates/apps/404.jade"
    });

    /**
     * Detail view of the app
     */
    $stateProvider.state("AppView",{
        url:"/app/:name",
        templateUrl:function(urlattr){
            return "/build/templates/apps/appview.html";
        },
        controller:"AppViewController"
    });

    /**
     * TODO decide what this ought to do? Was thinking it'd just show all the categories
     */
    $stateProvider.state("CategoryView",{
        url:"/category/:name",
        templateUrl:function(urlattr){
            return "/build/templates/apps/catview.html";
        },
        controller:"CategoryViewController"
    });


    /**
     * View to see a list of all the apps a developer has made
     */
    $stateProvider.state("AppDeveloperView",{
        url:"/developer/:name",
        templateUrl:function(urlattr){
            return "/build/templates/apps/appDevView.html";
        },
        controller:"AppDeveloperController"
    });

    delete $httpProvider.defaults.headers.common["X-Requested-Width"];
});


app.controller("main",function($window,$rootScope,API,localStorageService,$http,$scope) {
    $rootScope.menuOpen = false;


    //height the menu can expand to
    var MENU_HEIGHT = 240;
    /////////////// LOGIN ////////////////////////

    /**
     * Check to see if the user is logged in
     */
    if (localStorageService.get("loggedin")) {
        var val = localStorageService.get("loggedin");
        $rootScope.loggedin = true;
    }

    /**
     * Starts the login process.
     */
    $scope.login = function() {
        navigator.id.request();
    }; //end login


    /**
     * Check to see if user has logged in by checking localStorage.
     * Make sure userdata loads if they are.
     * Within a setInterval so templates have time to load
     */
    var s = setInterval(function(){
        var username = document.querySelector("#username");

        if(username !== null){
            if((localStorage.getItem("username") !== null)&&(localStorage.getItem("username") !== undefined)){
                console.log("user is logged in",localStorage.getItem("username") );
                username.innerHTML = localStorage.getItem("username");
            }else{
                console.log("user is not logged in");
            }
            clearInterval(s);
        }

    },100);

    navigator.id.watch({
        loggedInUser:"",

        onlogin:function(assertation) {

            //TODO change to angular method?
            $.post("https://marketplace.firefox.com/api/v1/account/login/",{
                assertion:assertation,
                audience: window.location.origin
            },function(data) {
                $rootScope.USER = data;

                var username = document.querySelector("#username");

                TweenMax.to(username,1,{
                    opacity:0,
                    onComplete:function(){
                        //change the username
                        console.log("Username is :",data.settings.display_name);
                        username.innerHTML = data.settings.display_name;

                        /**
                         * Need to store the data in localStorage.
                         * Note - all values that haven't been defined within Persona
                         * show up as undefined
                         */
                        localStorage.setItem("username",data.settings.display_name);
                        localStorage.setItem("email",data.settings.email);
                        localStorage.setItem("token",data.token);
                        localStorage.setItem("installed_apps",data.apps.installed);
                        localStorage.setItem("purchased_apps",data.apps.purchaed);
                        localStorage.setItem("developed_apps",data.apps.developed);

                        for(var i in data.permissions){
                            localStorage.setItem(i,data[i]);
                        }

                        TweenMax.to(username,1, {
                            opacity: 1
                        });
                    }
                });


            });
        },
        onlogout:function(){
            $rootScope.USER = null;
        }
    });
    /////////////// END LOGIN ////////////////////////
    /**
     * This hides the loader once content has been loaded.
     * @param delay
     */
    $rootScope.loaded = function(callback){

        //get rid of the loader
        TweenMax.to(document.querySelector("#loader"),0.2,{
            opacity:0,
            onComplete:function(){
                if(callback){
                    callback();
                }
            }
        });


    };

    /**
     * opens the user menu
     */
    $rootScope.openMenu = function(e){
        // if(localStorageService.getItem("loggedin") != "true"){
        var burger = document.querySelector("#menu-trigger");
        var el = 0;
        var menu = 0;
        if($rootScope.menuOpen === false){

            TweenMax.to(burger.children[0],0.5,{
                transform:"rotateZ(45deg)",
                marginTop:5 + "px",
                ease:"Power3.easeInOut"
            });

            TweenMax.to(burger.children[2],0.5,{
                opacity:0,
                ease:"Power3.easeInOut"
            });

            TweenMax.to(burger.children[1],0.5,{
                transform:"rotateZ(-45deg)",
                marginTop:-6 + "px",
                ease:"Power3.easeInOut"
            });


            menu = document.querySelector("#user-details");
            menu.className = "open";
            TweenMax.to(menu,1,{
                height:MENU_HEIGHT
            });

            $rootScope.menuOpen = true;
        }else{


            TweenMax.to(burger.children[0],0.5,{
                transform:"rotateZ(0deg)",
                marginTop:0 + "px",
                ease:"Power3.easeInOut"
            });

            TweenMax.to(burger.children[2],0.5,{
                opacity:1,
                ease:"Power3.easeInOut"
            });

            TweenMax.to(burger.children[1],0.5,{
                transform:"rotateZ(0deg)",
                marginTop:0 + "px",
                ease:"Power3.easeInOut"
            });

            menu = document.querySelector("#user-details");
            menu.className = "";
            TweenMax.to(menu,1,{
                height:45,
                ease:"Power3.easeInOut"
            });


            $rootScope.menuOpen = false;

        }
    };

    /**
     * For some things, like bringing down the search pane,
     * we need to prevent scrolling
     */
    $rootScope.lockBody = function(){
        console.log("body locked");

        TweenMax.to(window,0.5,{
            scrollTo:{
                y:0
            },
            ease:"Power3.easeInOut"

        });
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
    };

    /**
     * Re-enables scrolling
     */
    $rootScope.unlockBody = function(){
        document.getElementsByTagName("html")[0].style.overflow = "scroll";
    };


    /**
     * Filters a app's possible names so that a name for the application will show up
     * if a translation in the specified locale isn't available.
     * @param app the app object
     * @returns {string} the name of the application
     */
    $rootScope.filterName = function(app){

        var name = "";
        /**
         * Save out the name. If there isn't something specified
         * for the language set in the browser, just loop
         * through the list of available languages and take the last one.
         */
        if(app.name.hasOwnProperty(navigator.language)){
            name = app.name[navigator.language];
        }else{
            for(var z in app.name){
                name = app.name[z];
            }
        }

        return name;

    };


    /**
     * Initiates the install process
     * @param app_type the type of app we're trying to download ("hosted" or "packaged")
     * @param manifest the url to the manifest for download.
     * @param appname the name of the app so we can use it in the message
     */
    $rootScope.initPurchase = function(app_type,manifest,appname,icon){
        console.log("CALLING");
        var req = "";
        /**
         * first make sure we're in Firefox.
         */
        if(navigator.userAgent.search("Firefox") === -1){
            alert("We're sorry, but apps within the Firefox Marketplace can only be downloaded from the Firefox browser");
            return;
        }
        console.log(app_type,manifest,appname,icon);
        var final_manifest = "";

        if(manifest !== undefined){
            final_manifest = manifest;
        }else{
            final_manifest = $scope.manifest;
        }


        if(app_type === "hosted") {
            console.log("installing as hosted app")
            req = navigator.mozApps.install(final_manifest);
        }else if(app_type === "packaged"){
            console.log("installing as packaged app")
            req = navigator.mozApps.installPackage(final_manifest);
        }else if(app_type === "privileged"){
            console.log("privialied or some other new type")
            req = navigator.mozApps.installPackage(final_manifest);
        }else{
            req = navigator.mozApps.install(final_manifest);
        }

        req.onsuccess = function() {
            console.log("Install process initiated");
            notifyMe(appname + " was installed")
        };
        req.onerror = function(e) {

            console.log("Install process failed");
            console.log(this.error.name);
            console.log(e);
            notifyMe("The was a error with the installation process :" + this.error.name);
        };


        function notifyMe(message) {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                alert(message);
            }

            // Let's check if the user is okay to get some notification
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                var notification = new Notification("Firefox Market",{
                    icon:icon,
                    body:message
                });
            }

            // Otherwise, we need to ask the user for permission
            // Note, Chrome does not implement the permission static property
            // So we have to check for NOT 'denied' instead of 'default'
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {
                    // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === "granted") {
                        var notification = new Notification("Firefox Market",{
                            body:message,
                            icon:icon
                        });
                    }
                });
            }

            // At last, if the user already denied any notification, and you
            // want to be respectful there is no need to bother them any more.
        }

    };


});