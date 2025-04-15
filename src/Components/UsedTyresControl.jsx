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
        <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', padding:'20px'}}>
            <Typography fontFamily={"GT Bold"} fontSize={{xs:'20px', md:'29px'}}>
                Used Tyres Information
            </Typography>
            <Typography fontFamily={"GT Medium"} fontSize={{xs:'18px', md:'29px'}}>
                *IF YOU WANT TO ADD RETREAD TYRES TO YOUR STORE USE THE RETREAD TYRE BILL*
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>

                <Card>
                    <CardContent>
                        <Typography fontFamily={"GT Medium"} fontSize={{xs:'18px', md:'29px'}}>
                            1.  Fit Used Tyre
                        </Typography>
                        <Typography fontFamily={"GT Light"} fontSize={{xs:'15px', md:'19px'}}>
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
                        <Typography fontFamily={"GT Medium"} fontSize={{xs:'18px', md:'29px'}}>
                            2.  Unfit Used Tyre
                        </Typography>
                        <Typography fontFamily={"GT Light"} fontSize={{xs:'15px', md:'19px'}}>
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
                        <Typography fontFamily={"GT Medium"} fontSize={{xs:'18px', md:'29px'}}>
                            3.  View All Used Tyres
                        </Typography>
                        <Typography fontFamily={"GT Light"} fontSize={{xs:'15px', md:'19px'}}>
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
