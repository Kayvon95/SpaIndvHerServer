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
        .then(function (movies) {
            res.status(200).json(movies);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.get('/:id', function (req, res) {
    Movie.findOne({"_id" : req.params.id})
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

module.exports = routes;