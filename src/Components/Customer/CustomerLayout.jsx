import { Typography, Box, Button,TableContainer, Table, TableHead, TableCell, TableBody, TableRow, Divider } from "@mui/material";
import {useRef} from "react";
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from "react-router-dom";
import './Customer.css'


const CustomerLayout = ({
  invoiceItems = [],
  Totalamount,
  amountOwed,
  amountPaid,
  customerEmail,
  customerPhone,
  customerPin,
  title,
  currency,
}) => {
  
  const componentRef = useRef();

  const navigate = useNavigate()

  const handleViewDetails = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'CUSTOMER SUMMARY',
  });

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
      headerName: "INVOICE DATE",
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
      field: "totalAmount",
      headerName: "TOTAL AMOUNT",
      flex: 0.4,
      renderCell: (params) => {
        // Use Intl.NumberFormat for currency formatting
        const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency] || 'en-KE', {
          style: 'currency',
          currency: 'KES', // Replace with your desired currency
        }).format(params.value);
    
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
          >
            <Typography variant="h7">
              {formattedAmount}  {/* Display formatted amount */}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "amount_owed",
      headerName: "AMOUNT OWED",
      flex: 0.4,
      renderCell: (params) => {
        // Use Intl.NumberFormat for currency formatting
        const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency] || 'en-KE', {
          style: 'currency',
          currency: 'KES', // Replace with your desired currency
        }).format(params.value);
    
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
          >
            <Typography variant="h7">
              {formattedAmount}  {/* Display formatted amount */}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "amount_paid",
      headerName: "AMOUNT PAID",
      flex: 0.4,
      renderCell: (params) => {
        // Use Intl.NumberFormat for currency formatting
        const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency] || 'en-KE', {
          style: 'currency',
          currency: 'KES', // Replace with your desired currency
        }).format(params.value);
    
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
          >
            <Typography variant="h7">
              {formattedAmount}  {/* Display formatted amount */}
            </Typography>
          </Box>
        );
      },
    },
]

  return (
    <Box>

      <Button variant="contained" color="secondary" onClick={handlePrint} sx={{display:'flex', marginTop:'20px'}}>Print Customer Summary</Button>

      <Box sx={{ padding: 2, fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <Box textAlign="right" sx={{ marginBottom: 3 }}>
              <Typography fontSize="22px" fontWeight="bold">E-KATI HAULIERS LTD</Typography>
              <Typography>Emali, Makueni</Typography>
              <Typography>Kenya</Typography>
            </Box>

            {/* Customer Summary */}
            <Box display="flex" justifyContent="space-between" sx={{ borderBottom: '2px solid #000', paddingBottom: 2, marginBottom: 3 }}>
              {/* Customer Details */}
              <Box sx={{ width: '45%' }}>
                <Typography fontSize="18px" fontWeight="bold" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ padding: '8px', backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                  <Typography>
                    <strong>Name:</strong> {title}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {customerPhone}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {customerEmail}
                  </Typography>
                  <Typography>
                    <strong>PIN:</strong> {customerPin}
                  </Typography>
                </Box>
              </Box>

              {/* Account Summary */}
              <Box>
                <Typography fontSize="20px" fontWeight="bold" textAlign="center" gutterBottom>
                  STATEMENT OF ACCOUNTS
                </Typography>
                <Divider orientation="horizontal" sx={{ marginY: 1 }} />
                <Typography sx={{ marginBottom: 1, textAlign: 'center' }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </Typography>
                <Divider orientation="horizontal" sx={{ marginY: 1 }} />
                <Typography fontWeight="bold" textAlign="center" sx={{ marginBottom: 2 }}>Account Summary</Typography>

                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Invoiced Amount:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{Totalamount}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Amount Paid:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{amountPaid}</Typography>
                </Box>
                <Divider orientation="horizontal" sx={{ marginY: 1 }} />
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0', backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                  <Typography>Balance Due:</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: 'red' }}>{amountOwed}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Invoice Table */}
            <Typography fontSize="18px" fontWeight="bold" sx={{ marginBottom: 2 }}>Detailed Invoice Information</Typography>
            <TableContainer>
              <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    {columns.map((column) => (
                      <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceItems &&
                    invoiceItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.customer_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.invoice_number}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.invoice_date}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.status}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE', { style: 'currency', currency }).format(
                            item.totalAmount
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE', { style: 'currency', currency }).format(
                            item.amount_owed
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE', { style: 'currency', currency }).format(
                            item.amount_paid
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
      </Box>

      <Box ref={componentRef} className="a4-print-mobile" sx={{ padding: 2, fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <Box textAlign="right" sx={{ marginBottom: 3 }}>
              <Typography fontSize="22px" fontWeight="bold">E-KATI HAULIERS LTD</Typography>
              <Typography>Emali, Makueni</Typography>
              <Typography>Kenya</Typography>
            </Box>

            {/* Customer Summary */}
            <Box display="flex" justifyContent="space-between" sx={{ borderBottom: '2px solid #000', paddingBottom: 2, marginBottom: 3 }}>
              {/* Customer Details */}
              <Box sx={{ width: '45%' }}>
                <Typography fontSize="18px" fontWeight="bold" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ padding: '8px', backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                  <Typography>
                    <strong>Name:</strong> {title}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {customerPhone}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {customerEmail}
                  </Typography>
                  <Typography>
                    <strong>PIN:</strong> {customerPin}
                  </Typography>
                </Box>
              </Box>

              {/* Account Summary */}
              <Box>
                <Typography fontSize="20px" fontWeight="bold" textAlign="center" gutterBottom>
                  STATEMENT OF ACCOUNTS
                </Typography>
                <Divider orientation="horizontal" sx={{ marginY: 1 }} />
                <Typography sx={{ marginBottom: 1, textAlign: 'center' }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </Typography>
                <Divider orientation="horizontal" sx={{ marginY: 1 }} />
                <Typography fontWeight="bold" textAlign="center" sx={{ marginBottom: 2 }}>Account Summary</Typography>

                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Invoiced Amount:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{Totalamount}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Amount Paid:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{amountPaid}</Typography>
                </Box>
                <Divider orientation="horizontal" sx={{ marginY: 1 }} />
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0', backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                  <Typography>Balance Due:</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: 'red' }}>{amountOwed}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Invoice Table */}
            <Typography fontSize="18px" fontWeight="bold" sx={{ marginBottom: 2 }}>Detailed Invoice Information</Typography>
            <TableContainer>
              <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    {columns.map((column) => (
                      <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceItems &&
                    invoiceItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.customer_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.invoice_number}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.invoice_date}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.status}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE', { style: 'currency', currency }).format(
                            item.totalAmount
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE', { style: 'currency', currency }).format(
                            item.amount_owed
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE', { style: 'currency', currency }).format(
                            item.amount_paid
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
      </Box>


    </Box>
  );
};

export default CustomerLayout;
