import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        username: 'demo_user123',
        password: 'Demo@2024!'
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
        if (formData.password !== 'Demo@2024!') {
            setError('Invalid username or password!');
        } else {
            fetch('https://db-demo-u07o.onrender.com/userLogin', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials:'include',
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
               <Box display="flex" flexDirection="column" justifyContent="space-between" height={'100vh'}>
               {/* Header */}
               <Box>
                   <Typography
                       fontSize="35px"
                       mt="20px"
                       textAlign="center"
                       color="secondary"
                       fontFamily={"GT Bold"}
                   >
                       MAINGI BOOKS
                   </Typography>
               </Box>

               {/* Login Form */}
               <Box display="flex" flexDirection="column" alignItems="center">
                   <Typography fontFamily={"GT Regular"} fontSize="28px" fontWeight="bold" mb="5px" textAlign="center">
                       Welcome back!
                   </Typography>
                   <Typography fontFamily={"GT Light"} fontSize="15px" mb="20px" textAlign="center">
                       We're glad to see you again. Please enter your credentials to continue accessing your account. <br/>
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
                                   InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={togglePasswordVisibility}>
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        ),
                                    }}
                               />

                           {error && <Typography color="error" mb="20px">{error}</Typography>}

                           <Button sx={{ fontFamily:"GT Bold", fontSize:'15px'}} type="submit" variant="contained" color="secondary" fullWidth>
                               LOGIN
                           </Button>
                       </FormControl>
                   </form>
               </Box>

               {/* Footer Text */}
               <Box padding={'2px'}>
                   <Typography fontFamily={"GT Light"} fontSize="15px" mb="20px" textAlign="center">
                       Join the millions of investors who trust us to manage their finances. Benefit from our cutting-edge tools, personalized insights, and dedicated support designed to help you make informed decisions and achieve your financial goals.
                   </Typography>
               </Box>
           </Box>
            ):(
                <Box sx={{ backgroundColor: 'purple' }} padding={'84px'}>
                {/* Right Side - Form Section */}
                <Box display="flex" flexDirection="column" justifyContent="space-between" p={4} sx={{ backgroundColor: 'white', margin:'auto', width:'500px', height:'700px', borderRadius:'15px' }}>
                    {/* Header */}
                    <Box>
                        <Typography
                            fontSize="35px"
                            fontWeight="bold"
                            mt="20px"
                            textAlign="center"
                            color="secondary"
                            fontFamily={"GT Bold"}
                        >
                            MAINGI BOOKS
                        </Typography>
                    </Box>

                    {/* Login Form */}
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography fontFamily={"GT Regular"} fontSize="35px" fontWeight="bold" mb="5px" textAlign="center">
                            Welcome back!
                        </Typography>
                        <Typography fontFamily={"GT Light"} fontSize="15px" mb="20px" textAlign="center">
                            We're glad to see you again. Please enter your credentials to continue accessing your account.
                        </Typography>
                        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column'}}>
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


                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label="Password"
                                    sx={{ mb: '20px', flex: 1 }}
                                    InputProps={{
                                        endAdornment: (
                                          <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                          </IconButton>
                                        ),
                                      }}
                                    />

                                {error && <Typography color="error" mb="20px">{error}</Typography>}

                                <Button sx={{fontFamily:"GT Bold", fontSize:'15px'}} type="submit" variant="contained" color="secondary" fullWidth>
                                    LOGIN
                                </Button>
                        </form>
                    </Box>

                    {/* Footer Text */}
                    <Box>
                        <Typography fontFamily={"GT Light"} fontSize="15px" mb="20px" textAlign="center">
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
