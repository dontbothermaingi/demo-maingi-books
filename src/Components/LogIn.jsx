import { Box, Button, FormControl, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        if (formData.username !== 'demo_user123' || formData.password !== 'Demo@2024!') {
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

    const isMobile = useMediaQuery('(max-width: 768px)');

    return (

        <Box>
            {isMobile ? (
               <Box flex="1" display="flex" flexDirection="column" justifyContent="space-between" height={'100vh'}>
               {/* Header */}
               <Box>
                   <Typography
                       fontSize="35px"
                       fontWeight="bold"
                       mt="20px"
                       textAlign="center"
                       color="secondary"
                   >
                       MAINGI BOOKS
                   </Typography>
               </Box>

               {/* Login Form */}
               <Box display="flex" flexDirection="column" alignItems="center">
                   <Typography fontSize="35px" fontWeight="bold" mb="5px" textAlign="center">
                       Welcome back!
                   </Typography>
                   <Typography fontSize="15px" mb="20px" textAlign="center">
                       We're glad to see you again. Please enter your credentials to continue accessing your account.
                       Username: demo_user123 && Password: Demo@2024!
                   </Typography>
                   <form onSubmit={handleSubmit}>
                       <FormControl sx={{ width: '100%', maxWidth: '400px' }}>
                           <TextField
                               type="text"
                               id="username"
                               name="username"
                               value={formData.username}
                               onChange={handleChange}
                               aria-label="Username"
                               variant="outlined"
                               label="Username"
                               sx={{ mb: '20px' }}
                               fullWidth
                           />

                           <Box display="flex" alignItems="center" gap="20px">
                               <TextField
                                   type={showPassword ? 'text' : 'password'}
                                   id="password"
                                   name="password"
                                   value={formData.password}
                                   onChange={handleChange}
                                   aria-label="Password"
                                   variant="outlined"
                                   label="Password"
                                   sx={{ mb: '20px', flex: 1 }}
                               />
                               <Button
                                   type="button"
                                   variant="contained"
                                   color="secondary"
                                   onClick={togglePasswordVisibility}
                                   aria-label={showPassword ? 'Hide password' : 'Show password'}
                               >
                                   {showPassword ? 'Hide' : 'Show'}
                               </Button>
                           </Box>

                           {error && <Typography color="error" mb="20px">{error}</Typography>}

                           <Button type="submit" variant="contained" color="secondary" fullWidth>
                               LOGIN
                           </Button>
                       </FormControl>
                   </form>
               </Box>

               {/* Footer Text */}
               <Box>
                   <Typography fontSize="15px" mb="20px" textAlign="center">
                        Benefit from our cutting-edge tools, personalized insights, and dedicated support designed to help you make informed decisions and achieve your financial goals.
                   </Typography>
               </Box>
           </Box>
            ):(
                <Box display="flex" height="100vh">
                {/* Left Side - Background */}
                <Box flex="1" sx={{ backgroundColor: 'purple' }} />

                {/* Right Side - Form Section */}
                <Box flex="1" display="flex" flexDirection="column" justifyContent="space-between" p={4}>
                    {/* Header */}
                    <Box>
                        <Typography
                            fontSize="35px"
                            fontWeight="bold"
                            mt="20px"
                            textAlign="center"
                            color="secondary"
                        >
                            MAINGI BOOKS
                        </Typography>
                    </Box>

                    {/* Login Form */}
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography fontSize="35px" fontWeight="bold" mb="5px" textAlign="center">
                            Welcome back!
                        </Typography>
                        <Typography fontSize="15px" mb="20px" textAlign="center">
                            We're glad to see you again. Please enter your credentials to continue accessing your account.
                            Username: demo_user123 && Password: Demo@2024!
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl sx={{ width: '100%', maxWidth: '400px' }}>
                                <TextField
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    aria-label="Username"
                                    variant="outlined"
                                    label="Username"
                                    sx={{ mb: '20px' }}
                                    fullWidth
                                />

                                <Box display="flex" alignItems="center" gap="20px">
                                    <TextField
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        aria-label="Password"
                                        variant="outlined"
                                        label="Password"
                                        sx={{ mb: '20px', flex: 1 }}
                                    />
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </Box>

                                {error && <Typography color="error" mb="20px">{error}</Typography>}

                                <Button type="submit" variant="contained" color="secondary" fullWidth>
                                    LOGIN
                                </Button>
                            </FormControl>
                        </form>
                    </Box>

                    {/* Footer Text */}
                    <Box>
                        <Typography fontSize="15px" mb="20px" textAlign="center">
                            Join the millions of investors who trust us to manage their finances. Benefit from our cutting-edge tools, personalized insights, and dedicated support designed to help you make informed decisions and achieve your financial goals.
                        </Typography>
                    </Box>
                </Box>
                </Box>

            )}
            
        </Box>
    );
}

export default Login;
