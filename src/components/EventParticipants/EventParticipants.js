import { useEffect, useState } from 'react';
import './EventParticipants.css';

const EventParticipants = (props) => {
    const [eventParticipants, setEventParticipants] = useState(props.participants);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setEventParticipants(props.participants);
    }, [props.participants]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredParticipants = eventParticipants.filter(participant => 
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        participant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="event-participants-overlay">
            <div className="event-participants-content">
                <h1 className="event-participants-title"><u><span>{`"${props.event.title}"`}</span> participants</u></h1>
                
                <input 
                    type="text" 
                    placeholder="Search by name or email" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="participants-search-input"
                />

                <div className="event-participants-list">
                    {
                        filteredParticipants.length > 0 ? (
                            filteredParticipants.map((participant, index) => (
                                <div key={index} className="event-participant-card">
                                    <h1 className="event-participant-card-name">{participant.name}</h1>
                                    <p className="event-participant-card-email">{participant.email}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-participants">No participants registered.</p>
                        )
                    }
                </div>

                <i 
                    onClick={props.closeForm}
                    className="fa-solid fa-xmark close-register-form"></i>
            </div>
        </div>
    )
}

export default EventParticipants;
