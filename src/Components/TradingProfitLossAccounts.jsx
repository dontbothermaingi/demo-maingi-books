import { useEffect, useState, useRef } from "react";
import { Typography, Box, TextField, Button, Grid, Card } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import ReactToPrint from "react-to-print";

function TradingProfitLossAccount() {
    const [accounts, setAccounts] = useState([]);
    const [grossProfit, setGrossProfit] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [netLoss, setNetLoss] = useState(0);
    const [netSales, setNetSales] = useState(0);
    const [COGS, setCOGS] = useState(0);
    const [grossLoss, setGrossLoss] = useState(0);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('access_token')
    const componentRef = useRef()
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const filterByDateRange = (items, startDate, endDate) => {
        if (!startDate || !endDate) return items; // No filter if dates are not set
    
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
    
        return items.filter(item => {
            // Assuming item.date is in a non-ISO format like "Wed, 21 Aug 2024 00:00:00 GMT"
            const itemDate = new Date(item.date); // Converts the string to a Date object
            console.log("Item Date:", itemDate);
    
            if (isNaN(itemDate)) {
                console.error(`Invalid date: ${item.date}`);
                return false;
            }
    
            const isWithin = itemDate >= startDate && itemDate <= endDate;
            console.log(`Is ${itemDate} within range?`, isWithin);
    
            return isWithin;
        });
    };
    
    
    

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/tradingprofitandlossaccounts',{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }, 
            credentials:'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch account categories');
                }
                return response.json();
            })
            .then((data) => {
                const filteredData = filterByDateRange(data, startDate, endDate);
                console.log("Filtered Data:", filteredData);

                const groupedData = filteredData.reduce((acc, item) => {
                    if (!acc[item.category_name]) {
                        acc[item.category_name] = { ...item, amount: 0 };
                    }
                    acc[item.category_name].amount += parseFloat(item.amount);
                    return acc;
                }, {});

                const COGAS = Object.values(groupedData)
                    .filter(item => item.category_name === 'Cost of Goods Sold')
                    .reduce((total, item) => total + item.amount, 0);

                const closingStock = Object.values(groupedData)
                    .filter(item => item.category_name === 'Closing Stock')
                    .reduce((total, item) => total + item.amount, 0);

                const inventory_sales = Object.values(groupedData)
                    .filter(item => item.category_name === 'Inventory Sales')
                    .reduce((total, item) => total + item.amount, 0);

                const transport_sales = Object.values(groupedData)
                    .filter(item => item.category_name === 'Transport Sales')
                    .reduce((total, item) => total + item.amount, 0);

                const diesel_sales = Object.values(groupedData)
                    .filter(item => item.category_name === 'Diesel Sales')
                    .reduce((total, item) => total + item.amount, 0);

                const other_sales = Object.values(groupedData)
                    .filter(item => item.category_name === 'Other Sales')
                    .reduce((total, item) => total + item.amount, 0);

                const returnInwards = Object.values(groupedData)
                    .filter(item => item.category_name === 'Return Inwards')
                    .reduce((total, item) => total + item.amount, 0);

                const total_income = Object.values(groupedData)
                    .filter(item => item.type_name === 'Income')
                    .reduce((total, item) => total + item.amount, 0);

                const total_expenses = Object.values(groupedData)
                    .filter(item => item.type_name === 'Expenses')
                    .reduce((total, item) => total + item.amount, 0);
                setTotalExpenses(total_expenses);

                const COGs = COGAS - closingStock;
                const sales = inventory_sales + transport_sales + other_sales + diesel_sales;
                const netsales = sales - returnInwards;
                const gross_profit = netsales - COGs;
                const net_income = total_income + gross_profit;

                setGrossProfit(gross_profit < 0 ? 0 : gross_profit);
                setGrossLoss(gross_profit < 0 ? Math.abs(gross_profit) : 0);

                setNetProfit(net_income > total_expenses ? net_income - total_expenses : 0);
                setNetLoss(net_income <= total_expenses ? Math.abs(net_income - total_expenses) : 0);

                setCOGS(COGs);
                setNetSales(netsales);
                setTotalIncome(net_income);

                setAccounts(Object.values(groupedData));
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [startDate, endDate, token]);

    const renderAccountType = (typeName) => {
        return accounts
            .filter(account => account.type_name === typeName && account.amount > 0)
            .map(account => (
                <Box key={account.id} display={'flex'} justifyContent={'space-between'}>
                    <Typography>{account.category_name}</Typography>
                    <Typography>${new Intl.NumberFormat().format(account.amount.toFixed(2))}</Typography>
                </Box>
            ));
    };

    const renderExpenses = () => {
        return accounts
            .filter(account => account.type_name === 'Expenses' && account.amount > 0)
            .map(account => (
                <Box key={account.id} display={'flex'} justifyContent={'space-between'}>
                    <Typography>{account.category_name}</Typography>
                    <Typography>${new Intl.NumberFormat().format(account.amount.toFixed(2))}</Typography>
                </Box>
            ));
    };

    const renderIncome = () => {
        return accounts
            .filter(account => account.type_name === 'Income' && account.amount > 0)
            .map(account => (
                <Box key={account.id} >
                    <Typography>{account.category_name}</Typography>
                    <Typography>${new Intl.NumberFormat().format(account.amount.toFixed(2))}</Typography>
                </Box>
            ));
    };

    const renderGrossSection = () => {
        if (grossProfit > 0) {
            return (
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography>Gross Profit c/d</Typography>
                    <Typography>${new Intl.NumberFormat().format(grossProfit.toFixed(2))}</Typography>
                </Box>
            );
        } else {
            return (
                <>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography>Gross Loss c/d</Typography>
                        <Typography>${new Intl.NumberFormat().format(grossLoss.toFixed(2))}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography>Gross Loss b/d</Typography>
                        <Typography>${new Intl.NumberFormat().format(grossLoss.toFixed(2))}</Typography>
                    </Box>
                </>
            );
        }
    };

    const renderNetSection = () => {
        if (netProfit > 0) {
            return (
                <Box display={'flex'} justifyContent={'space-between'} >
                    <Typography>Net Profit c/d</Typography>
                    <Typography>${new Intl.NumberFormat().format(netProfit.toFixed(2))}</Typography>
                </Box>
            );
        } else {
            return (
                <Box display={'flex'} justifyContent={'space-between'} >
                    <Typography>Net Loss c/d</Typography>
                    <Typography>${new Intl.NumberFormat().format(netLoss.toFixed(2))}</Typography>
                </Box>
            );
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (

        <Box margin={{md:'40px', xs:'20px'}}>

            <Box mb={2}>
                <Typography fontSize='18px' fontWeight='bold'>FILTER BY DATE</Typography>
                <Box display={'flex'} gap={'5px'}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            </Box>
            <Box sx={{ padding: 2, backgroundColor: '#f5f5f5' }} ref={componentRef}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
                EKATI HAULIERS
            </Typography>
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                TRADING, PROFIT AND LOSS ACCOUNT
            </Typography>
            <Typography variant="h6" fontWeight="bold" textAlign="center" mb={3}>
                For the period {endDate ? new Intl.DateTimeFormat('en-US').format(new Date(endDate)) : new Intl.DateTimeFormat('en-US').format(todayDateOnly)}
            </Typography>

            

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: '#fff' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: 'underline', marginBottom: 2 }}>
                            Cost of Goods Sold
                        </Typography>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography>COGS</Typography>
                            <Typography>${new Intl.NumberFormat().format(COGS.toFixed(2))}</Typography>
                        </Box>
                        {renderGrossSection()}
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: '#fff' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: 'underline', marginBottom: 2 }}>
                            Sales
                        </Typography>
                        <Box>
                            {renderAccountType("Sales")}
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography>Net Sales</Typography>
                            <Typography>${new Intl.NumberFormat().format(netSales.toFixed(2))}</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Box mt={2} display={'flex'} justifyContent={'space-between'}>
                        <Typography>
                            <Typography>${new Intl.NumberFormat().format(Math.max(COGS, netSales).toFixed(2))}</Typography>
                        </Typography>
                        <Typography>
                            <Typography>${new Intl.NumberFormat().format(Math.max(COGS, netSales).toFixed(2))}</Typography>
                        </Typography>
            </Box>

            <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: '#fff' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: 'underline', marginBottom: 2 }}>
                            Expenses
                        </Typography>
                        {renderExpenses()}
                        {netProfit > 0 && renderNetSection()}
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: '#fff' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: 'underline', marginBottom: 2 }}>
                            Income
                        </Typography>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography>Gross Profit b/d</Typography>
                            <Typography>${new Intl.NumberFormat().format(grossProfit.toFixed(2))}</Typography>
                        </Box>
                        {renderIncome()}
                        {netLoss > 0 && renderNetSection()}
                    </Card>
                </Grid>
            </Grid>

            <Box mt={2} display={'flex'} justifyContent={'space-between'}>
                <Typography>
                    <Typography>${new Intl.NumberFormat().format(Math.max(totalExpenses, totalIncome).toFixed(2))}</Typography>
                </Typography>
                <Typography>
                    <Typography>${new Intl.NumberFormat().format(Math.max(totalExpenses, totalIncome).toFixed(2))}</Typography>
                </Typography>
            </Box>
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

export default TradingProfitLossAccount;

