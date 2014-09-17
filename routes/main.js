var express = require('express');
var fs = require("fs");
var router = express.Router();
var request = require("request");
var https = require("https");

/**
 * Possible API routes
 */
var routes = {
    //KNOWN TO WORK
    "collections":"/api/v2/feed/collections/",
    "collections_detail":"/api/v2/feed/collections/",

    //list of featured apps
    "featured":"/api/v1/fireplace/search/featured/?limit=100",
    "apps_in_category":"/api/v1/apps/search/?cat=",
    /**============ NOTE : CORS NOT ENABLED==============*/
    //app detail
    "app_detail":"/api/v1/apps/app/",
    "marketplace_login":"/api/v1/account/login",

    //note url for category api will be moving.
    "categories":"/api/v1/apps/category"

}


/**
 * Triggers installation
 */
router.get('/install', function(req, res) {
    res.render('install', {
        title: 'Install Marketplace',
        installURL:req.protocol + "://" + req.get("host")

    });
});

router.get("/manifest.webapp",function(req,res){
    fs.readFile("./public/manifest.webapp",function(err,data){
       res.end(new Buffer(data).toString());
    });
});

/**
 * Path to the part where you can generate editorial
 * json
 */
router.get("/editorial",function(req,res){
    res.render("editorial",{});
});

/**
 * Saves the editorial as JSON
 */
router.post("/saveeditorial",function(req,res){
    var body = req.body;

    fs.writeFile("./public/editorial.json",JSON.stringify(body),function(err){
        if(err){
            console.log(err);
        }

        res.end("Saved!");
    });

});

/**
 * Loads the homepage / template
 */
router.get("/app/:id",function(req,res){
    res.sendfile('./public/index.html');
});

router.get("/category/:id",function(req,res){
    res.sendfile('./public/index.html');
});

router.get("/collection/:name",function(req,res){

    res.sendfile('./public/index.html');
});



router.get('/:name', function(req, res) {
    res.sendfile('./public/index.html');
});






router.post("/loginassert",function(req,res){
    var assertation = req.body.assertation;
    var audience = req.body.audience;
    var base = "https://marketplace.firefox.com/";

    var options = {
        host:"marketplace.firefox.com",
        path:routes["marketplace_login"],
        method:"POST",
        form:{
            assertation:assertation,
            audience:audience
        }
    };

    console.log(options.host + options.path);
    var req = https.request(options,function(response){
        var chunk = "";

        response.on("data",function(str){
            chunk += str;
        });

        response.on("end",function(){
            console.log(chunk);

        });
    });



    req.end();


});

router.get("/marketplaceAPI/:route",function(req,res){
    var route = req.params.route;
    route = route.split(" ");


    var base = "https://marketplace.firefox.com/";

    var path = base + routes[route[0]];



    console.log("running" + path);
    if(route.length > 1){
        if(route[1] !== "undefined"){
           if(routes[route[0]].search("=") !== -1){
               path += route[1];
           }else{
               path += "/" + route[1];
           }
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


module.exports = router;