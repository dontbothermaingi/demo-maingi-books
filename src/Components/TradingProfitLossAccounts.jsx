import { Box, Card, Grid, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";

function TradingProfitLossAccount() {
  const [COGS, setCOGS] = useState([]);
  const [invoiceSpecifics, setInvoiceSpecifics] = useState([]);
  const [inventorySales, setInventorySales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [billSpecifics, setBillSpecifics] = useState([]);
  const token = localStorage.getItem("access_token");
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  function filterByDateRange (items,startDate,endDate){
    if(!startDate || !endDate) return items;

    return items.filter(item => {
      const itemDate = new Date(item.bill_date || item.invoice_date)  // Converts the string intoa date object
      return itemDate >= startDate && itemDate <= endDate
    })
  }


  useEffect(() => {
    fetch(`https://maingi-demo-server.onrender.com/newbills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {

        const filterByDate = filterByDateRange(data, startDate, endDate);

        const billItems = filterByDate.flatMap((bill) =>
          bill.items.map((item) => ({
            ...item,
            ...bill,
          }))
        );

        const cogs = billItems.filter((item) => item.category_name === "Stock");
        setCOGS(cogs);

        const billsWithTotals = filterByDate.map((bill) => ({
          ...bill,
          total_amount: bill.items.reduce(
            (total, item) => total + Number(item.amount || 0),
            0
          ),
        }));

        const specifics = billsWithTotals.reduce((acc, item) => {
          if (!acc[item.category_name]) {
            acc[item.category_name] = { ...item, amount: 0, bills: [] };
          }

          acc[item.category_name].amount += parseFloat(item.total_amount);
          acc[item.category_name].bills.push(item);
          return acc;
        }, {});

        setBillSpecifics(Object.values(specifics));
      });
  }, [token, startDate, endDate]);

  useEffect(() => {
    fetch(`https://maingi-demo-server.onrender.com/invoices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.filter((item) => item.customer_name !== "EKATI FUELS");

        const filterByDate = filterByDateRange(filtered, startDate, endDate);

        const invoiceItems = filterByDate.flatMap((invoice) =>
          invoice.items.map((item) => ({
            ...item,
            ...invoice,
          }))
        );

        const invSales = invoiceItems.filter((item) => item.category_name === "Inventory Sales");
        setInventorySales(invSales);

        const invoiceWithTotals = filterByDate.map((invoice) => ({
          ...invoice,
          total_amount: invoice.items.reduce(
            (total, item) => total + Number(item.amount || 0),
            0
          ),
        }));

        const specifics = invoiceWithTotals.reduce((acc, item) => {
          if (!acc[item.category_name]) {
            acc[item.category_name] = { ...item, amount: 0, invoices: [] };
          }

          acc[item.category_name].amount += Number(item.total_amount);
          acc[item.category_name].invoices.push(item);
          return acc;
        }, {});

        setInvoiceSpecifics(Object.values(specifics));
      });
  }, [token, startDate, endDate]);

  // Totals
  const cogsTotal = COGS.reduce((total, item) => total + Number(item.amount || 0), 0);
  const invTotal = inventorySales.reduce((total, item) => total + Number(item.amount || 0), 0);
  const incomeTotal = invoiceSpecifics.reduce((total, item) => total + Number(item.amount || 0), 0);
  const expenseTotal = billSpecifics.reduce((total, item) => total + Number(item.amount || 0), 0);

  // Profit / Loss
  const grossDifference = invTotal - cogsTotal;
  const isGrossProfit = grossDifference >= 0;

  const netDifference = incomeTotal - expenseTotal;
  const isNetProfit = netDifference >= 0;

  return (
    <Box margin={{ md: "40px", xs: "0px" }}>
      <Box mb={2} margin={{ md: "40px", xs: "10px" }}>
        <Typography fontSize="18px" fontWeight="bold">
          FILTER BY DATE
        </Typography>
        <Box display={"flex"} gap={"5px"}>
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

      <Box sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
        <Typography fontFamily={"GT Bold"} fontSize={{md:'30px', xs:'25px'}} fontWeight="bold" textAlign="center" mb={2}>
          EKATI HAULIERS
        </Typography>
        <Typography fontFamily={"GT Medium"} fontSize={{md:'30px', xs:'20px'}} textAlign="center" mb={2}>
          TRADING, PROFIT AND LOSS ACCOUNT
        </Typography>
        <Typography fontFamily={"GT Medium"} fontSize={{md:'30px', xs:'20px'}} textAlign="center" mb={3}>
          For the period {endDate ? new Intl.DateTimeFormat("en-US").format(new Date(endDate)) : new Intl.DateTimeFormat('en-US').format(todayDateOnly)}
        </Typography>

        {/* COGS and Sales */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: "#fff" }}>
              <Typography variant="h6" fontWeight="bold" textDecoration={"underline"} mb={2}>
                Cost of Goods Sold
              </Typography>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontFamily={"GT Medium"} fontSize={{xs:'16px', md:'20px'}}>COGS</Typography>
                <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}}>{new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(cogsTotal.toFixed(2))}</Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: "#fff" }}>
              <Typography variant="h6" fontWeight="bold" textDecoration={"underline"} mb={2}>
                Sales
              </Typography>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontFamily={"GT Medium"} fontSize={{xs:'16px', md:'20px'}}>Inventory Sales</Typography>
                <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}}>{new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(invTotal.toFixed(2))}</Typography>
              </Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontFamily={"GT Medium"} fontSize={{xs:'16px', md:'20px'}}>Net Sales</Typography>
                <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}}>{new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format((invTotal - cogsTotal).toFixed(2))}</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Gross Profit/Loss c/d */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: "#fff" }}>
              <Typography fontFamily={"GT Medium"} fontSize={{xs:'16px', md:'20px'}}>
                {isGrossProfit ? "Gross Profit c/d" : "Gross Loss c/d"}
              </Typography>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}}>{isGrossProfit ? "Gross Profit" : "Gross Loss"}</Typography>
                <Typography>{new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(Math.abs(grossDifference).toFixed(2))}</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Income & Expenses */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: "#fff" }}>
              <Typography variant="h6" fontWeight="bold" textDecoration={"underline"} mb={2}>
                Expenses
              </Typography>
              {billSpecifics.map((item, index) => (
                <Box display={"flex"} justifyContent="space-between" key={index}>
                  <Typography fontFamily={"GT Medium"} fontSize={{xs:'16px', md:'20px'}}>{item.category_name}</Typography>
                  <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}}>{new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(Number(item.amount).toFixed(2))}</Typography>
                </Box>
              ))}
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: "#fff" }}>
              <Typography variant="h6" fontWeight="bold" textDecoration={"underline"} mb={2}>
                Income
              </Typography>
              {invoiceSpecifics.map((item, index) => (
                <Box display={"flex"} justifyContent="space-between" key={index}>
                  <Typography fontFamily={"GT Medium"} fontSize={{xs:'16px', md:'20px'}}>{item.category_name}</Typography>
                  <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}}>{new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(Number(item.amount).toFixed(2))}</Typography>
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>

        {/* Net Profit/Loss c/d */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: "#fff" }}>
              <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}} textAlign={'center'}>
                {isNetProfit ? "Net Profit c/d" : "Net Loss c/d"}
              </Typography>
              <Box display={"flex"} justifyContent={"center"}>
                <Typography fontFamily={"GT Light"} fontSize={{xs:'16px', md:'20px'}}>
                  {new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(Math.abs(netDifference).toFixed(2))}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Balancing Line */}
        <Box mt={2} display={"flex"} justifyContent={"space-between"}>
          <Typography fontFamily={"GT Light"} fontSize={{md:'25px', xs:"16px"}}>
            Total: {new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(Math.max(incomeTotal, expenseTotal).toFixed(2))}
          </Typography>
          <Typography fontFamily={"GT Light"} fontSize={{md:'25px', xs:"16px"}}>
            Total: {new Intl.NumberFormat("en-KE", { style:'currency', currency:"KES"}).format(Math.max(incomeTotal, expenseTotal).toFixed(2))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default TradingProfitLossAccount;
