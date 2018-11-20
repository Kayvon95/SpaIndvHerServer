var bodyParser = require('body-parser');
var config = require('./config/env/env');
var express = require('express');
var http = require('http');

var mongodb = require('./config/mongo.db');

var app = express();

// Bodyparser
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Environmentals & Config
app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

// Routes
//app.use('/api/v1/--', --_v1);

//About response
app.get(['/about',  '/api/v1/about'], function(req, res) {
    res.json({'info' : 'Node Mongo Neo server voor SPA Individueel.'});
});

//Error handling
app.use(function (err, req, res, next) {
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    }
    res.status(401).send(error);
});

//Catch all unknown
app.use('*', function (req, res) {
    res.status(400);
    res.json({
        'error': 'URL not found. Please check your URL and try again.'
    });
});


app.listen(config.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:'+ app.get('port') + '/api/v1/someroutes');
});


module.exports = app;