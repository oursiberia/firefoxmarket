var express = require("express");
var app = express();
var debug = require("debug");
var path = require("path");
var bodyParser = require("body-parser");

//set the port
app.set('port', process.env.PORT || 3000);

//make the server
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});


//setup routing
var routes = require('./routes/main');
//define the modules to use

app.use(bodyParser.json());


app.use('/', routes);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'views/proto')));


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//export so we can use in other files.
module.exports = app;