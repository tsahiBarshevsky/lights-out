const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const orderID = require('order-id')('key');

const port = process.env.PORT || 5000;
var router = express.Router();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// Models
const Movie = require('./Models/Movie');
const Hall = require('./Models/Hall');
const Screening = require('./Models/Screening');
const Reservation = require('./Models/Reservation');

// Connect to database
mongoose.connect('mongodb://localhost:27017/lights-out', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* ====== Movies ======= */

// Get all movies
app.get('/get-all-movies', async (req, res) => {
    const movies = await Movie.find({}).sort({ title: 1 }).exec();
    console.log(`${movies.length} movies found`);
    res.json(movies);
});

// Get movie by name
app.get('/search-movie-by-name', async (req, res) => {
    const name = req.query.name;
    Movie.find({ "title": { $regex: new RegExp(name, "i") } },
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

// Add new movie
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

/* ====== Screenings ======= */

app.get('/get-all-screenings', async (req, res) => {
    const screenings = await Screening.find({}).sort({ date: 1 }).exec();
    console.log(`${screenings.length} movies found`);
    res.json(screenings);
});

// Book seats and add new reservation
app.post('/book-seats', async (req, res) => {
    const id = req.query.id;
    const filter = { _id: id };
    const update = { seats: req.body.seats };
    Screening.findOneAndUpdate(filter, update,
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
        }
    );
    const newReservation = new Reservation({
        orderID: orderID.generate(),
        screeningID: req.body.newReservation.screeningID,
        movie: req.body.newReservation.movie,
        contact: req.body.newReservation.contact,
        seats: req.body.newReservation.seats,
        sum: req.body.newReservation.sum,
        payment: req.body.newReservation.payment,
        date: req.body.newReservation.date,
        reservationDate: req.body.newReservation.reservationDate
    });
    await newReservation.save();
    res.json(newReservation._id);
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;