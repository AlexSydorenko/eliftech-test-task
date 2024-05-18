const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const participantSchema = new Schema({
    name: String,
    email: String,
    dateOfBirth: Date,
    knownFrom: String,
    eventTitle: String
});

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;