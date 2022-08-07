const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    orderID: { type: String },
    screeningID: { type: String },
    movie: { type: Map },
    contact: { type: Map },
    seats: { type: Array },
    sum: { type: Number },
    payment: { type: Map },
    date: { type: Date },
    reservationDate: { type: Date }
});

const Reservation = mongoose.model("reservations", ReservationSchema);

module.exports = Reservation;