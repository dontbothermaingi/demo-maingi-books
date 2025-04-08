import { useEffect, useState, useRef } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TextField, Box, Button, Typography, Paper, Card, Grid } from "@mui/material";
import ReactToPrint from "react-to-print";

function BalanceSheet() {
    const [accounts, setAccounts] = useState([]);
    const componentRef = useRef();
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalLiabilities, setTotalLiabilities] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const token = localStorage.getItem('access_token')
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/balancesheets', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {
                setAccounts(data);
            });
    }, [token]);

    const filterByDateRange = (items, startDate, endDate) => {
        if (!startDate || !endDate) return items;

        return items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
        });
    };

    const filteredData = filterByDateRange(accounts, startDate, endDate);

    const groupedData = filteredData.reduce((acc, item) => {
        if (!acc[item.category_name]) {
            acc[item.category_name] = { ...item, amount: 0 };
        }
        acc[item.category_name].amount += parseFloat(item.amount);
        return acc;
    }, {});

    useEffect(() => {
        let assets = 0;
        let liabilities = 0;

        Object.values(groupedData).forEach(account => {
            if (account.type_name === "Fixed Assets" || account.type_name === "Current Assets") {
                assets += account.amount;
            } else if (account.type_name === "Long Term Liabilities" || account.type_name === "Short Term Liabilities") {
                liabilities += account.amount;
            }
        });

        setTotalAssets(assets);
        setTotalLiabilities(liabilities);
    }, [accounts, startDate, endDate, groupedData]);

    const renderAccountType = (typeName) => {
        return Object.values(groupedData)
            .filter(account => account.type_name === typeName && account.amount > 0)
            .map(account => (
                <Box key={account.id} display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{account.category_name}</Typography>
                    <Typography>${new Intl.NumberFormat().format(account.amount.toFixed(2))}</Typography>
                </Box>
            ));
    };

    const capital = totalAssets - totalLiabilities;

    return (
        <Box p={3} margin={{ md:'40px', xs:'15px'}}>
            <Box mb={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>FILTER BY DATE</Typography>
                    <Box display="flex" gap={2}>
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
                    </Box>
                </LocalizationProvider>
            </Box>

            <Paper ref={componentRef} sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center">EKATI HAULIERS</Typography>
                <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 1 }}>Balance Sheet</Typography>
                <Typography variant="h6" textAlign="center" mb={3}>
                    As of {endDate ? new Intl.DateTimeFormat('en-US').format(new Date(endDate)) : new Intl.DateTimeFormat('en-US').format(todayDateOnly)}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: '#fff', display: 'flex', flexDirection: { xs: 'column', md: 'column' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: 'underline', color: '#3f51b5' }} mb={2}>Assets</Typography>
                            <Box mb={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Fixed Assets</Typography>
                                {renderAccountType("Fixed Assets")}
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Current Assets</Typography>
                                {renderAccountType("Current Assets")}
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: '#fff', display: 'flex', flexDirection: { xs: 'column', md: 'column' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: 'underline', color: '#3f51b5' }} mb={2}>Capital & Liabilities</Typography>
                            <Box mb={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Capital</Typography>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Total Capital</Typography>
                                    <Typography>${new Intl.NumberFormat().format(capital.toFixed(2))}</Typography>
                                </Box>
                            </Box>
                            <Box mb={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Long Term Liabilities</Typography>
                                {renderAccountType("Long Term Liabilities")}
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Short Term Liabilities</Typography>
                                {renderAccountType("Short Term Liabilities")}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>


                <Box mt={2} display={'flex'} justifyContent={'space-between'}>
                    <Typography>
                        <Typography variant="subtitle1" fontWeight="bold">Total Assets</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">${new Intl.NumberFormat().format(totalAssets.toFixed(2))}</Typography>
                    </Typography>
                    <Typography>
                        <Typography variant="subtitle1" fontWeight="bold">Total Capital & Liabilities</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">${new Intl.NumberFormat().format((totalLiabilities + capital).toFixed(2))}</Typography>
                    </Typography>
                </Box>
            </Paper>

            <Box display="flex" justifyContent="center" mt={3}>
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

export default BalanceSheet;
