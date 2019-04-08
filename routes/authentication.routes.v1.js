const express = require('express');
const router = express.Router();
const auth = require('../auth/authentication');

testUser = {username: 'k1', password: 'testww1'};

router.all(new RegExp("[^(\/login)]"), function(req, res, next) {
    var token = (req.header('X-Access-Token')) || '';
    console.log("Validating Token")

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error: ' + err.message);
            res.status((err.status || 401)).json({error: new Error("Not authorised, invalid token").message})
        } else {
            next()
        }
    })
});

router.route('/login')
    .post(function (req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';
        console.log('result: ' + JSON.stringify(result[0]));

        if (result[0]) {
            res.status(200).json({"token": auth.encodeToken(username), "username": username})
        } else {
            res.status(401).json({"error": "Not authorised."})
        }
});