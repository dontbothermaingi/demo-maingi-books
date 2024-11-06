import { Typography, Box, useTheme, Button, useMediaQuery, CardContent, Card, Pagination } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";

const VendorLayout = ({
  billItems = [],
  Totalamount,
  amountOwed,
  amountPaid,
  billTotal,
  title,
}) => {
  const [formattedItems, setFormattedItems] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [anotherItems, setAnotherItems] = useState([]);

  const formatted = new Intl.NumberFormat().format(billTotal);

  useEffect(() => {
    const formatted = billItems.map(item => ({
        ...item,
        rate: new Intl.NumberFormat().format(item.rate),
        amount: new Intl.NumberFormat().format(item.amount),
        rate_vat: new Intl.NumberFormat().format(item.rate_vat),
        sub_total: new Intl.NumberFormat().format(item.sub_total)
      }));

      const another = billItems.map(item => ({
        ...item,
        rate: new Intl.NumberFormat().format(item.rate),
        rate_vat: new Intl.NumberFormat().format(item.rate_vat),
        sub_total: new Intl.NumberFormat().format(item.sub_total)
      }));

      setAnotherItems(another)
      setFormattedItems(formatted)
  },[billItems])

  const navigate = useNavigate()

  const handleViewDetails = (billId) => {
    navigate(`/newbills/${billId}`);
  };

  const bills = [
    { field: "id", headerName: "ID", flex: 0.1,renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "vendor_name", headerName: "Vendor Name", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),},
    { field: "bill_number", headerName: "Bill Number", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),},
    { field: "status", headerName: "Status", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),},
    { field: "bill_date", headerName: "Bill Date", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),},
    { field: "item_details", headerName: "ITEM", flex: 0.3, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "quantity", headerName: "QUANTITY", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "rate", headerName: "RATE", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "sub_total", headerName: "SUB TOTAL", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "vat", headerName: "VAT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "rate_vat", headerName: "VAT AMOUNT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "amount", headerName: "AMOUNT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
  ];


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

  const totalPages = Math.ceil(anotherItems.length / itemsPerPage)
  const displayedItems = anotherItems.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

  const handlePageChange = (event, value) => {
        setCurrentPage(value);
  };

  return (
    <Box>
      <Box ref={componentRef} backgroundColor="white" borderRadius="10px">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography fontSize="32px" color="black" ml="23px" mt="9px" fontWeight="bold">
              {title}
            </Typography>
          </Box>
        </Box>

        {billItems.length > 0 && (
              <Box>
                

                <Box
                    display="grid"
                    gridTemplateColumns={{md:"repeat(4, 1fr)", xs:"repeat(1, 1fr)"}}
                    gap="5px"
                >
                <Card
                    sx={{
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto', // Adjust height for better flexibility
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '10px',
                      margin: '30px',
                      backgroundColor: '#fff',
                  }}
                >

                  <CardContent sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <Typography fontSize={'23px'} fontWeight={'bold'}>{Totalamount}</Typography>
                    <Typography color={'#70d8bd'} fontSize={'25px'} fontWeight={'bold'}>TOTAL PURCHASES</Typography>
                  </CardContent>

                </Card>

                <Card
                    sx={{
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto', // Adjust height for better flexibility
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '10px',
                      margin: '30px',
                      backgroundColor: '#fff',
                  }}
                >

                  <CardContent sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <Typography fontSize={'23px'} fontWeight={'bold'}>{amountOwed}</Typography>
                    <Typography color={'#70d8bd'} fontSize={'27px'} fontWeight={'bold'}>AMOUNT OWED</Typography>
                  </CardContent>
                  
                </Card>

                <Card
                    sx={{
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto', // Adjust height for better flexibility
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '10px',
                      margin: '30px',
                      backgroundColor: '#fff',
                  }}
                >

                  <CardContent sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <Typography fontSize={'23px'} fontWeight={'bold'}>{amountPaid}</Typography>
                    <Typography color={'#70d8bd'} fontSize={'27px'} fontWeight={'bold'}>AMOUNT PAID</Typography>
                  </CardContent>
                </Card>

                </Box>

                {isMobile ? (
                  <Box>
                  <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>BILLS</Typography>
                  <Box
                      display={'grid'}
                      gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                      gap="10px"
                      margin="0 10px"
                  >

                      {displayedItems.map((item) => (
                          <Card
                              key={item.id}
                              onClick={() => handleViewDetails(item.bill_number)}
                              sx={{
                                  borderRadius: '15px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  height: 'auto', // Adjust height for better flexibility
                                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                  padding: '10px',
                                  backgroundColor: '#fff',
                                  
                              }}
                          >
                                <CardContent>
                                      <Box display={'flex'} gap={'3px'}>
                                        <Typography>Vendor:</Typography>
                                        <Typography fontWeight={'bold'}>{item.vendor_name}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'5px'}>
                                        <Typography>Bill Number:</Typography>
                                        <Typography fontWeight={'bold'}>{item.bill_number}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'2px'}>
                                        <Typography>Item:</Typography>
                                        <Typography fontWeight={'bold'}>{item.item_details}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'5px'}>
                                        <Typography>Quantity:</Typography>
                                        <Typography fontWeight={'bold'}>{item.quantity}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'5px'}>
                                        <Typography>Rate:</Typography>
                                        <Typography fontWeight={'bold'}>{item.rate}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'5px'}>
                                        <Typography>VAT:</Typography>
                                        <Typography fontWeight={'bold'}>{item.vat}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'5px'}>
                                        <Typography>VAT Amount:</Typography>
                                        <Typography fontWeight={'bold'}>{item.rate_vat}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'5px'}>
                                        <Typography>Total Amount:</Typography>
                                        <Typography fontWeight={'bold'}>{new Intl.NumberFormat(currencyLocaleMap[item.currency] ||'en-KE', {style:'currency', currency:'KES'}).format(item.amount)}</Typography>
                                      </Box>
                              </CardContent>
                          </Card>
                      ))}
                      <Box display="flex" justifyContent="center" mt="20px">
                              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
                      </Box>
                  </Box>
                  </Box>
                ):(
                  <Box>
                    <Box>
                      <DataGrid rows={formattedItems} columns={bills} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
                    </Box>
                    <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                      Total: {formatted}
                    </Typography>
                    <Box display="flex" justifyContent="center">
                      <ReactToPrint
                        trigger={() => (
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor: colors.blueAccent[700],
                              color: colors.grey[100],
                              '&:hover': {
                                backgroundColor: colors.blueAccent[500],
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
                )}
                  
                </Box>
                )}
        
      </Box>

      
    </Box>
  );
};

export default VendorLayout;
