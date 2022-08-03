const mongoose = require('mongoose');

const HallSchema = new mongoose.Schema({
    number: { type: String },
    seats: { type: Object }
});

const Hall = mongoose.model("halls", HallSchema);

module.exports = Hall;