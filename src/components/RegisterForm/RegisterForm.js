import { useState } from 'react';
import './RegisterForm.css';
import axios from 'axios';

const RegisterForm = (props) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        knownFrom: '',
        eventTitle: props.event.title
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        if (!userData.name.trim()) {
            formErrors.name = "Name is required.";
        } else if (userData.name.length < 3 && userData.name.length > 20) {
            formErrors.name = "Name must be at least 3 characters and no more than 20 characters.";
        }

        if (!userData.email) {
            formErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            formErrors.email = "Email is invalid.";
        }

        if (!userData.dateOfBirth) {
            formErrors.dateOfBirth = "Date of Birth is required.";
        }

        if (!userData.knownFrom) {
            formErrors.knownFrom = "Please select an option.";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:5000/participants', userData);
                console.log('Registration successful:', response.data);
                props.addParticipant(response.data);
                props.closeForm();
            } catch (error) {
                console.error('Error registering:', error);
            }
        }
    };

    return (
        <div className="register-form-wrapper">
            <form onSubmit={handleSubmit} className="register-form">
                <h1 className="register-form-title"><u>Event registration</u></h1>
                <div className="register-form-input">
                    <label htmlFor="name">Full name</label>
                    <input 
                        id="name" 
                        name="name"
                        type="text" 
                        placeholder="John Doe" 
                        value={userData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                
                <div className="register-form-input">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email" 
                        name="email"
                        type="text" 
                        placeholder="example@gmail.com" 
                        value={userData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                
                <div className="register-form-input">
                    <label htmlFor="birth">Date of birth</label>
                    <input 
                        id="birth" 
                        name="dateOfBirth"
                        type="date" 
                        value={userData.dateOfBirth}
                        onChange={handleChange}
                    />
                    {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth}</p>}
                </div>

                <p className="register-form-hear-source-title">Where did you hear about this event?</p>
                <div className="register-form-hear-source">
                    <div className="register-form-hear-source-item">
                        <input 
                            type="radio" 
                            id="socials" 
                            name="knownFrom" 
                            value="Social media"
                            checked={userData.knownFrom === 'Social media'}
                            onChange={handleChange} 
                        />
                        <label htmlFor="socials">Social media</label>
                    </div>

                    <div className="register-form-hear-source-item">
                        <input 
                            type="radio" 
                            id="friends" 
                            name="knownFrom" 
                            value="Friends"
                            checked={userData.knownFrom === 'Friends'}
                            onChange={handleChange} 
                        />
                        <label htmlFor="friends">Friends</label>
                    </div>

                    <div className="register-form-hear-source-item">
                        <input 
                            type="radio" 
                            id="myself" 
                            name="knownFrom" 
                            value="Found myself"
                            checked={userData.knownFrom === 'Found myself'}
                            onChange={handleChange} 
                        />
                        <label htmlFor="myself">Found myself</label>
                    </div>
                    {errors.knownFrom && <p className="error-message">{errors.knownFrom}</p>}
                </div>

                <i 
                    onClick={props.closeForm}
                    className="fa-solid fa-xmark close-register-form"></i>

                <button type="submit" className="submit-form-btn">
                    Register
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;
