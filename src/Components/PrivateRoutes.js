import { Outlet,useNavigate } from "react-router-dom";
import SideBar from './SideBar';
import Topbar from './Topbar';
import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";

function PrivateRoutes() {
    // Fetch access token and user ID from local storage
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://maingi-demo-server.onrender.com/check_session', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // Check if the response indicates an error (e.g., unauthorized access)
            if (response.ok) {
                return response.json(); // Call the function to get the JSON data
            } else {
                // If the response is not OK, navigate to login
                navigate('/login');
            }
        })
        .then(data => {
            // Handle the data received if needed
            console.log('Session data:', data);
        })
        .catch(error => {
            console.error('Error fetching session:', error);
            // Optionally navigate to login on error as well
            navigate('/login');
        });
    }, [navigate, token]);
    

    const handleLogOut = () => {
        // Remove access token, refresh token, and token expiry time from localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        navigate('/login')
      };

    return (
        <Box>
            {isMobile ? (
                <Box display="flex" height="100vh">
                    

                    <Box flex="1" display="flex" flexDirection="column" justifyContent="space-between" overflow={'auto'}>
                        <Box>
                            <Topbar />
                        </Box>

                        <Box flex="1" display="flex" flexDirection="column" justifyContent="space-between" overflow={'auto'}>
                            <Outlet />
                        </Box>

                       
                    </Box>
                </Box>
            ):(
                <Box display="flex" height="100vh">
                    <Box>
                        <SideBar onLogout={handleLogOut} />
                    </Box>

                    <Box flex="1" display="flex" flexDirection="column" justifyContent="space-between" overflow={'auto'}>
                        <Box>
                            <Topbar />
                        </Box>

                        <Box flex="1" display="flex" flexDirection="column" justifyContent="space-between" overflow={'auto'}>
                            <Outlet />
                        </Box>
                    </Box>
                </Box>
            )}
           
        
        </Box>

    );
}

export default PrivateRoutes;
