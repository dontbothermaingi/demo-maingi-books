import { Typography } from "@mui/material";
import { useState } from "react";
import { NavLink, useNavigate} from "react-router-dom";
// import "./Register.css";
function Register() {
    
    const navigate = useNavigate();
    const [error, setError] = useState('');


    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://maingi-demo-server.onrender.com/userRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('User registered successfully:', userData);
                // Redirect to login page after successful registration
                navigate('/login');
            } else {
                const errorMessage = await response.json();
                console.error('Registration failed:', errorMessage);

                // Handle registration error
            }
        } catch (error) {
            console.error('Error occurred during registration:', error);
            setError(error.message);  // Set the error message to state

        }
    };

    return (
        <div className='overall-container'>

                <div>
                    <img src="../../assets/MP42.jpeg" alt="Scania" style={{ height: '932px' }} className='image-login'/>
                </div>

                <div className='container-login'>
                            <div className='header'>
                                <Typography
                                    fontSize='35px'
                                    fontWeight='bold'
                                    mb='5px'
                                    textAlign='center'
                                >
                                    MAINGI BOOKS
                                </Typography>
                            </div>
                    
                            <div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="bill-input">
                                            <label>USERNAME</label>
                                            <input
                                                type="text"
                                                name="username"
                                                placeholder="Username"
                                                className="bill-inputfield"
                                                value={formData.username}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="bill-input">
                                            <label>EMAIL</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                className="bill-inputfield"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="bill-input">
                                            <label>PHONE NUMBER</label>
                                            <input
                                                type="text"
                                                name="phone_number"
                                                placeholder="Phone Number"
                                                className="bill-inputfield"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="bill-input">
                                            <label>PASSWORD</label>
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                className="bill-inputfield"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="bill-input">
                                            <label>CONFIRM PASSWORD</label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                placeholder="Confirm Password"
                                                className="bill-inputfield"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {error && <div style={{ color: 'red' }}>{error}</div>}
                                        
                                        <button type="submit" className="button-login">REGISTER</button>
                                    </form>
                                    <Typography>
                                        Already have an account?<NavLink to="/login"><u>Login</u></NavLink>
                                    </Typography>
                            </div>

                            <div className='footer'>
                                <Typography
                                    fontSize='15px'
                                    mb='5px'
                                    textAlign='center'
                                    maxWidth='550px'
                                >
                                    Join the millions of investors who trust us to manage their finances. 
                                    Benefit from our cutting-edge tools, personalized insights, and dedicated support designed to help you make informed decisions and achieve your financial goals.
                                    {/* Experience seamless integration with your accounts and stay ahead with real-time updates and expert guidance. */}
                                </Typography>
                            </div>
                </div>
       </div>
    );
}

export default Register;
