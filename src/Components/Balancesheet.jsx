import { useEffect, useState, useRef } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TextField, Box, Button, Divider, Typography } from "@mui/material";
import ReactToPrint from "react-to-print";
import "./Balancesheet.css"; // Ensure this file exists and is properly set up

function BalanceSheet() {
    const [accounts, setAccounts] = useState([]);
    const componentRef = useRef();
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalLiabilities, setTotalLiabilities] = useState(0);
    const [startDate, setStartDate] = useState(null); // Initialize state
    const [endDate, setEndDate] = useState(null); // Initialize state
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/balancesheets')
            .then(response => response.json())
            .then((data) => {
                setAccounts(data);
            });
    }, []);

    const filterByDateRange = (items, startDate, endDate) => {
        if (!startDate || !endDate) return items; // No filter if dates are not set

        return items.filter(item => {
            const itemDate = new Date(item.date); // Converts the string to a Date object
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
    }, [accounts, startDate, endDate,groupedData]);

    const renderAccountType = (typeName) => {
        return Object.values(groupedData)
            .filter(account => account.type_name === typeName && account.amount > 0)
            .map(account => (
                <div key={account.id} className="account-category">
                    <span>{account.category_name}</span>
                    <span>${new Intl.NumberFormat().format(account.amount.toFixed(2))}</span>
                </div>
            ));
    };

    const capital = totalAssets - totalLiabilities;

    return (
        <Box>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Typography
                        fontSize='22px'
                        fontWeight='bold'
                    >
                        FILTER BY DATE
                    </Typography>
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
            
            <div ref={componentRef} className="balance-sheet">
                <Typography fontSize='25px' fontWeight='bold' textAlign='center'>EKATI HAULIERS</Typography>
                <Typography fontSize='25px' fontWeight='bold' textAlign='center'>Balance Sheet</Typography>
                <Typography fontSize='25px' fontWeight='bold' textAlign='center' mb='20px'> As of {endDate ? new Intl.DateTimeFormat('en-US').format(new Date(endDate)) :  new Intl.DateTimeFormat('en-US').format(todayDateOnly)}</Typography>

                <div className="balance-sheet-content">
                    <div className="assets-section">
                        <Typography fontSize='25px' fontWeight='bold' sx={{textDecoration:'underline'}} mb='20px'>Assets</Typography>
                        <div className="account-type">
                        <Typography fontSize='20px' fontWeight='bold'>Fixed Assets</Typography> 
                            {renderAccountType("Fixed Assets")}
                        </div>
                        <div className="account-type">
                        <Typography fontSize='20px' fontWeight='bold'>Current Assets</Typography>
                            {renderAccountType("Current Assets")}
                        </div>
                    </div>

                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'black' }} />

                    <div className="capital-liabilities-section">
                    <Typography fontSize='25px' fontWeight='bold' sx={{textDecoration:'underline'}} mb='20px'>Capital & Liabilities</Typography>
                        <div className="capital-section">
                        <Typography fontSize='20px' fontWeight='bold'>Capital</Typography>
                            <div className="account-category">
                                <span>Total Capital</span>
                                <span>${new Intl.NumberFormat().format(capital.toFixed(2))}</span>
                            </div>
                        </div>
                        <div className="account-type">
                        <Typography fontSize='20px' fontWeight='bold'>Long Term Liabilities</Typography>
                            {renderAccountType("Long Term Liabilities")}
                        </div>
                        <div className="account-type">
                        <Typography fontSize='20px' fontWeight='bold'>Short Term Liabilities</Typography>
                            {renderAccountType("Short Term Liabilities")}
                        </div>
                    </div>
                </div>

                <div className="totals">
                    <div className="total-assets">
                        <h4>Total Assets</h4>
                        <h4>${new Intl.NumberFormat().format(totalAssets.toFixed(2))}</h4>
                    </div>
                    <div className="total-liabilities">
                        <h4>Total Capital & Liabilities</h4>
                        <h4>${new Intl.NumberFormat().format((totalLiabilities + capital).toFixed(2))}</h4>
                    </div>
                </div>
            </div>

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

export default BalanceSheet;
