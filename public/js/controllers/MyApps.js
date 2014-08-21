/**
 * For the app listing page
 */
app.controller("MyApps",function(){

    //get apps that are installed.
    var r = navigator.mozApps.getInstalled();

    /** TODO api endpoint for login still doesn't have CORS enabled */
});