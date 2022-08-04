const mongoose = require('mongoose');

const ScreeningSchema = new mongoose.Schema({
    movie: { type: Map },
    date: { type: Date },
    hall: { type: String },
    seats: { type: Map }
});

const Screening = mongoose.model("screenings", ScreeningSchema);

module.exports = Screening;