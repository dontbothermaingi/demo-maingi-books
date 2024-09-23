import { Box, IconButton, Typography, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

function TopBar() {
  const navigate = useNavigate(); // Hook to navigate programmatically


  function handleUserEdit() {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      navigate(`/user-edit/${userId}`); // Navigate to the UserEdit component with the userId
    } else {
      console.error("User ID not found");
    }
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor="#f2f0f0" borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1, color: 'black' }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1, color: 'black' }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* TITLE SECTION */}
      <Box display="flex">
        <Typography fontWeight="bold" fontSize="30px">MAINGI BOOKS</Typography>
      </Box>

      {/* ICONS SECTION */}
      <Box display="flex">
        <IconButton sx={{ color: 'black' }}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: 'black' }}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: 'black' }} onClick={handleUserEdit}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TopBar;
