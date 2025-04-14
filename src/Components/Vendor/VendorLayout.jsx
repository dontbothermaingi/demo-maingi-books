import { Typography, Box,Button,Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useMediaQuery } from "@mui/material";
import { useRef} from "react";
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from "react-router-dom";
import './Vendor.css'

const VendorLayout = ({
  billItems = [],
  Totalamount,
  amountOwed,
  amountPaid,
  vendorPhone,
  vendorPin,
  currency,
  vendorEmail,
  title,
  endDate,
  startDate,
}) => {
  const componentRef = useRef();

  const isMobile = useMediaQuery("(max-width:768px)");

  const columns = [
    {
      field: "vendor_name",
      headerName: "VENDOR NAME",
      flex: 0.7,
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
      flex: 0.2,
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
      headerName: "BILL DATE",
      flex: 0.25,
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
        flex: 0.2,
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
        headerName: "Total Amount",
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
  const navigate = useNavigate()

  const handleViewDetails = (billId) => {
    navigate(`/newbills/${billId}`);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'VENDOR SUMMARY',
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

  return (
    <Box>

      <Button variant="contained" color="secondary" onClick={handlePrint}  sx={{fontFamily:'GT Bold', display:'flex', justifyContent:'right', marginTop:'20px'}}>Print Vendor Summary</Button>

      {isMobile ? (
        <Box sx={{ padding: 2, fontFamily: 'Arial, sans-serif' }}>
        {/* Header Section */}
            <Box textAlign="center" sx={{ marginBottom: 4 }}>
              <Typography fontSize="22px" fontWeight="bold">MAINGI LOGISTICS LTD</Typography>
              <Typography>Somewhere, County</Typography>
              <Typography>Country</Typography>
            </Box>

            <Divider sx={{mb:'30px', mt:'30px'}}/>

            {/* Vendor Details and Account Summary */}
            <Box display="flex" flexDirection={'column'} alignItems={'center'} sx={{ borderBottom: '2px solid #000', paddingBottom: 3, marginBottom: 4 }}>
              {/* Vendor Details */}
              <Box sx={{ width: '100%' }}>
                <Typography textAlign={'center'} fontSize="18px" fontWeight="bold" gutterBottom>
                  Vendor Information
                </Typography>
                <Box sx={{ padding: '8px', backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                  <Typography>
                    <strong>Name:</strong> {title}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {vendorPhone}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {vendorEmail}
                  </Typography>
                  <Typography>
                    <strong>PIN:</strong> {vendorPin}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{mb:'30px', mt:'30px'}}/>
              
              {/* Account Summary */}
              <Box sx={{ width: '100%' }}>
                <Typography fontSize="18px" fontWeight="bold" textAlign="center" gutterBottom>
                  Statement of Accounts
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                  <Typography><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
                </Box>
                <Divider sx={{ marginY: 2 }} />
                <Typography fontWeight="bold" gutterBottom>
                  Account Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Billed Amount:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{Totalamount}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Amount Paid:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{amountPaid}</Typography>
                </Box>
                <Divider sx={{ marginY: 1 }} />
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0', backgroundColor: '#fef6f6', borderRadius: 2 }}>
                  <Typography>Balance Due:</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: 'red' }}>{amountOwed}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Bill Table */}
            <Typography fontSize="18px" fontWeight="bold" sx={{ marginBottom: 2 }}>Detailed Bill Information</Typography>
            <TableContainer>
              <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                    {columns.map((column) => (
                      <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billItems &&
                    billItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.vendor_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.bill_number}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.bill_date}
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
        </Box>
      ):(
        <Box sx={{ padding: 2, fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <Box textAlign="right" sx={{ marginBottom: 4 }}>
              <Typography fontSize="22px" fontWeight="bold">MAINGI LOGISTICS LTD</Typography>
              <Typography>Somewhere, County</Typography>
              <Typography>Country</Typography>
            </Box>

            {/* Vendor Details and Account Summary */}
            <Box display="flex" justifyContent="space-between" sx={{ borderBottom: '2px solid #000', paddingBottom: 3, marginBottom: 4 }}>
              {/* Vendor Details */}
              <Box sx={{ width: '45%' }}>
                <Typography fontSize="18px" fontWeight="bold" gutterBottom>
                  Vendor Information
                </Typography>
                <Box sx={{ padding: '8px', backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                  <Typography>
                    <strong>Name:</strong> {title}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {vendorPhone}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {vendorEmail}
                  </Typography>
                  <Typography>
                    <strong>PIN:</strong> {vendorPin}
                  </Typography>
                </Box>
              </Box>

              {/* Account Summary */}
              <Box sx={{ width: '50%' }}>
                <Typography fontSize="18px" fontWeight="bold" textAlign="center" gutterBottom>
                  Statement of Accounts
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                  <Typography><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
                </Box>
                <Divider sx={{ marginY: 2 }} />
                <Typography fontWeight="bold" gutterBottom>
                  Account Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Billed Amount:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{Totalamount}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Amount Paid:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{amountPaid}</Typography>
                </Box>
                <Divider sx={{ marginY: 1 }} />
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0', backgroundColor: '#fef6f6', borderRadius: 2 }}>
                  <Typography>Balance Due:</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: 'red' }}>{amountOwed}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Bill Table */}
            <Typography fontSize="18px" fontWeight="bold" sx={{ marginBottom: 2 }}>Detailed Bill Information</Typography>
            <TableContainer>
              <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                    {columns.map((column) => (
                      <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billItems &&
                    billItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.vendor_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.bill_number}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.bill_date}
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
        </Box>
      )}
      

      <Box ref={componentRef} className="a4-print-mobile" sx={{ padding: 2, fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <Box textAlign="right" sx={{ marginBottom: 4 }}>
              <Typography fontSize="22px" fontWeight="bold">MAINGI LOGISTICS LTD</Typography>
              <Typography>Somewhere, County</Typography>
              <Typography>Country</Typography>
            </Box>

            {/* Vendor Details and Account Summary */}
            <Box display="flex" justifyContent="space-between" sx={{ borderBottom: '2px solid #000', paddingBottom: 3, marginBottom: 4 }}>
              {/* Vendor Details */}
              <Box sx={{ width: '45%' }}>
                <Typography fontSize="18px" fontWeight="bold" gutterBottom>
                  Vendor Information
                </Typography>
                <Box sx={{ padding: '8px', backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                  <Typography>
                    <strong>Name:</strong> {title}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {vendorPhone}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {vendorEmail}
                  </Typography>
                  <Typography>
                    <strong>PIN:</strong> {vendorPin}
                  </Typography>
                </Box>
              </Box>

              {/* Account Summary */}
              <Box sx={{ width: '50%' }}>
                <Typography fontSize="18px" fontWeight="bold" textAlign="center" gutterBottom>
                  Statement of Accounts
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                {startDate & endDate ? (
                     <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                     <Typography><strong>Date:</strong>{startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}</Typography>
                   </Box>
                ):(
                     <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                     <Typography><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
                   </Box>
                )}
               
                <Divider sx={{ marginY: 2 }} />
                <Typography fontWeight="bold" gutterBottom>
                  Account Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Billed Amount:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{Totalamount}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0' }}>
                  <Typography>Amount Paid:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{amountPaid}</Typography>
                </Box>
                <Divider sx={{ marginY: 1 }} />
                <Box display="flex" justifyContent="space-between" sx={{ padding: '8px 0', backgroundColor: '#fef6f6', borderRadius: 2 }}>
                  <Typography>Balance Due:</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: 'red' }}>{amountOwed}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Bill Table */}
            <Typography fontSize="18px" fontWeight="bold" sx={{ marginBottom: 2 }}>Detailed Bill Information</Typography>
            <TableContainer>
              <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                    {columns.map((column) => (
                      <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billItems &&
                    billItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.vendor_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.bill_number}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewDetails(item.id)}>
                          {item.bill_date}
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

export default VendorLayout;
