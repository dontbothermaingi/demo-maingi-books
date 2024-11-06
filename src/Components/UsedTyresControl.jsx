import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function UsedTyresControl() {
    const navigate = useNavigate();

    function handleUsedTyres() {
        navigate('/check-used-tyre');
    }

    function handleUnfitUsedTyre() {
        navigate('/unfit-used-tyre');
    }

    function handleFitUsedTyre() {
        navigate('/fit-used-tyre');
    }

    return (
        <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', mt:'50px',}}>
            <Typography variant="h4" gutterBottom>
                Used Tyres Information
            </Typography>
            <Typography gutterBottom>
                    <h2 className="OWE">*IF YOU WANT TO ADD RETREAD TYRES TO YOUR STORE USE THE RETREAD TYRE BILL*</h2>
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            1.  Fit Used Tyre
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Fit used tyre.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFitUsedTyre}
                        >
                            Fit
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            2.  Unfit Used Tyre
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Unfit used tyre.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUnfitUsedTyre}
                        >
                            Unfit
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            3.  View All Used Tyres
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Check all used tyres.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUsedTyres}
                        >
                            View
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default UsedTyresControl;
