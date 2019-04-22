var bodyParser = require('body-parser');
var config = require('./config/env/env');
var express = require('express');
var http = require('http');

var mongodb = require('./config/mongo.db');

const authenticationRoutes_v1 = require('./routes/authentication.routes.v1');
var directorRoutes_v1 = require('./routes/director.routes.v1');
var movieRoutes_v1 = require('./routes/movie.routes.v1');
var actorRoutes_v1 = require('./routes/actor.routes.v1');

var app = express();

// Bodyparser
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Environmentals & Config
app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));
app.set('secretkey', config.env.secretkey);

// CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
// Routes
app.use('/api/v1/authentication', authenticationRoutes_v1)
app.use('/api/v1/directors', directorRoutes_v1);
app.use('/api/v1/movies', movieRoutes_v1);
app.use('/api/v1/actors', actorRoutes_v1);

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
    console.log('SPA individueel - Kayvon Rahimi Morad Ali');
    console.log('#2114114');
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:'+ app.get('port') + '/api/v1/someroutes');
});


module.exports = app;