import { Typography, Box, useTheme, Button, Divider, TextField, TableCell, TableBody, TableRow, TableContainer, Table, TableHead, Card, CardContent, useMediaQuery, Pagination } from "@mui/material";
import { tokens } from "../../theme";
import { useRef, useState, useEffect } from "react";
import ReactToPrint from 'react-to-print';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO } from 'date-fns';
import { useNavigate } from "react-router-dom";


const ReportLayout = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();
  const [currentInvoicePage, setCurrentInvoicePage] = useState(1)
  const [currentBillPage, setCurrentBillPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const token = localStorage.getItem('access_token')

  const [accounts, setAccounts] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [activeSection, setActiveSection] = useState(null);



  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/accountcategories',{
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`
      },
      credentials:'include'
    })
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
      })
      .catch(error => console.error('Error fetching account data:', error));
  }, [token]);

  const filterByDateRange = (items) => {
    if (!dateRange[0] || !dateRange[1]) return items;
    const [startDate, endDate] = dateRange;
    const filteredItems = items.filter(item => {
      const date = parseISO( item.invoice_date || item.bill_date);
      return date >= startDate && date <= endDate;
    });
    console.log('Filtered Items:', filteredItems); // Debug log to see filtered items
    return filteredItems;
  };

  const names = [...new Set(accounts.map(category => category.category_name))];


  const commonColumns = [
    { field: "item_details", headerName: "ITEM", flex: 0.2 },
    { field: "quantity", headerName: "QUANTITY", flex: 0.15 },
    { field: "rate", headerName: "RATE", flex: 0.15 },
    { field: "vat", headerName: "VAT", flex: 0.15 },
    { field: "rate_vat", headerName: "VAT AMOUNT", flex: 0.15 },
    { field: "amount", headerName: "AMOUNT", flex: 0.15,},

  ];

  const billColumns = [
    { field: "vendor_name", headerName: "VENDOR NAME", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewBills(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "bill_number", headerName: "BILL NUMBER", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewBills(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "bill_date", headerName: "BILL DATE", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewBills(params.row.bill_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    ...commonColumns,
  ];

  const invoiceColumns = [
    { field: "customer_name", headerName: "CUSTOMER NAME", flex: 0.3,renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "invoice_date", headerName: "INVOICE DATE", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    ...commonColumns,
  ];

  const calculateTotal = (items) => items.reduce((total, item) => total + item.amount, 0);

  const navigate = useNavigate()

  const handleViewInvoices = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`)
  }

  const handleViewBills = (billId) => {
    navigate(`/newbills/${billId}`)
  }

  const handleNameClick = (name) => {
    setActiveSection(name);
  };

  
  

  return (
      <Box margin={{md:'40px', xs:'20px'}} >

        <Box display="flex" justifyContent="space-between" flexDirection={{xs:'column', md:'row'}} gap={'20px'}>

          <Typography fontSize="28px" textAlign={'center'} fontWeight="bold">
            DETAILED REPORT
          </Typography>

          <Box>
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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </>
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box>
          <Box>
            <Typography fontSize={'27px'} textAlign={'center'} fontWeight="bold">
              MONETARY SUMMARY
            </Typography>

            <Box
              display="flex"
              mt="20px"
              flexDirection={{ xs: "column", sm: "column", md: "row" }}
              gap={2}
              justifyContent="center" // Center-aligns the content
            >
              {/* Expenses Card */}
              <Card
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '20px',
                  backgroundColor: '#fff',
                }}
              >
                <CardContent>
                  <Typography variant="h5" color="black" fontWeight="bold">
                    EXPENSES
                  </Typography>
                </CardContent>
                <Divider sx={{ borderBottomWidth: 1 }} color="black" />

                {/* Expenses Content */}
                {accounts.map((account) =>
                  names.map((name) => {
                    const billItems = filterByDateRange(
                      account.bill_items.flatMap(bill =>
                        bill.items.map(item => ({
                          ...bill,
                          ...item,
                          id: `${bill.id}-${item.id}`,
                        }))
                      )
                    );
                    const filteredItems = billItems.filter(item => item.category_name === name);
                    const expenseTotal = calculateTotal(filteredItems);
                    if (expenseTotal === 0) return null;

                    return (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        key={`${account.id}-${name}`}
                        onClick={() => handleNameClick(name)}
                        sx={{ cursor: 'pointer', mb: 1 }}
                      >
                        <Typography variant="h6" color="black" fontWeight="bold">
                          {name}
                        </Typography>
                        <Typography variant="h6" color="black" fontWeight="bold">
                          {new Intl.NumberFormat().format(expenseTotal)}
                        </Typography>
                      </Box>
                    );
                  })
                )}

                <Divider sx={{ borderBottomWidth: 1 }} color="black" />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="black" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" color="black" fontWeight="bold">
                    {new Intl.NumberFormat().format(accounts.reduce((total, account) => {
                      const billItems = filterByDateRange(
                        account.bill_items.flatMap(bill =>
                          bill.items.map(item => ({
                            ...bill,
                            ...item,
                            id: `${bill.id}-${item.id}`,
                          }))
                        )
                      );
                      return total + calculateTotal(billItems);
                    }, 0))}
                  </Typography>
                </Box>
              </Card>

              {/* Divider for larger screens */}
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} color="black" />

              {/* Sales Card */}
              <Card
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '20px',
                  backgroundColor: '#fff',
                  
                }}
              >
                <CardContent>
                  <Typography variant="h5" color="black" fontWeight="bold">
                    SALES
                  </Typography>
                </CardContent>
                <Divider sx={{ borderBottomWidth: 1 }} color="black" />

                {/* Sales Content */}
                {accounts.map((account) =>
                  names.map((name) => {
                    const invoiceItems = filterByDateRange(
                      account.invoice_items.flatMap(invoice =>
                        invoice.items.map(item => ({
                          ...invoice,
                          ...item,
                          id: `${invoice.id}-${item.id}`,
                        }))
                      )
                    );
                    const filteredItems = invoiceItems.filter(item => item.category_name === name);
                    const invoiceTotal = calculateTotal(filteredItems);
                    if (invoiceTotal === 0) return null;

                    return (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        key={`${account.id}-${name}`}
                        onClick={() => handleNameClick(name)}
                        sx={{ cursor: 'pointer', mb: 1 }}
                      >
                        <Typography variant="h6" color="black" fontWeight="bold">
                          {name}
                        </Typography>
                        <Typography variant="h6" color="black" fontWeight="bold">
                          {new Intl.NumberFormat().format(invoiceTotal)}
                        </Typography>
                      </Box>
                    );
                  })
                )}

                <Divider sx={{ borderBottomWidth: 1 }} color="black" />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="black" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" color="black" fontWeight="bold">
                    {new Intl.NumberFormat().format(accounts.reduce((total, account) => {
                      const invoiceItems = filterByDateRange(
                        account.invoice_items.flatMap(invoice =>
                          invoice.items.map(item => ({
                            ...invoice,
                            ...item,
                            id: `${invoice.id}-${item.id}`,
                          }))
                        )
                      );
                      return total + calculateTotal(invoiceItems);
                    }, 0))}
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>


        <Box ref={componentRef} >
              {accounts.map((account) => (
                <Box key={account.id} mb="40px">
                  {names.map((name) => {
                    const billItems = filterByDateRange(account.bill_items.flatMap(bill =>
                      bill.items.map(item => ({
                        ...bill,
                        ...item,
                        rate_vat: new Intl.NumberFormat().format(item.rate_vat),
                        rate: new Intl.NumberFormat().format(item.rate),
                        // amount: new Intl.NumberFormat().format(item.amount),
                        quantity: new Intl.NumberFormat().format(item.quantity),
                        id: `${bill.id}-${item.id}`,
                      }))
                    )
                  );

                  const invoiceItems = filterByDateRange(account.invoice_items.flatMap(invoice =>
                    invoice.items.map(item => ({
                      ...invoice,
                      ...item,
                      rate_vat: new Intl.NumberFormat().format(item.rate_vat),
                      rate: new Intl.NumberFormat().format(item.rate),
                      // amount: new Intl.NumberFormat().format(item.amount),
                      quantity: new Intl.NumberFormat().format(item.quantity),
                      id: `${invoice.id}-${item.id}`,
                    }))
                  )
                );

                    

                    const filteredBills = filterByDateRange(billItems.filter(item => item.category_name === name));
                    const filteredInvoices = filterByDateRange(invoiceItems.filter(item => item.category_name === name));

                    const billTotal = calculateTotal(filteredBills);
                    const invoiceTotal = calculateTotal(filteredInvoices);

                    if (filteredBills.length === 0 && filteredInvoices.length === 0) {
                      return null;
                    }

                  // Sort filteredInvoices based on invoice_date in descending order
                  const sort = filteredInvoices.sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date));

                  const totalBillPages = Math.ceil(billItems.length / itemsPerPage)
                  const displayedBillItems = billItems.slice((currentBillPage - 1)*itemsPerPage, currentBillPage * itemsPerPage)


                  const totalInvoicePages = Math.ceil(sort.length / itemsPerPage)
                  const displayedInvoiceItems = sort.slice((currentInvoicePage - 1)*itemsPerPage, currentInvoicePage * itemsPerPage)
                  
                  
                  const handleBillPageChange = (event, value) => {
                      setCurrentBillPage(value);
                  };

                  const handleInvoicePageChange = (event, value) => {
                    setCurrentInvoicePage(value);
                };

                    return (
                      <Box key={`${account.id}-${name}`} mb="40px">

                        {activeSection === name && (
                          <>
                            {filteredBills.length > 0 && (
                              <Box>

                              <Typography fontSize="25px" fontWeight="bold" ml="20px" textAlign="center" >
                                  {account.category_name}
                              </Typography>



                              <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
                                <Typography fontWeight={'bold'} fontSize={'20px'}>
                                    Total: {new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(billTotal)}
                                </Typography>
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
                
                                    {displayedBillItems.map((item) => (
                                        <Card
                                            key={item.id}
                                            onClick={() => handleViewBills(item.bill_number)}
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

                                                    <Box display={'flex'} gap={'5px'}>
                                                      <Typography>Item Details:</Typography>
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
                                                      <Typography fontWeight={'bold'}>{new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.amount)}</Typography>
                                                    </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Box display="flex" justifyContent="center" mt="20px">
                                            <Pagination count={totalBillPages} page={currentBillPage} onChange={handleBillPageChange} color="secondary" />
                                    </Box>
                                </Box>
                                </Box>
                              ):(

                                <Box ml="20px" height="35vh" mb="20px">
                                <TableContainer  mb='30px'>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {billColumns.map((column) => (
                                                <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '10px' }}>{column.headerName}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {billItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.vendor_name}</TableCell>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.bill_number}</TableCell>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{format(new Date(item.bill_date), 'dd/MM/yyyy')}</TableCell> 
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.item_details}</TableCell>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.quantity}</TableCell>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.rate}</TableCell>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.vat}</TableCell>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.rate_vat}</TableCell>
                                                <TableCell onClick={() => handleViewBills(item.bill_number)}>{item.amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                        
                                </Table>
                            </TableContainer>
                                </Box>
                              )}

                                

                              </Box>
                            )}

                            {filteredInvoices.length > 0 && (
                              <Box>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography fontSize="26px" fontWeight="bold" ml="20px">
                                      {name}
                                    </Typography>
                                    <Typography fontSize='20px' fontWeight="bold">
                                      Total: {new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(invoiceTotal)}
                                    </Typography>
                                </Box>


                                {isMobile ? (
                                   <Box>
                                   <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>INVOICES</Typography>
                                   <Box
                                       display={'grid'}
                                       gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                                       gap="10px"
                                       margin="0 10px"
                                   >
                   
                                       {displayedInvoiceItems.map((item) => (
                                           <Card
                                               key={item.id}
                                               onClick={() => handleViewInvoices(item.invoice_number)}
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
                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Name:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.customer_name}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Invoice Date:</Typography>
                                                          <Typography  fontWeight={'bold'}>{format(new Date(item.invoice_date), 'dd/MM/yyyy')}</Typography>
                                                      </Box>

                                                      
                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Item:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.item_details}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Quantity:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.quantity}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Rate:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.rate}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Vat:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.vat}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Vat Amount:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.rate_vat}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'4px'}>
                                                          <Typography>Amount:</Typography>
                                                          <Typography fontWeight={'bold'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:item.currency}).format(item.amount)}</Typography>
                                                      </Box>

                                                </CardContent>
                                          </Card>
                                                ))}
                                                <Box display="flex" justifyContent="center" mt="20px">
                                                        <Pagination count={totalInvoicePages} page={currentInvoicePage} onChange={handleInvoicePageChange} color="secondary" />
                                                </Box>
                                   </Box>
                                   </Box>
                                ):(
                                   <Box ml="20px" height="35vh" mb="20px">
                                   <TableContainer>
                                   <Table>
                                       <TableHead>
                                           <TableRow>
                                               {invoiceColumns.map((column) => (
                                                   <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '12px' }}>{column.headerName}</TableCell>
                                               ))}
                                           </TableRow>
                                       </TableHead>
                                       <TableBody>
                                           {filteredInvoices.map((item, index) => (
                                               <TableRow key={index}>
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{item.customer_name}</TableCell>
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{format(new Date(item.invoice_date), 'dd/MM/yyyy')}</TableCell> 
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{item.item_details}</TableCell>
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{item.quantity}</TableCell>
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{item.rate}</TableCell>
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{item.vat}</TableCell>
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{item.rate_vat}</TableCell>
                                                   <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.amount)}</TableCell>
                                               </TableRow>
                                           ))}
                                       </TableBody>
                           
                                   </Table>
                               </TableContainer>                                
                                   </Box>
                                )}
                               


                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
        </Box>


      </Box>
  );
};

export default ReportLayout;
