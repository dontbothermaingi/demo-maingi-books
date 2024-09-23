import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BillControl() {
    const navigate = useNavigate();

    function handleInventoryBill() {
        navigate('/inventory-bill');
    }

    function handleSpareBill() {
        navigate('/spare-bill');
    }

    function handleCustomBill() {
        navigate('/custom-bill');
    }

    function handleFuelBill() {
        navigate('/fuel-bill-control');
    }

    function handleTyreBill() {
        navigate('/tyre-bill');
    }

    function handleRetreadTyreBill() {
        navigate('/retread-tyre-bill');
    }

    function handlePaymentReminder() {
        navigate('/payments-made');
    }

    return (
        <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', mt:'50px'}}>
            <Typography variant="h4" gutterBottom>
                Bill Information
            </Typography>

            <Box mb={4}>
                <Typography variant="h6" color="textPrimary">
                    <strong>Important Reminder:</strong>
                </Typography>
                <Typography fontSize='17px' color="textSecondary" paragraph>
                    After you <strong>create a bill and make a payment to the vendor</strong>, it's essential to record the payment in the "Payments Made" section. This ensures that our system accurately reflects that the payment has been completed. If you do not update this, the system will assume the payment has not been made, which can lead to discrepancies in your financial records.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handlePaymentReminder}
                >
                    Go to Payments Made
                </Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            1. Inventory Bill
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the INVENTORY BILL when you want to purchase items and add them to your item inventory.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleInventoryBill}
                        >
                            Go to Inventory Bill
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            2. Spare Bill
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the SPARE BILL when you want to purchase spare parts and add them to your spare inventory.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSpareBill}
                        >
                            Go to Spare Bill
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            3. Custom Bill
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the CUSTOM BILL when you want to purchase items that do not affect your spare or item inventory.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCustomBill}
                        >
                            Go to Custom Bill
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            4. Fuel Bill
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the FUEL BILL when you want to purchase fuel and add it to your pumps.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFuelBill}
                        >
                            Go to Fuel Bill
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            5. New Tyre Bill
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the NEW TYRE BILL when you want to purchase new tyres and add them to your store.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleTyreBill}
                        >
                            Go to Tyre Bill
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            6. Retread Tyre Bill
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the RETREAD TYRE BILL when you want to add retread tyres to your store.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRetreadTyreBill}
                        >
                            Go to Retread Tyre Bill
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default BillControl;
