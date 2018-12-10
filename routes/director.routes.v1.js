var express = require('express');
var routes = express.Router();
const Director = require('../models/director');

routes.get('/', function (req, res) {
    Director.find({})
        .then(function (directors) {
            res.status(200).json(directors);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

//Find by ID
routes.get('/:id', function (req, res) {
    res.contentType('application/json');
    Director.findOne({"_id": req.params.id})
        .then(function (directors) {
            res.status(200).json(directors);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

//Create
routes.post('/', function (req, res) {
    console.log(req.body);
    const newDirector = new Director({
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'yearOfBirth' : req.body.yearOfBirth,
        'countryOfOrigin' : req.body.countryOfOrigin,
        'isActor': req.body.isActor,
    });
    Director.create(newDirector)
        .then(director => {
            console.log("create: " + director);
            director.save();
            res.send(director)
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

//Update
routes.put('/:id', function (req, res) {
    const updatedDirector = {
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'yearOfBirth' : req.body.yearOfBirth,
        'countryOfOrigin' : req.body.countryOfOrigin,
        'isActor': req.body.isActor,
    };
    Director.findByIdAndUpdate({'_id': req.params.id}, updatedDirector)
        .then(() => {
            Director.findOne({_id: req.params.id})
                .then((director) => {
                    res.send(director);
                })
        })
});

//Delete
routes.delete('/:id', function (req, res) {
    Director.findOne({'_id': req.params.id})
        .then((director) => {
            director.remove()
                .then(() => {
                    res.status(200).json({message:'Director removed'});
                })
        })
});

module.exports = routes;