import { Typography, Box, useTheme, Button, Divider, TextField, TableCell, TableBody, TableRow, TableContainer, Table, TableHead } from "@mui/material";
import { tokens } from "../../theme";
import { useRef, useState, useEffect } from "react";
import ReactToPrint from 'react-to-print';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO } from 'date-fns';
import { useNavigate } from "react-router-dom";
import'./reportdetails.css'


const ReportLayout = ({ piechart }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();

  const [accounts, setAccounts] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [activeSection, setActiveSection] = useState(null);



  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/accountcategories')
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
      })
      .catch(error => console.error('Error fetching account data:', error));
  }, []);

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
    <Box>
      <Box mb="60px" backgroundColor="white" m="30px" height="auto" borderRadius="10px">
        <Box display="flex" justifyContent="space-between" >
          <Typography fontSize="32px" color="black" ml="23px" mt="9px" fontWeight="bold">
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
        <Box m="20px" mb='100px' >
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Box>
              <Typography variant="h4" color="black" fontWeight="bold">
                MONETARY SUMMARY
              </Typography>
            </Box>
            <Box display='flex' flexDirection='row' gap='60px' mt='20px'>
              <Box>
                <Box>
                  <Typography variant="h5" color="black" fontWeight="bold">
                    EXPENSES
                  </Typography>
                </Box>
                <Divider sx={{ borderBottomWidth: 1 }} color='black' />
                {accounts.map((account) => {
                    return names.map((name) => {
                      // Ensure correct mapping and merging of items
                      const billItems = filterByDateRange(account.bill_items.flatMap(bill =>
                          bill.items.map(item => ({
                            ...bill,
                            ...item,
                            id: `${bill.id}-${item.id}`,
                            
                          }))
                        )
                      );

                      // Filter by subcategory_name to match the current name
                      const filteredItems = billItems.filter(item => item.category_name === name);

                      const expenseTotal = calculateTotal(filteredItems);

                      // Check if there are items to display
                      const hasItems = expenseTotal > 0;

                      if (!hasItems) {
                        return null;
                      }

                      return (
                        <Box display='flex' justifyContent='space-between' gap='200px' key={`${account.id}-${name}`} onClick={() => handleNameClick(name)}  sx={{ cursor: 'pointer' }} >
                          <Typography variant="h6" color="black" fontWeight="bold">
                            {name}
                          </Typography>
                          <Typography variant="h6" color="black" fontWeight="bold">
                            {new Intl.NumberFormat().format(expenseTotal)}
                          </Typography>
                        </Box>
                      );
                    });
                  })}

                <Divider sx={{ borderBottomWidth: 1 }} color='black' />
                <Box display='flex' justifyContent='space-between' gap='200px'>
                  <Typography variant="h6" color="black" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" color="black" fontWeight="bold">
                    {new Intl.NumberFormat().format(accounts.reduce((total, account) => {

                      const billItems = filterByDateRange(account.bill_items.flatMap(bill =>
                        bill.items.map(item => ({
                          ...bill,
                          ...item,
                          id: `${bill.id}-${item.id}`,
                          
                        }))
                      )
                      );

                  const billTotal = calculateTotal(billItems);
                      return total + billTotal;
                    }, 0))}
                  </Typography>
                </Box>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ borderBottomWidth: 1 }} color='black' />

              <Box>
                <Box>
                  <Typography variant="h5" color="black" fontWeight="bold">
                    SALES
                  </Typography>
                </Box>
                <Divider sx={{ borderBottomWidth: 1 }} color='black' />
                
                {accounts.map((account) => {
                  return names.map((name) => {
                    const invoiceItems = filterByDateRange(account.invoice_items.flatMap(invoice =>
                        invoice.items.map(item => ({
                          ...invoice,
                          ...item,
                          id: `${invoice.id}-${item.id}`,
                         
                        }))
                      )
                    );

                    // Filter by subcategory_name to match the current name
                    const filteredItems = invoiceItems.filter(item => item.category_name === name);

                    const invoiceTotal = calculateTotal(filteredItems)
                    const totalSales = invoiceTotal;
  
                    const hasItems = invoiceTotal > 0;
  
                    if (!hasItems) {
                      return null;
                    }

                    return (
                      <Box display='flex' justifyContent='space-between' gap='200px'  key={`${account.id}-${name}`} onClick={() => handleNameClick(name)}  sx={{ cursor: 'pointer' }} >
                              <Typography variant="h6" color="black" fontWeight="bold">
                                {name}
                              </Typography>
                              <Typography variant="h6" color="black" fontWeight="bold">
                                {new Intl.NumberFormat().format(totalSales)}
                              </Typography>
                            </Box>
                    );
                  });
                })}
                <Divider sx={{ borderBottomWidth: 1 }} color='black' />
                <Box display='flex' justifyContent='space-between' gap='200px'>
                  <Typography variant="h6" color="black" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" color="black" fontWeight="bold">
                    {new Intl.NumberFormat().format(accounts.reduce((total, account) => {
                      const invoiceItems = filterByDateRange(account.invoice_items.flatMap(invoice =>
                        invoice.items.map(item => ({
                          ...invoice,
                          ...item,
                          id: `${invoice.id}-${item.id}`,
                        }))
                      )
                    );

                      const invoiceTotal = calculateTotal(invoiceItems);
                      return total + invoiceTotal;
                    }, 0))}
                  </Typography>
                </Box>
              </Box>

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

                    return (
                      <Box key={`${account.id}-${name}`} mb="40px">

                        {activeSection === name && (
                          <>
                            {filteredBills.length > 0 && (
                              <Box>

                              <Typography fontSize="25px" fontWeight="bold" ml="20px" textAlign="center" >
                                  {account.category_name}
                              </Typography>

                              <Box display='flex' justifyContent='space-between'>


                              <Box>
                                <Typography fontSize="20px" fontWeight="bold" ml="20px">
                                  {name} Bills
                                </Typography>
                                <Typography variant="h6" color="black" fontWeight="bold" mt="10px" ml="20px">
                                    Total: {new Intl.NumberFormat().format(billTotal)}
                                </Typography>
                              </Box>


                              </Box>
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
                              </Box>
                            )}

                            {filteredInvoices.length > 0 && (
                              <Box>
                                <Typography fontSize="20px" fontWeight="bold" ml="20px">
                                  {name} Invoices
                                </Typography>
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
                                                <TableCell onClick={() => handleViewInvoices(item.invoice_number)}>{new Intl.NumberFormat().format(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                        
                                </Table>
                            </TableContainer>                                
                            </Box>
                                <Typography fontSize='20px' color="black" fontWeight="bold" mt="10px" ml="20px">
                                  Total Invoices: {new Intl.NumberFormat().format(invoiceTotal)}
                                </Typography>
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

      </Box>
    </Box>
  );
};

export default ReportLayout;
