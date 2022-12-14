const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String },
    tmdbID: { type: String },
    genre: { type: String },
    overview: { type: String },
    duration: { type: Number },
    posterPath: { type: String },
    backdropPath: { type: String },
    releaseDate: { type: Date },
    rating: { type: Number },
    language: { type: String },
    certification: { type: String },
    cast: { type: Array }
});

const Movie = mongoose.model("movies", MovieSchema);

module.exports = Movie;