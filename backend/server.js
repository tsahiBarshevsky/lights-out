const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const orderid = require('order-id')('key');

const port = process.env.PORT || 5000;
var router = express.Router();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// Models
const Movie = require('./Models/Movie');
const Hall = require('./Models/Hall');

// Connect to database
mongoose.connect('mongodb://localhost:27017/lights-out', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* ====== Movies ======= */

app.get('/get-all-movies', async (req, res) => {
    Movie.find({},
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                console.log(`${result.length} movies found`);
                res.json(result);
            }
        }
    );
});

app.post('/add-new-movie', async (req, res) => {
    const newMovie = new Movie({
        title: req.body.title,
        tmdbID: req.body.tmdbID,
        genre: req.body.genre,
        overview: req.body.overview,
        duration: req.body.duration,
        posterPath: req.body.posterPath,
        releaseDate: req.body.releaseDate,
        rating: req.body.rating
    });
    await newMovie.save();
    res.json(newMovie._id);
});

/* ====== Halls ======= */

app.get('/get-all-halls', async (req, res) => {
    Hall.find({},
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                console.log(`${result.length} halls found`);
                res.json(result);
            }
        }
    );
});

app.post('/add-new-hall', async (req, res) => {
    const newHall = new Hall({
        number: req.body.number,
        seats: req.body.seats
    });
    await newHall.save();
    res.json(newHall._id);
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;