const mongoose = require('mongoose');

const HallSchema = new mongoose.Schema({
    number: { type: String },
    type: { type: String },
    seats: { type: Map }
});

const Hall = mongoose.model("halls", HallSchema);

module.exports = Hall;