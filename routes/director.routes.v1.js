var express = require('express');
var routes = express.Router();
const Director = require('../models/director');
const Movie = require('../models/movie');
//Neo4j
const neo4j = require('../config/neo4j.db');
const session = neo4j.session();

routes.get('/', function (req, res) {
    Director.find({})
        .populate({
            path: 'movies',
            populate: {
                path: 'movies',
                model: 'movie'
            }
        })
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
        .populate({
            path: 'movies',
            populate: {
                path: 'movies',
                model: 'movie'
            }
        })
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
        'imageUrl': req.body.imageUrl
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
        'imageUrl': req.body.imageUrl
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

//Add movie to director
routes.put('/:id/movie', function(req, res) {
    const directorid = req.params.id;
    console.log(directorid);
    const movieProps = req.body;
    const movie = new Movie({
        'title' : movieProps.title,
        'subtitle' : movieProps.subtitle,
        'minutes' : movieProps.minutes,
        'genre': movieProps.genre,
        'yearOfRelease': movieProps.yearOfRelease,
        'imageUrl': movieProps.imageUrl,
    });
    Director.findOne({'_id': directorid})
        .then((director) => {
            director.movies.push(movie);
            Promise.all([movie.save(), director.save()])
                .then(() => {
                    res.send(director);
                })
        })
});
//Delete movie from director
routes.delete('/:id/movie/:movieId', function (req, res) {
    console.log('DirectorId ' + req.params.id + ' with movieId ' + req.params.movieId);
    Director.findOne({'_id': req.params.id})
        .then((director) => {
            const movieIndex = director.movies.indexOf(req.params.movieId);
            console.log('movieIndex is ' + movieIndex);
            director.movies.splice(movieIndex, 1);
            director.save()
                .then(() => {
                    res.send(director);
                })
        });
});

//NEO4j
routes.post('/neo', function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const yearOfBirth = req.body.yearOfBirth;
    const countryOfOrigin = req.body.countryOfOrigin;

    session
        .run("CREATE (director:Director{" +
            "firstName: {firstNameParam}, " +
            "lastName: {lastNameParam}, " +
            "yearOfBirth: {yearOfBirthParam}, " +
            "countryOfOrigin: {countryOfOriginParam}}) " +
            "RETURN director",
            {firstNameParam: firstName, lastNameParam: lastName, yearOfBirthParam: yearOfBirth, countryOfOriginParam: countryOfOrigin})
        .then(function(result) {
            result.records.forEach(function(record) {
                res.status(200).json(record)
            });
            session.close();
        })
        .catch(function(error) {
            res.status(400).json(error);
            console.log(error);
        })
});

routes.put('/:lastName/neo', function (req, res) {
    res.contentType('application/json');
    const lastName = req.params.lastName;
    //Body
    const firstName = req.body.firstName;
    const newLastName = req.body.lastName;
    const yearOfBirth = req.body.yearOfBirth;
    const countryOfOrigin = req.body.countryOfOrigin;
    session
        .run("MATCH (director :Director{lastName: {lastNameParam}}) " +
            " SET director.firstName = {firstNameParam}, director.lastName = {newLastNameParam}, " +
            "director.yearOfBirth = {yearOfBirthParam}, director.countryOfOrigin = {countryOfOriginParam} " +
            " RETURN director",
            {firstNameParam: firstName, lastNameParam: lastName, newLastNameParam: newLastName, yearOfBirthParam: yearOfBirth, countryOfOriginParam: countryOfOrigin})
        .then(function (result) {
            result.records.forEach(function (record) {
                console.log(record);
                res.status(200).json(result);
            });
            session.close();
        })
        .catch(function (error) {
            res.status(400).json(error);
            console.log(error);
        })
});

routes.delete('/:lastName/neo', function (req, res) {
    res.contentType('application/json');
    const firstName = req.params.firstName;
    const lastName = req.params.lastName;
    session
        .run(//"MATCH(director:Director) WHERE director.firstName = {firstName: {firstNameParam}} AND director.lastName={lastName: {lastName}}" +
            // "MATCH(director:Director) WHERE director.firstName = {firstName: {firstNameParam}}" +
            "MATCH (director:Director  {lastName: {lastNameParam}}) " +
            "DELETE director " +
            "RETURN director", {lastNameParam: lastName})
        .then(function(result) {
            result.records.forEach(function(record) {
                res.status(200).json('Deleted director ' + firstName + ' ' + lastName);
            });
            session.close();
        })
        .catch(function(error) {
            res.status(400).json(error);
            console.log(error);
        })
});

module.exports = routes;