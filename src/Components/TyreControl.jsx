import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function TyreControl() {
    const navigate = useNavigate();

    function handleFitNewTyre() {
        navigate('/fit-new-tyre');
    }

    function handleRemoveNewTyre() {
        navigate('/unfit-new-tyre');
    }

    function handleCheckFittedTYres() {
        navigate('/fitted-new-tyres');
    }

    return (
        <Box margin={{md:'40px', xs:'20px'}} height={'100vh'} overflow={'auto'}>
            <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', mt:'50px',}}>
                <Typography variant="h4" gutterBottom>
                    Tyre Information
                </Typography>
                <Typography gutterBottom>
                        <h2 className="OWE">*IF YOU WANT TO ADD NEW TYRES TO YOUR STORE USE THE TYRE BILL*</h2>
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                1. Fit New Tyre
                            </Typography>
                            <Typography fontSize='17px' color="textSecondary" paragraph>
                                Use to fit new tyre's only to your vehicle.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFitNewTyre}
                            >
                                Fit New Tyre
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                2. Unfit Tyre
                            </Typography>
                            <Typography fontSize='17px' color="textSecondary" paragraph>
                                Use to unfit used new tyres.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRemoveNewTyre}
                            >
                                Unfit Tyre
                            </Button>
                        </CardContent>
                    </Card>

                    <Card sx={{mb:'30px'}}>
                        <CardContent>
                            <Typography variant="h5">
                                3. Check Fitted New Tyres
                            </Typography>
                            <Typography fontSize='17px' color="textSecondary" paragraph>
                                Use to check fitted new tyres.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCheckFittedTYres}
                            >
                                Check Fitted New Tyres
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}

export default TyreControl;
