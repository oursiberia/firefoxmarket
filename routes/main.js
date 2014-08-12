var express = require('express');
var fs = require("fs");
var router = express.Router();
var request = require("request");

/**
 * Possible API routes
 */
var routes = {
    //KNOWN TO WORK
    "collections":"/api/v2/feed/collections/",
    "collections_detail":"/api/v2/feed/collections/",

    //list of featured apps
    "featured":"/api/v1/fireplace/search/featured/?limit=100",

    /**============ NOTE : CORS NOT ENABLED==============*/
    //app detail
    "app_detail":"/api/v1/apps/app/"
}

/**
 * Loads the homepage / template
 */
router.get('/:name', function(req, res) {
   res.sendfile('./public/index.html');
});

router.get("/app/:id",function(req,res){
    res.sendfile('./public/index.html');
})


router.get("/marketplaceAPI/:route",function(req,res){
    var route = req.params.route;
    route = route.split(" ");

    var base = "https://marketplace.firefox.com/";

    var path = base + routes[route[0]];

    if(route.length > 1){
        if(route[1] !== "undefined"){
            path += "/" + route[1];
        }
    }

    console.log(path);

    request(path,function(error,response,body){
        if(!error && response.statusCode == 200){
            console.log(body);
            res.end(body);
        }
    })
});

/**
 * Triggers installation
 */
router.get('/install', function(req, res) {
    res.render('install', {
        title: 'Install Marketplace',
        installURL:req.protocol + "://" + req.get("host")

    });
});
module.exports = router;