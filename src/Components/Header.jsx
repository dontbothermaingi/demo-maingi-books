import { Typography, Box} from "@mui/material";

const Header = ({ title, subtitle, righttitle, rightsubtitle }) => {
  return (
    <Box display='flex' justifyContent='space-between' margin="30px">
          <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            ml='20px'
            mt='20px'
          >
            {title}
          </Typography>
          <Typography 
              variant="h6"
              ml='20px'
              mt='20px'
        >
            {subtitle}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h2"
            fontWeight="bold"
          >
            {righttitle}
          </Typography>
          <Typography variant="h5">
            {rightsubtitle}
          </Typography>
        </Box>

    </Box>
  );
};

export default Header;