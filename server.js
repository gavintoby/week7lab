const express = require('express');
const mongoose = require('mongoose');
const { removeMovie } = require('./routers/actors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect('mongodb://34.126.200.200:27017/week7Lab', function(err){
    if(err){
        return console.log('Mongoose - connection error: ', err);
    }
    console.log('Connect Successfully');
});

const actorRoutes = require('./routers/actors');
const movieRoutes = require('./routers/movies');

//Get Actor
app.get('/actors', actorRoutes.getAll); //No 7

//Get Movie
app.get('/movies', movieRoutes.getAll); //No 8
app.get('/movies/:year1/:year2', movieRoutes.getMovie); //No 6

//Post Actor
app.post('/actors', actorRoutes.createOne);
app.post('/actors/:actorId/movies', actorRoutes.addMovie);

//Post Movie
app.post('/movies', movieRoutes.createOne);
app.post('/movies/:movieId/actors', movieRoutes.addActor); // No 5

//Delete Actor
app.delete('/actors/:actorId', actorRoutes.deleteOne);

app.delete('/actors/deleteAll/:actorId', actorRoutes.deleteActorMovie); //No 2

//Delete Movie
app.delete('/movies/:movieId', movieRoutes.deleteOne); //No 1
app.delete('/movies', movieRoutes.deleteAll); //No 9

//Put Actor
app.put('/actors', actorRoutes.updateOne);
app.put('/actors/:actorId/:movieId', actorRoutes.removeMovie); //No 3

app.put('/movies/:movieId/:actorId', movieRoutes.removeActor); //No 4

app.listen(8080);
