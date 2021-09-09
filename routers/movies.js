var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find({}).populate('actors').exec(function(err, movies){
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },

    getMovie: function (req, res) {
        if(req.params.year1 <= req.params.year2){
            res.json("Year 1 needs to be bigger than Year 2");
        }
        Movie.find(function (err, movies) {
            if (err) return res.status(400).json(err);
            let movieList = [];

            for (let i = 0; i < movies.length; i++) {
                if(parseInt(req.params.year2) <= movies[i].year && parseInt(req.params.year1) >= movies[i].year){
                    movieList.push(movies[i]);
                }
             }
            res.json(movieList);
        });
    },

    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.movieId })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.movieId }, function (err, actor) {
            if (err) return res.status(400).json(err);
            res.json(actor);
        });
    },

    deleteAll: function (req, res) {
        if(req.body.year1 <= req.body.year2){
            res.json("Year 1 needs to be bigger than Year 2");
        }

        Movie.find(function (err, movies) {
            if (err) return res.status(400).json(err);
            let deleted = 0;

            for (let i = 0; i < movies.length; i++) {
                if(req.body.year2 <= movies[i].year && req.body.year1 >= movies[i].year){
                    deleted += 1;
                    Movie.findOneAndRemove({ _id: movies[i]._id }, function (err, actor) {
                        if (err) return res.status(400).json(err);
                    });
                }
             }
            res.json("Document Deleted: " + deleted);
        });
    },

    removeActor: function (req, res) {
        Movie.findOne({ _id: req.params.movieId }, function (err, movie) {
            if (err) return res.status(400).json(err);
            let newActors = [];

            for (let i = 0; i < movie.actors.length; i++) {
               if (String(movie.actors[i]) === req.params.actorId){
                    console.log("Nothing Happened");
               } else{
                newActors.push(movie.actors[i]);
               }
            }

            let newMovie = {
                _id: req.params.movieId,
                title: movie.title,
                year: movie.year,
                actors: newActors
            };

            Movie.findOneAndUpdate({ _id: req.params.movieId }, newMovie, function (err, movie1) {
                if (err) return res.status(400).json(err);
                if (!movie1) return res.status(404).json();
                res.json({
                    'message': 'Actor removed!',
                    'updated now' : newMovie
                });
            });
        });
    },

    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.movieId }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.actorId }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },

    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.movieId }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    }
    
};