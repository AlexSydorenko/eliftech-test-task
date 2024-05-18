import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

import EventCard from './components/EventCard/EventCard';

function App() {
  const [events, setEvents] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight && hasMore) {
        setLoading(true);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/events?page=${currPage}&limit=20`);
        const newEvents = response.data;

        setEvents(prevEvents => [...prevEvents, ...newEvents]);

        if (newEvents.length === 0 || newEvents.length < 20) {
          setHasMore(false);
        }

        setCurrPage(prevPage => prevPage + 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (loading && hasMore) {
      fetchEvents();
    }
  }, [loading, currPage, hasMore]);

  useEffect(() => {
    setLoading(true);
  }, []);

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const sortEvents = (events, criteria) => {
    if (!criteria) return events;

    return [...events].sort((a, b) => {
      if (criteria === 'title') {
        return a.title.localeCompare(b.title);
      } else if (criteria === 'eventDate') {
        return new Date(a.eventDate) - new Date(b.eventDate);
      } else if (criteria === 'organizer') {
        return a.organizer.localeCompare(b.organizer);
      }
      return 0;
    });
  };

  const sortedEvents = sortEvents(events, sortCriteria);

  return (
    <div className="App">
      <div className="container">
        <h1 className="events-page-title">Events</h1>
        <div className="sort-options">
          <label htmlFor="sort">Sort by: </label>
          <select id="sort" value={sortCriteria} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="title">Title</option>
            <option value="eventDate">Event Date</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>
        <div className="events-list">  
          {sortedEvents.map((event, index) => (
            <EventCard key={index} event={event}/>
          ))}
        </div>
        {loading && <p className="loading-info">Loading events...</p>}
      </div>
    </div>
  );
}

export default App;
