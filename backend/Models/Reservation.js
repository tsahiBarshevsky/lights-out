const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    orderID: { type: String },
    screeningID: { type: String },
    movie: { type: String },
    contact: { type: Map },
    seats: { type: Array },
    sum: { type: Number },
    date: { type: Date }
});

const Reservation = mongoose.model("reservations", ReservationSchema);

module.exports = Reservation;