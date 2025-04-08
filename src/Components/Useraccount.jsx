import React, { useState } from 'react';
import { Box, Button, Divider, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserEdit from './UserEdit';

function UserAccount({ onLogout }) {
    const navigate = useNavigate();
    const [selectedMenuItem, setSelectedMenuItem] = useState(null); // State to track selected menu item

    // Media query for responsiveness
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1020px)');

    function handleSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem('access_token');
        fetch('https://demo-server-757m.onrender.com/logout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Logout failed');
                }
            })
            .then(() => {
                onLogout();
                navigate('/login');
            })
            .catch(error => {
                console.error("Error during logout:", error);
            });
    }

    // Function to render the content based on selected menu item
    function renderContent() {
        switch (selectedMenuItem) {
            case 'Account Management':
                return (
                    <Box display='flex' flexDirection='column'>
                        <Box mb='10px'>
                            <Typography fontSize={'25px'}>Account Details</Typography>
                        </Box>

                        <Divider orientation='horizontal' sx={{mb:'20px'}}/>

                        <UserEdit />
                    </Box>
                )
            default:
                return null;
        }
    }

    function handleuseredit(){
        navigate('/user-edit')
    }

    return (
        <Box >

            {isMobile || isTablet ? (
                <Box sx={{
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    borderRadius: "8px",
                    border: '1px solid #ccc'
                    }} 
                    width='auto' 
                    display='flex' 
                    flexDirection={'column'} 
                    height={'100%'} 
                    padding='10px' 
                    gap='20px' 
                    margin={'20px'}
                >
                    

                    <Typography fontWeight={'bold'} fontSize={'25px'} textAlign={'center'}>ACCOUNT MANAGEMENT</Typography>

                    <Divider orientation='horizontal'/>

                    {/* Account Management */}
                    <Box display='flex' alignItems='center' onClick={handleuseredit} sx={{ cursor: 'pointer' }}>
                        <IconButton color="black">
                        </IconButton>
                        <Typography fontSize='19px'>Account Management</Typography>
                    </Box>

                    <Button variant="contained" color="secondary" onClick={handleSubmit}>
                        LOG OUT
                    </Button>
                </Box>

            ) : (
                <Box display='flex' height='80vh' padding='20px' gap='20px'>
                {/* Left Side: Menu */}
                <Box sx={{
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    borderRadius: "8px",
                    border: '1px solid #ccc'
                }} width='250px' display='flex' flexDirection={'column'} padding='10px' gap='20px'>
                    
                    <Typography fontWeight={'bold'} fontSize={'25px'} textAlign={'center'}>ACCOUNT MANAGEMENT</Typography>

                    <Divider orientation='horizontal'/>

                    {/* Account Management */}
                    <Box display='flex' alignItems='center' onClick={() => setSelectedMenuItem('Account Management')} sx={{ cursor: 'pointer' }}>
                        <IconButton color="black">
                        </IconButton>
                        <Typography fontSize='19px'>Account Management</Typography>
                    </Box>

                    <Button variant="contained" color="secondary" onClick={handleSubmit}>
                        LOG OUT
                    </Button>
                </Box>

                {/* Right Side: Display Content Based on Selected Menu Item */}
                <Box sx={{
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    borderRadius: "8px",
                    border: '1px solid #ccc',
                    padding: '20px',
                    flex: '1',
                    overflow:"auto"
                }}>
                    {renderContent()}
                </Box>
                
                </Box>

            )}
        </Box>
    );
}

export default UserAccount;
