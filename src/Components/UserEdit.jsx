import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, Button, Divider, IconButton, TextField, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserEdit() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
    });

    // Media query for responsiveness
    const isMobile = useMediaQuery('(max-width: 768px)');

    const navigate = useNavigate();
    const access_token = localStorage.getItem('access_token');

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/userdetails', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then((data) => {
            setFormData({
                username: data.user.username,
                email: data.user.email,
                phone_number: data.user.phone_number,
            });
        });
    }, [access_token]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch('https://db-demo-u07o.onrender.com/userdetails', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(() => {
            // Clear form after submission if needed
            setFormData({
                username: '',
                email: '',
                phone_number: '',
            });
        });
    }

    function handleBack() {
        navigate('/user-accounts');
    }

    return (
        <Box padding={isMobile ? '20px' : '40px'}>
            <Box display={{md:'hidden'}}>
                <IconButton sx={{ color: 'black', mb: 2 }} onClick={handleBack}>
                    <ArrowBack />
                </IconButton>
            </Box>

            <Typography variant="h5" fontWeight="bold" mb={3}>Edit User</Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit} style={{ maxWidth: isMobile ? '100%' : '400px', margin: '0 auto' }}>
                <TextField
                    type="text"
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: '20px' }}
                />
                <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: '20px' }}
                />
                <TextField
                    type="tel"
                    name="phone_number"
                    label="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: '20px' }}
                />
                <Button type="submit" variant="contained" color="secondary" fullWidth>
                    SAVE
                </Button>
            </form>
        </Box>
    );
}

export default UserEdit;
