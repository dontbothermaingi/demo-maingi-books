import { Box, Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ReactToPrint from "react-to-print";

function ReportForPaymentsMade(){

    const [payment, setPayment] = useState("");
    const token = localStorage.getItem("access_token")
    const [currency, setCurrency] = useState("")
    const [bills, setBills] = useState("")
    const navigate = useNavigate();
    const componentRef = useRef();
    const {paymentId} = useParams();

    useEffect(()=>{
        fetch(`https://demo-server-757m.onrender.com/paymentsmade/${paymentId}`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setPayment(data)
            
            setCurrency(data.currency)
            setBills(data.bills)
        })
    },[token, paymentId])

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

      const alternative = currency ? currency : "USD"
      const formattedPaymentAmount = new Intl.NumberFormat(currencyLocaleMap.currency || "en-KE", {style: "currency", currency:alternative}).format(payment.payment_amount);

      const handleViewDetails = (billId) => {
        navigate(`/newbills/${billId}`);
      };

      const columns = [
        {
          field: "vendor_name",
          headerName: "VENDOR NAME",
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
          field: "bill_number",
          headerName: "BILL NUMBER",
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
          field: "bill_date",
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
          field: "bill_total",
          headerName: "BILL TOTAL",
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
                            sx={{fontFamily:"GT Bold"}}
                            color="secondary"
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
                                    <Typography fontSize="28px" fontFamily={"GT Bold"} color="black">
                                        EKATI HAULIERS
                                    </Typography>
                                    <Typography fontFamily={"GT Light"} color="black">
                                        Emali, Makueni, Kenya
                                    </Typography>
                                </Box>
                                <Box textAlign="right">
                                    <Typography fontSize="28px" fontFamily={"GT Bold"} color="black">
                                        PAYMENT SLIP
                                    </Typography>
                                    <Typography fontFamily={"GT Light"} color="black">
                                        Payment: <span style={{fontFamily:'GT Medium'}}>{payment.payment}</span>
                                    </Typography>
                                    <Typography fontFamily={"GT Light"} color="black">
                                        Date: <span style={{fontFamily:'GT Medium'}}>{payment.payment_date}</span>
                                    </Typography>
                                    <Typography fontFamily={"GT Light"} color="black">
                                        Amount: <span style={{fontFamily:'GT Medium'}}>{formattedPaymentAmount}</span>
                                    </Typography>
                                    <Typography fontFamily={"GT Light"} color="black">
                                        Paid via: <span style={{fontFamily:'GT Medium'}}>{payment.payment_mode}</span>
                                    </Typography>
                                </Box>
                        </Box>

                        {/* Vendor Details */}
                        <Box mt="20px" mb="20px" textAlign="right">
                        <Typography fontSize="24px" fontFamily={"GT Bold"} color="black" mb="10px">
                            VENDOR DETAILS
                        </Typography>
                        <Typography fontFamily={"GT Light"} color="black">
                            Name: <span style={{fontFamily:'GT Medium'}}>{payment.vendor_name}</span>
                        </Typography>
                        <Typography fontFamily={"GT Light"} color="black">
                            Email: <span style={{fontFamily:'GT Medium'}}>{payment.vendor_email}</span>
                        </Typography>
                        <Typography fontFamily={"GT Light"} color="black">
                            Phone: <span style={{fontFamily:'GT Medium'}}>{payment.vendor_email}</span>
                        </Typography>
                        <Typography fontFamily={"GT Light"} color="black">
                            KRA PIN: <span style={{fontFamily:'GT Medium'}}>{payment.vendor_pin}</span>
                        </Typography>
                        </Box>

                        {/* Divider */}
                        <Divider />

                        <Typography fontSize={'23px'} fontFamily={"GT Medium"} textAlign={'center'} margin={'20px'}>BILLS ASSOCIATED WITH THIS PAYMENT</Typography>
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
                            {bills && bills.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell onClick={() => handleViewDetails(item.bill_id)} sx={{cursor:'pointer'}}>{item.vendor_name}</TableCell>
                                        <TableCell onClick={() => handleViewDetails(item.bill_id)} sx={{cursor:'pointer'}}>{item.bill_number}</TableCell>
                                        <TableCell onClick={() => handleViewDetails(item.bill_id)} sx={{cursor:'pointer'}}>{item.bill_date}</TableCell>
                                        <TableCell onClick={() => handleViewDetails(item.bill_id)} sx={{cursor:'pointer'}}>{item.status}</TableCell>
                                        <TableCell onClick={() => handleViewDetails(item.bill_id)} sx={{cursor:'pointer'}}>{new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE',{style:'currency', currency:currency}).format(item.bill_total)}</TableCell>
                                        <TableCell onClick={() => handleViewDetails(item.bill_id)} sx={{cursor:'pointer'}}>{new Intl.NumberFormat(currencyLocaleMap.currency || 'en-KE',{style:'currency', currency:currency}).format(item.amount_owed)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>

                        </Box>

                        {/* Summary Section */}
                        <Box mt="20px" mb="20px">
                        <Typography fontSize="20px" fontFamily={"GT Bold"} color="black" mb="10px">
                            Payment Summary
                        </Typography>
                        <Typography fontFamily={"GT Light"} color="black">
                            Total Payment Amount:  <span style={{fontFamily:'GT Medium'}}>{formattedPaymentAmount}</span>
                        </Typography>
                        <Typography fontFamily={"GT Light"} color="black">
                            Payment Method:  <span style={{fontFamily:'GT Medium'}}>{payment.payment_mode}</span>
                        </Typography>
                        </Box>

                        {/* Footer Message */}
                        <Box display="flex" justifyContent="center" mt="30px">
                        <Typography fontSize="23px" color="black" fontFamily={"GT Medium"}>
                            Thank you for your business!
                        </Typography>
                        </Box>
            </Box>

            
        </Box>
     );
}
 
export default ReportForPaymentsMade;