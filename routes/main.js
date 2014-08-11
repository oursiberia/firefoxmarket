var express = require('express');
var fs = require("fs");
var router = express.Router();


/**
 * Loads the homepage / template
 */
router.get('/', function(req, res) {
   res.sendfile('./public/index.html');
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