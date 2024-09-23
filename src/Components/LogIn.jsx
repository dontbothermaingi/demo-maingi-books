import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to track password visibility
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check for correct username and password
        if (formData.username !== 'demo@demo.info' || formData.password !== 'demo2024') {
            setError('Unauthorized User');
        } else {
            fetch('https://db-demo-u07o.onrender.com/userLogin', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errorMsg => {
                        throw new Error(errorMsg.error || 'Login failed');
                    });
                }
            })
            .then(userData => {
                localStorage.setItem("access_token", userData.access_token);
                localStorage.setItem("user_id", userData.id);
                onLogin(userData); // Call the onLogin callback
                navigate('/'); // Redirect after login
            })
            .catch(error => {
                console.error('Error occurred during login:', error);
                setError(error.message); // Set the error message to state
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='overall-container'>
            <div>
                <img src="../../assets/MP42.jpeg" alt="Scania" style={{ height: '932px' }} className='image-login' />
            </div>

            <div className='container-login'>
                <div className='header'>
                    <Typography
                        fontSize='35px'
                        fontWeight='bold'
                        mt='20px'
                        textAlign='center'
                    >
                        MAINGI BOOKS
                    </Typography>
                </div>

                <div className='form-container'>
                    <Typography
                        fontSize='35px'
                        fontWeight='bold'
                        mb='5px'
                        textAlign='center'
                    >
                        Welcome back!
                    </Typography>

                    <Typography
                        fontSize='15px'
                        mb='20px'
                        textAlign='center'
                    >
                        We're glad to see you again. Please enter your credentials to continue accessing your account.
                        <br/>username: demo@demo.info
                        <br/>password: demo2024
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <div className="bill-input">
                            <label htmlFor="username">USERNAME</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                className="bill-inputfield"
                                value={formData.username}
                                onChange={handleChange}
                                aria-label="Username"
                            />
                        </div>

                        <div className="bill-input">
                            <label htmlFor="password">PASSWORD</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'} // Toggle input type
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    className="bill-inputfield"
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-label="Password"
                                />
                                <button
                                    type="button"
                                    className="button"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        
                        <button type="submit" className="button-login">LOGIN</button>
                    </form>
                </div>

                <div className='footer'>
                    <Typography
                        fontSize='15px'
                        mb='20px'
                        textAlign='center'
                        maxWidth='550px'
                    >
                        Join the millions of investors who trust us to manage their finances. 
                        Benefit from our cutting-edge tools, personalized insights, and dedicated support designed to help you make informed decisions and achieve your financial goals.
                    </Typography>
                </div>
            </div>
        </div>
    );
}

export default Login;
