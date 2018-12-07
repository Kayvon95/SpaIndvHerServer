var express = require('express');
var routes = express.Router();
const Actor = require('../models/actor');

//Find all
routes.get('/', function (req, res) {
   Actor.find({})
       .then(function (actors) {
           res.status(200).json(actors);
       })
       .catch((error) => {
           res.status(400).json(error)
       });
});

//Find By ID
routes.get('/:id', function (req, res) {
    res.contentType('application/json');
    Actor.findOne({"_id": req.params.id})
        .then(function (actors) {
            res.status(200).json(actors);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

//Create
routes.post('/', function(req, res) {
   const newActor = new Actor({
       'firstName' : req.body.firstName,
       'lastName' : req.body.lastName,
       'yearOfBirth' : req.body.yearOfBirth,
       'isDirector' : req.body.isDirector
   });
   Actor.create(newActor)
       .then(actor => {
           console.log("create: " + actor);
           actor.save();
           res.send(actor)
       })
       .catch((error) => {
           res.status(400).json(error);
       });
});

//Update
routes.put('/:id', function(req, res) {
    const updatedActor = {
        'firstName' : req.body.firstName,
        'lastName' : req.body.lastName,
        'yearOfBirth' : req.body.yearOfBirth,
        'isDirector' : req.body.isDirector
    };
    Actor.findByIdAndUpdate({'_id': req.params.id}, updatedActor)
        .then(() => {
            Actor.findOne({_id: req.params.id})
                .then((actor) => {
                    res.send(actor);
                })
        })
});

//Delete
routes.delete('/:id', function (req, res) {
    Actor.findOne({'_id': req.params.id})
        .then((actor) => {
            actor.remove()
                .then(() => {
                    res.status(200).json({message: 'Actor removed'});
                })
        })
});

module.exports = routes;