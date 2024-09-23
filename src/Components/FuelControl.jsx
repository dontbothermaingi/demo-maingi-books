import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function FuelControl() {
    const navigate = useNavigate();

    function handleCreatePump() {
        navigate('/create-pump');
    }

    function handleFuel() {
        navigate('/fuelings');
    }
    

    return (
        <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', mt:'50px',}}>
            <Typography variant="h4" gutterBottom>
                Pump Information
            </Typography>
            <Typography gutterBottom>
                    <h2 className="OWE">*IF YOU WANT TO ADD FUEL TO YOUR PUMP USE THE FUEL BILL*</h2>
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            1. Create Pump
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            If own a gas pump you can create and keep track of it.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreatePump}
                        >
                            Create Pump
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            2. Fuel 
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Fuel your vehicles using your own pump.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFuel}
                        >
                            Fuel
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default FuelControl;
