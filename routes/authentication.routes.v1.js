const express = require('express');
const routes = express.Router();
const auth = require('../auth/authentication');
const moment = require('moment');
const User = require('../models/user');

routes.post('/signup', function (req, res) {
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.setPassword(req.body.password);

    // var checkedUser = new User();
    // User.findOne({'username': newUser.username})
    //     .then(function (user) {
    //         console.log('username ' + newUser.username + ' is already taken');
    //         checkedUser = new User();
    //     })
    //     .catch((error) => {
    //         res.status(400).json(error);
    //     });
    // if (checkedUser.username != null) {
    //     console.log('user already exists');
    // } else {
        console.log('no user found, proceed')
        User.create(newUser)
            .then(user => {
                user.save();
                const token = auth.encodeToken(newUser.username);
                console.log("auth_token " + token);
                res.status(200).json({"token": token, "username": user.username});
                // res.send(user)
            })
            .catch((error) => {
                res.status(400).json(error);
            });
    // }
});


routes.route('/login')
    .post(function (req, res) {
        var submittedUser = new User();
        submittedUser.username = req.body.username || '';
        submittedUser.passwordHash = req.body.password || '';

        User.findOne({username: submittedUser.username}, function (err, user) {
            if (!user) {
                res.send('User not found')
            }
            else if (user.validatePassword(password)) {
                // res.status(200).json({"auth_token": auth.encodeToken(username), "username": username})
                const token = auth.encodeToken(submittedUser.username);
                console.log("auth_token "  + token);
                res.status(200).json({"token": token})
            } else {
                res.status(401).json({"error": "Not authorised."})
            }
        });
        var password = submittedUser.passwordHash.toString();

    });

routes.post('/verifyToken', function(req, res){
   // console.log(JSON.stringify(req.headers));
   var token = req.get('Authorization') || '';
   var decodedToken = auth.decodeToken(token);
   // console.log(decodedToken.exp + ' ' + moment().unix());
   if (decodedToken.exp > moment().unix()) {
       res.send(decodedToken);
   } else {
       res.status(401).json({"error": "Token expired"})
   }
});

module.exports = routes;