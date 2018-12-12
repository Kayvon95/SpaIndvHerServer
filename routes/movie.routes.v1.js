/**
 * Created by Kayvon Rahimi on 24-11-2018.
 */
var express = require('express');
var routes = express.Router();
const Movie = require('../models/movie');
const Director = require('../models/director');
const Actor = require('../models/actor');

//All
routes.get('/', function (req, res) {
    Movie.find({})
        .populate({
            path: 'actors',
            populate: {
                path: 'actors',
                model: 'actor'
            }
        })
        .then(function (movies) {
            res.status(200).json(movies);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.get('/:id', function (req, res) {
    Movie.findOne({"_id" : req.params.id})
        .populate({
            path: 'actors',
            populate: {
                path: 'actors',
                model: 'actor'
            }
        })
        .then(function (movie) {
            res.status(200).json(movie);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

//Create
routes.post('/', function (req, res) {
    console.log(req.body);
    const newMovie = new Movie({
        'title': req.body.title,
        'subtitle': req.body.subtitle,
        'minutes' : req.body.minutes,
        'genre' : req.body.genre,
        'yearOfRelease': req.body.yearOfRelease,
        'imageUrl': req.body.imageUrl
    });
    Movie.create(newMovie)
        .then(movie => {
            console.log("create: " + movie);
            movie.save();
            res.send(movie)
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

//Update
routes.put('/:id', function (req, res) {
    const updatedMovie = {
        'title': req.body.title,
        'subtitle': req.body.subtitle,
        'minutes' : req.body.minutes,
        'genre' : req.body.genre,
        'yearOfRelease': req.body.yearOfRelease,
        'imageUrl': req.body.imageUrl
    };
    Movie.findByIdAndUpdate({'_id': req.params.id}, updatedMovie)
        .then(() => {
            Movie.findOne({_id: req.params.id})
                .then((movie) => {
                    res.send(movie);
                })
        })
});

//Delete
routes.delete('/:id', function (req, res) {
    Movie.findOne({'_id': req.params.id})
        .then((movie) => {
            movie.remove()
                .then(() => {
                    res.status(200).json({message:'Movie removed'});
                })
        })
});

//Add actor to movie
routes.put('/:id/actor', function(req, res) {
    const movieId = req.params.id;
    console.log(movieId);
    const actorProps = req.body;
    const actor = new Actor({
        'firstName' : actorProps.firstName,
        'lastName' : actorProps.lastName,
        'yearOfBirth' : actorProps.yearOfBirth,
        'countryOfOrigin': actorProps.countryOfOrigin,
        'isDirector': actorProps.isDirector,
        'imageUrl': actorProps.imageUrl,
    });
    Movie.findOne({'_id': req.params.id})
        .then((movie) => {
            movie.actors.push(actor);
            Promise.all([actor.save(), movie.save()])
                .then(() => {
                    res.send(movie);
                })
        })
});

module.exports = routes;