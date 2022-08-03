const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String },
    tmdbID: { type: String },
    genre: { type: String },
    overview: { type: String },
    duration: { type: Number },
    posterPath: { type: String },
    releaseDate: { type: Date },
    rating: { type: Number }
});

const Movie = mongoose.model("movies", MovieSchema);

module.exports = Movie;