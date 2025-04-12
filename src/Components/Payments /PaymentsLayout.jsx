import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import {
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import "./PaymentsMade.css"; // Import custom CSS for additional styling
import { useNavigate } from "react-router";

const PaymentLayout = ({
  customerName,
  customerEmail,
  customerPhone,
  paymentDate,
  customerPin,
  title,
  paymentAmount,
  payment,
  currency,
  paymentMode,
  transactionItems,
}) => {
  const componentRef = useRef();
  const navigate =useNavigate()

  const currencyLocaleMap = {
    AED: "en-AE", // United Arab Emirates Dirham
    AUD: "en-AU", // Australian Dollar
    CAD: "en-CA", // Canadian Dollar
    CHF: "de-CH", // Swiss Franc
    CNY: "zh-CN", // Chinese Yuan
    EUR: "de-DE", // Euro
    GBP: "en-GB", // British Pound
    HKD: "en-HK", // Hong Kong Dollar
    IDR: "id-ID", // Indonesian Rupiah
    ILS: "he-IL", // Israeli New Shekel
    INR: "en-IN", // Indian Rupee
    JPY: "ja-JP", // Japanese Yen
    KES: "en-KE", // Kenyan Shilling
    NZD: "en-NZ", // New Zealand Dollar
    SGD: "en-SG", // Singapore Dollar
    THB: "th-TH", // Thai Baht
    TRY: "tr-TR", // Turkish Lira
    USD: "en-US", // United States Dollar
    ZAR: "en-ZA", // South African Rand
    MXN: "es-MX", // Mexican Peso
    BRL: "pt-BR", // Brazilian Real
  };

  const formattedPaymentAmount = new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE',{style:'currency', currency:currency}).format(paymentAmount);

  const handleViewDetails = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const columns = [
    {
      field: "customer_name",
      headerName: "CUSTOMER NAME",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
      >
        <Typography
            variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
    {
      field: "invoice_number",
      headerName: "INVOICE NUMBER",
      flex: 0.3,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
      >
        <Typography
            variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
    {
      field: "invoice_date",
      headerName: "DATE",
      flex: 0.3,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
      >
        <Typography
            variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 0.4,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
      >
        <Typography
            variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
    {
      field: "invoice_total",
      headerName: "INVOICE TOTAL",
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
      >
        <Typography
            variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
    {
      field: "amount_owed",
      headerName: "AMOUNT OWED",
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
      >
        <Typography
            variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
]

  return (
    <Box padding="20px">
      {/* Print Button */}
      <Box padding={'20px'}>
        <ReactToPrint
          trigger={() => (
            <Button
              variant="contained"
              color="primary"
              sx={{fontFamily:'GT Bold'}}
            >
              Print
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Box>

      <Box ref={componentRef} className="a4-print" padding="20px" border="1px solid #ddd">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb="30px">
          <Box>
            <Typography fontSize="28px" fontWeight="bold" color="black">
              EKATI HAULIERS
            </Typography>
            <Typography variant="body1" color="black">
              Emali, Makueni, Kenya
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography fontSize="28px" fontWeight="bold" color="black">
              {title}
            </Typography>
            <Typography variant="body2" color="black">
              Payment: {payment}
            </Typography>
            <Typography variant="body2" color="black">
              Date: {paymentDate}
            </Typography>
            <Typography variant="body2" color="black">
              Amount: {formattedPaymentAmount}
            </Typography>
            <Typography variant="body2" color="black">
              Paid via: {paymentMode}
            </Typography>
          </Box>
        </Box>

        {/* Vendor Details */}
        <Box mt="20px" mb="20px" textAlign="right">
          <Typography fontSize="24px" fontWeight="bold" color="black" mb="10px">
            CUSTOMER DETAILS
          </Typography>
          <Typography variant="body2" color="black">
            Name: {customerName}
          </Typography>
          <Typography variant="body2" color="black">
            Email: {customerEmail}
          </Typography>
          <Typography variant="body2" color="black">
            Phone: {customerPhone}
          </Typography>
          <Typography variant="body2" color="black">
            KRA PIN: {customerPin}
          </Typography>
        </Box>

        {/* Divider */}
        <Divider />

        <Typography fontSize={'20px'} fontWeight={'bold'} textAlign={'center'} margin={'20px'}>INVOICES ASSOCIATED WITH THIS PAYMENT</Typography>
        <Box marginBottom='20px' className="table-container">
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize:'13px' }}>{column.headerName}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {transactionItems && transactionItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell onClick={() => handleViewDetails(item.invoice_id)} sx={{cursor:'pointer'}}>{item.customer_name}</TableCell>
                                <TableCell onClick={() => handleViewDetails(item.invoice_id)} sx={{cursor:'pointer'}}>{item.invoice_number}</TableCell>
                                <TableCell onClick={() => handleViewDetails(item.invoice_id)} sx={{cursor:'pointer'}}>{item.invoice_date}</TableCell>
                                <TableCell onClick={() => handleViewDetails(item.invoice_id)} sx={{cursor:'pointer'}}>{item.status}</TableCell>
                                <TableCell onClick={() => handleViewDetails(item.invoice_id)} sx={{cursor:'pointer'}}>{new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE',{style:'currency', currency:currency}).format(item.invoice_total)}</TableCell>
                                <TableCell onClick={() => handleViewDetails(item.invoice_id)} sx={{cursor:'pointer'}}>{new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE',{style:'currency', currency:currency}).format(item.amount_owed)}</TableCell>
                              </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Box>

        {/* Summary Section */}
        <Box mt="20px" mb="20px">
          <Typography fontSize="20px" fontWeight="bold" color="black" mb="10px">
            Payment Summary
          </Typography>
          <Typography variant="body2" color="black">
            Total Payment Amount: {formattedPaymentAmount}
          </Typography>
          <Typography variant="body2" color="black">
            Payment Method: {paymentMode}
          </Typography>
        </Box>

        {/* Footer Message */}
        <Box display="flex" justifyContent="center" mt="30px">
          <Typography fontSize="18px" color="black" fontWeight="bold">
            Thank you for your business!
          </Typography>
        </Box>
      </Box>

      
    </Box>
  );
};

export default PaymentLayout;
