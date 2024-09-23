import { Typography, Box, CircularProgress, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';

function UserEdit() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        setLoading(true);
        fetch(`https://db-demo-u07o.onrender.com/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }
                return response.json();
            })
            .then(data => {
                setFormData({
                    username: data.username || "",
                    email: data.email || "",
                    phone_number: data.phone_number || "",
                    password: "", // Do not display password
                });
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);

    return (
        <Box p={2}>
            <Typography fontSize='25px' fontWeight='bold' textAlign='center'>User Profile</Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                        <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Box mb={2} width="100%" maxWidth="600px">
                        <Typography variant="h6"><strong>Username:</strong> {formData.username}</Typography>
                    </Box>
                    <Box mb={2} width="100%" maxWidth="600px">
                        <Typography variant="h6"><strong>Email:</strong> {formData.email}</Typography>
                    </Box>
                    <Box mb={2} width="100%" maxWidth="600px">
                        <Typography variant="h6"><strong>Phone Number:</strong> {formData.phone_number}</Typography>
                    </Box>
                    {/* Password is not displayed for security reasons */}
                </Box>
            )}
        </Box>
    );
}

export default UserEdit;
