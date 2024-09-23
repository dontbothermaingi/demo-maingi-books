import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RetreadTyreControl() {
    const navigate = useNavigate();

    function handleFitRetreadTyre() {
        navigate('/retread-tyres');
    }

    function handleRemoveRetreadTyre() {
        navigate('/unfit-retread-tyre');
    }

    function handleCheckFittedRetreadTyres() {
        navigate('/fitted-retread-tyres');
    }

    return (
        <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', mt:'50px',}}>
            <Typography variant="h4" gutterBottom>
                Retread Tyre Information
            </Typography>
            <Typography gutterBottom>
                    <h2 className="OWE">*IF YOU WANT TO ADD RETREAD TYRES TO YOUR STORE USE THE RETREAD TYRE BILL*</h2>
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            1. Fit Retread Tyre
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use to fit retread tyre's to your vehicle.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFitRetreadTyre}
                        >
                            Fit Rtread Tyre
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            2. Unfit Retread Tyre
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use to unfit used retread tyres.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRemoveRetreadTyre}
                        >
                            Unfit Retread Tyre
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            3. Check Fitted Retread Tyres
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use to check fitted new tyres.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCheckFittedRetreadTyres}
                        >
                            Check Fitted Retread Tyres
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default RetreadTyreControl;
