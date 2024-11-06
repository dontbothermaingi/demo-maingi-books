import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function FuelBillControl() {
    const navigate = useNavigate();

    function handleOwnPumps() {
        navigate('/fuel-bill');
    }

    function handleOtherPumps() {
        navigate('/bill-fuel');
    }

    function handleBack() {
        navigate('/bill-control');
    }

    return (

        <Box>

            <Button
               type="button"
               variant="contained"
               color="secondary"
               onClick={handleBack}
               sx={{margin:'30px'}}

            >
                BACK
            </Button>
        <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', mt:'50px',}}>
            <Typography variant="h4" gutterBottom>
                Fuel Bill Information
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            1. BUY FUEL FOR YOUR OWN PUMP
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            If own a gas pump you can add fuel to it using this bill.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOwnPumps}
                        >
                            BUY FUEL
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            2. FUEL YOUR VEHICLE USING A PUMP THAT YOU DO NOT OWN
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Fuel your vehicles using pumps that you do not own.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOtherPumps}
                        >
                            Fuel
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
        </Box>
    );
}

export default FuelBillControl;
