import { useEffect, useRef, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { format } from "date-fns";
import ReactToPrint from "react-to-print";

function CashBook() {
  const [paymentsReceived, setPaymentsReceived] = useState([]);
  const [paymentsMade, setPaymentsMade] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const token = localStorage.getItem('access_token')
  const componentRef = useRef();

  const filterByDateRange = (items, startDate, endDate) => {
    if (!startDate || !endDate) return items;
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  useEffect(() => {
    fetch("https://demo-server-757m.onrender.com/cashbooks", {
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`
      },
      credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setPaymentsReceived(filterByDateRange(data, startDate, endDate));
      });
  }, [startDate, endDate, token]);

  useEffect(() => {
    fetch("https://demo-server-757m.onrender.com/cashbookdebits", {
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`
      },
      credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setPaymentsMade(filterByDateRange(data, startDate, endDate));
      });
  }, [startDate, endDate, token]);

  const calculateBankDebit = paymentsMade.reduce(
    (total, item) => total + item.bank_amount,
    0
  );
  const calculateCashDebit = paymentsMade.reduce(
    (total, item) => total + item.cash_amount,
    0
  );
  const debitTotal = calculateBankDebit + calculateCashDebit;

  const calculateBankCredit = paymentsReceived.reduce(
    (total, item) => total + item.bank_amount,
    0
  );
  const calculateCashCredit = paymentsReceived.reduce(
    (total, item) => total + item.cash_amount,
    0
  );
  const creditTotal = calculateBankCredit + calculateCashCredit;

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f3f4f6"}} margin={{md:'40px', xs:'20px'}} >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb={4}
        sx={{
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          MAINGI BOOKS
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Cash Book
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="space-around"
        mb={4}
        sx={{ gap: 2 }}
      >
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

      <Box ref={componentRef} sx={{ backgroundColor: "#ffffff", padding: 1 }}>
        <Box display="flex" justifyContent="space-between" flexDirection={{xs:'column', md:'row'}} mb={4}>
          <Box width={{xs:'100%',  md:'48%'}} mb={{xs:"30px"}}>
            <Typography variant="h6" textAlign="center" color="secondary">
              Debit Side
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Bank</TableCell>
                    <TableCell>Cash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentsReceived.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{item.item_details}</TableCell>
                      <TableCell>{item.bank}</TableCell>
                      <TableCell>{item.cash_amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box width={{xs:'100%',  md:'48%'}} mb={{xs:"30px"}}>
            <Typography variant="h6" textAlign="center" color="secondary">
              Credit Side
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Bank</TableCell>
                    <TableCell>Cash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentsMade.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{item.item_details}</TableCell>
                      <TableCell>{item.bank}</TableCell>
                      <TableCell>{item.cash_amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-around"
          mt={4}
          sx={{
            backgroundColor: "#f3f3f3",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              Debit Total
            </Typography>
            <Typography variant="body1">${debitTotal.toLocaleString()}</Typography>
          </Box>

          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              Credit Total
            </Typography>
            <Typography variant="body1">${creditTotal.toLocaleString()}</Typography>
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt={4}>
        <ReactToPrint
          trigger={() => (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#6870fa",
                color: "#ffffff",
                padding: "10px 20px",
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
