(function() {
    /**
     * Module dependencies.
     */

    var express = require('express'),
        http = require('http'),
        https = require('https'),
        path = require('path'),
        fs = require('fs'),
        dataModel = require('./models/dataModel.js').dataModel,
        utils = require('./lib/utils.js').utils;

    var app = express();
    var u = new utils();
    app.set('port', process.env.PORT || 7777);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    var db = new dataModel();

    var data = require('./routes/data.js')(app, db, u);
    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });

}).call(this);