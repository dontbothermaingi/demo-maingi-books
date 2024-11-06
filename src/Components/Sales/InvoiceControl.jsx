import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function InvoiceControl() {
    const navigate = useNavigate();

    function handleInventoryInvoice() {
        navigate('/inventory-invoice');
    }

    function handleTransportInvoice() {
        navigate('/invoice-transport');
    }

    function handleCustomInvoice() {
        navigate('/custom-invoice');
    }

    function handleFuelInvoice() {
        navigate('/fuel-invoice');
    }

    function handlePaymentReminder() {
        navigate('/payments-received');
    }

    return (
        <Container sx={{display:'flex', flexDirection:'column', justifyContent:'center', mt:'50px'}}>
            <Typography variant="h4" gutterBottom>
                Invoice Information
            </Typography>
            
            <Box mb={4}>
                <Typography variant="h6" color="textPrimary">
                    <strong>Important Reminder:</strong>
                </Typography>
                <Typography fontSize='17px' color="textSecondary" paragraph>
                    After you  <strong>create an invoice and receive payment</strong>, it is crucial to record this payment in the "Payments Received" section. This step ensures that our system accurately reflects that the invoice has been paid. If you do not update this, the system will assume the invoice is still unpaid, which could lead to inaccuracies in your financial records.
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handlePaymentReminder}
                >
                    Go to Payments Received
                </Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            1. Inventory Invoice
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the INVENTORY INVOICE when you want to sell items and update your item inventory.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleInventoryInvoice}
                        >
                            Go to Inventory Invoice
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            2. Transport Invoice
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the TRANSPORT INVOICE when you want to sell transport services.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleTransportInvoice}
                        >
                            Go to Transport Invoice
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            3. Fuel Invoice
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the FUEL INVOICE when you want to record fuel transactions.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFuelInvoice}
                        >
                            Go to Fuel Invoice
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            4. Custom Invoice
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the CUSTOM INVOICE when you want to sell goods or services that do not involve transport or inventory.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCustomInvoice}
                        >
                            Go to Custom Invoice
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default InvoiceControl;
