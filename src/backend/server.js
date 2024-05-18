const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');

const Event = require('./models/Event');
const Participant = require('./models/Participant');

const PORT = 5000;
const URL = 'mongodb+srv://sydorenko867:Pass321@cluster0.nol53uo.mongodb.net/eventsapp?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(`DB connection error: ${err}`));

// Function to fetch a single page of events
const fetchEventsPage = async (page, perPage) => {
    const options = {
        method: 'GET',
        url: 'https://api.seatgeek.com/2/events',
        params: {
            client_id: 'NDE2NDg4MjB8MTcxNTk3MzgwNC4wMDkwMQ',
            page: page,
            per_page: perPage
        },
        headers: {
            'X-RapidAPI-Key': '4a9e8943bbmsh37b51df10ab1f85p1fc224jsn7d4c0b8b7897',
            'X-RapidAPI-Host': 'seatgeek-seatgeekcom.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(`Fetched page ${page} with ${response.data.events.length} events`);
        return response.data.events;
    } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        return [];
    }
};

// Function to fetch all pages of events up to a limit
const fetchAllEvents = async (limit) => {
    const perPage = 100;
    let page = 1;
    let allEvents = [];
    let fetchedEvents;

    while (allEvents.length < limit) {
        fetchedEvents = await fetchEventsPage(page, perPage);
        if (fetchedEvents.length === 0) break;
        allEvents = allEvents.concat(fetchedEvents);
        if (allEvents.length >= limit) {
            allEvents = allEvents.slice(0, limit);
            break;
        }
        page++;
    }

    return allEvents;
};

// Function to fetch and store events in the database
const fetchAndStoreEvents = async () => {
    try {
        const events = await fetchAllEvents(200); // Limit to first 200 events
        console.log(`Total fetched events: ${events.length}`);

        for (const event of events) {
            try {
                const existingEvent = await Event.findOne({ eventId: event.id });
                if (!existingEvent) {
                    const newEvent = new Event({
                        eventId: event.id,
                        title: event.short_title,
                        description: event.venue.slug,
                        eventDate: event.datetime_utc,
                        organizer: event.venue.name
                    });

                    await newEvent.save();
                    console.log(`Saved event: ${event.short_title}`);
                } else {
                    console.log(`Event already exists: ${event.short_title}`);
                }
            } catch (err) {
                console.error(`Error processing event ${event.short_title}:`, err);
            }
        }

        console.log('Events fetched and stored successfully.');
    } catch (error) {
        console.error('Error fetching or storing events:', error);
    }
};

cron.schedule('0 * * * *', fetchAndStoreEvents); // Schedule to run every hour

app.listen(PORT, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening on port ${PORT}`);
        fetchAndStoreEvents();
    }
});

// EVENT
app.get('/events', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    Event.find()
        .skip(skip)
        .limit(limit)
        .then(events => {
            res.status(200).json(events);
        })
        .catch(err => {
            console.error('Error getting events:', err);
            res.status(500).json({ error: "Something went wrong getting all events..." });
        });
});

// PARTICIPANT
app.get('/participants/:eventTitle', (req, res) => {
    Participant
        .find({ eventTitle: req.params.eventTitle })
        .then(participants => {
            console.log(participants);
            res.status(200).json(participants);
        })
        .catch(error => {
            console.error('Error fetching participants:', error);
            res.status(500).json({ error: "Something went wrong getting participants by event title..." });
        });
});


app.post('/participants', (req, res) => {
    const participant = new Participant(req.body);
    participant
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch(() => {
            res
                .status(500)
                .json({ error:  "Something went wrong posting new participant..."});
        })
});
