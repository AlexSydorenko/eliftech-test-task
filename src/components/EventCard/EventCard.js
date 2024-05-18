import { useEffect, useState } from 'react';
import './EventCard.css';
import axios from 'axios';

import RegisterForm from '../RegisterForm/RegisterForm';
import EventParticipants from '../EventParticipants/EventParticipants';

const EventCard = (props) => {
    const [registerFormVisibility, setRegisterFormVisibility] = useState(false);
    const [eventInfoVisibility, setEventInfoVisibility] = useState(false);
    const [eventParticipants, setEventParticipants] = useState([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/participants/${props.event.title}`);
                setEventParticipants(response.data);
            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        };

        fetchParticipants();
    }, [props.event.title]);

    const addParticipant = (newParticipant) => {
        setEventParticipants(prevParticipants => [...prevParticipants, newParticipant]);
    };

    const sliceString = (string, limit) => {
        return string.length > limit ? `${string.slice(0, limit-1)}...` : string;
    };

    return (
        <div className="event-card-wrapper">
            <h1 className="event-title">{sliceString(props.event.title, 15)}</h1>
            <p className="event-descriprion">{sliceString(props.event.description, 15)}</p>
            <div className="event-card-btns">
                <button 
                    onClick={() => {
                        document.body.style.overflow = 'hidden';
                        setRegisterFormVisibility(true);
                    }}
                    className="event-register-btn">
                        Register
                </button>
                <button 
                    onClick={() => {
                        document.body.style.overflow = 'hidden';
                        setEventInfoVisibility(true);
                    }}
                    className="event-view-btn">
                        View
                </button>
            </div>

            {registerFormVisibility && (
                <RegisterForm 
                    event={props.event}
                    addParticipant={addParticipant}
                    registerFormVisibility={registerFormVisibility} 
                    closeForm={() => 
                        {
                            document.body.style.overflow = '';
                            setRegisterFormVisibility(false);
                        }
                    }
                />
            )}

            {eventInfoVisibility && (
                <EventParticipants 
                    event={props.event}
                    participants={eventParticipants}
                    closeForm={() => 
                        {
                            document.body.style.overflow = '';
                            setEventInfoVisibility(false);
                        }
                    }
                />
            )}
        </div>
    );
}

export default EventCard;
