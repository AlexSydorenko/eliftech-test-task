const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventId: { type: String, unique: true, required: true },
    title: String,
    description: String,
    eventDate: Date,
    organizer: String
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;