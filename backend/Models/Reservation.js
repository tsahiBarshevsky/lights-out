const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    orderID: { type: String },
    screeningID: { type: String },
    uid: { type: String },
    movie: { type: Map },
    contact: { type: Map },
    seats: { type: Array },
    sum: { type: Number },
    payment: { type: Map },
    date: { type: Date },
    reservationDate: { type: Date },
    active: { type: Boolean }
});

const Reservation = mongoose.model("reservations", ReservationSchema);

module.exports = Reservation;