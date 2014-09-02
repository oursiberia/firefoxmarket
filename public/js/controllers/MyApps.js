/**
 * For User page. Lists apps currently used.
 */
app.controller("MyApps",function(){

    //get apps that are installed.
    var r = navigator.mozApps.getInstalled();

});