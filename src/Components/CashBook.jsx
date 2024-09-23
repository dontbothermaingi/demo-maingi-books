import { useEffect,useRef, useState } from "react";
import { Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { format } from "date-fns"; // Import the format function from date-fns
import { TextField, Box } from "@mui/material";
import "./CashBook.css"; // Ensure this file exists and is properly set up
import ReactToPrint from 'react-to-print';


function CashBook() {
    const [paymentsReceived, setPaymentsReceived] = useState([]);
    const [paymentsMade, setPaymentsMade] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const componentRef = useRef();


    const filterByDateRange = (items, startDate, endDate) => {
        if (!startDate || !endDate) return items; // No filter if dates are not set

        return items.filter(item => {
            const itemDate = new Date(item.date); // Converts the string to a Date object
            return itemDate >= startDate && itemDate <= endDate;
        });
    };

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/cashbooks')
            .then(response => response.json())
            .then((data) => {
                setPaymentsReceived(filterByDateRange(data, startDate, endDate));
            });
    }, [startDate, endDate]); // Add startDate and endDate to the dependency array

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/cashbookdebits')
            .then(response => response.json())
            .then((data) => {

                setPaymentsMade(filterByDateRange(data, startDate, endDate));
            });
    }, [startDate, endDate]); // Add startDate and endDate to the dependency array

    // Calculate Debit Side Total
    const calculateBankDebit = paymentsMade.reduce((total, item) => total + item.bank_amount, 0)
    const calculateCashDebit = paymentsMade.reduce((total, item) => total + item.cash_amount, 0)

    const debitTotal = calculateBankDebit + calculateCashDebit

    // Calculate Credit Side Total
    const calculateBankCredit = paymentsReceived.reduce((total, item) => total + item.bank_amount, 0)
    const calculateCashCredit = paymentsReceived.reduce((total, item) => total + item.cash_amount, 0)

    const creditTotal = calculateBankCredit + calculateCashCredit


    const paymentsMA = [
        {
            field: "date",
            headerName: "DATE",
            flex: 0.2,
        },
        {
            field: "item_details",
            headerName: "DETAILS",
            flex: 0.2,
            cellClassName: "name-column--cell",
        },
        {
            field: "bank",
            headerName: "BANK",
            flex: 0.2,
            cellClassName: "name-column--cell",
        },
        {
            field: "cash_amount",
            headerName: "CASH",
            flex: 0.2,
        },
        {
            field: "bank_amount",
            headerName: "BANK",
            flex: 0.2,
        },
    ];

    const paymentsRE = [
        {
            field: "date",
            headerName: "DATE",
            flex: 0.15,
        },
        {
            field: "item_details",
            headerName: "DETAILS",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.3,
            align: "left",
        },
        {
            field: "bank",
            headerName: "BANK",
            flex: 0.2,
            cellClassName: "name-column--cell",
        },
        {
            field: "cash_amount",
            headerName: "CASH",
            flex: 0.2,
        },
        {
            field: "bank_amount",
            headerName: "BANK",
            flex: 0.2,
        },
    ];

    return (
        <Box>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography
                    fontSize='23px'
                    fontWeight='Bold'
                >FILTER BY DATE</Typography>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>

            <Box ref={componentRef}  className="a4-print" width='1500px' justifyContent='center' display='flex' flexDirection='column'>
                <Box>
                <Typography fontSize='25px' fontWeight='bold' textAlign='center'>EKATI HAULIERS</Typography>
                <Typography fontSize='25px' fontWeight='bold' textAlign='center'>CASH BOOK</Typography>
                </Box>

                <div className="cash-book-content">
                    <div className="assets-section">
                        <Box marginBottom='30px' className="table-container">
                            <Typography fontSize='25px' fontWeight='bold' textAlign='center'className="OWE">Dr</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {paymentsRE.map((column) => (
                                                <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '10px' }}>{column.headerName}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentsReceived.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell> 
                                                <TableCell>{item.item_details}</TableCell>
                                                <TableCell>{item.bank}</TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(item.cash_amount)}</TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(item.bank_amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </div>

                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'black' }} />
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'black' }} />


                    <div className="capital-liabilities-section">
                        <Box marginBottom='30px' className="table-container">
                        <Typography fontSize='25px' fontWeight='bold' textAlign='center'className="OWE">Cr</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {paymentsMA.map((column) => (
                                                <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '10px' }}>{column.headerName}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentsMade.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell> 
                                                <TableCell>{item.item_details}</TableCell>
                                                <TableCell>{item.bank}</TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(item.cash_amount)}</TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(item.bank_amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </div>
                </div>

                <div className="totals">
                    <div className="total-assets">
                        <Typography fontSize='25px'>Total</Typography>
                        <Typography fontSize='25px'>${new Intl.NumberFormat().format((creditTotal).toFixed(2))}</Typography>
                    </div>
                    <div className="total-liabilities">
                        <Typography fontSize='25px'>Total</Typography>
                        <Typography fontSize='25px'>${new Intl.NumberFormat().format((debitTotal).toFixed(2))}</Typography>
                    </div>
                </div>
            </Box>

            <Box display="flex" justifyContent="center" mt="20px">
                    <ReactToPrint
                    trigger={() => (
                        <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: "#a4a9fc",
                            color: "#141414",
                            '&:hover': {
                            backgroundColor: "#6870fa",
                            },
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        >
                        Print
                        </Button>
                        
                    )}
                    content={() => componentRef.current}
                    />
            </Box>

        </Box>
    );
}

export default CashBook;
