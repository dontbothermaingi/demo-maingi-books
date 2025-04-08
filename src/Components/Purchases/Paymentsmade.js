import { Alert, Box, Button, Card, CardContent, FormControl, MenuItem, Pagination, Select, Snackbar, TextField,Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function PaymentsMade (){

    const token = localStorage.getItem('access_token')
    const [successMessage, setSuccessMessage] = useState('')
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const [openSnackbar, setOpenSnackBar] = useState(false)
    const navigate = useNavigate()
    const [customers, setCustomers] = useState([])
    const [payments, setPayments] = useState([])
    const [formData, setFormData] = useState({
        vendor_name : "",
        vendor_email : "",
        vendor_phone : "",
        vendor_pin : "",
        currency : "",
        payment_amount : "",
        payment_date : "",
        payment : "",
        payment_mode : "",
        bill_items:[]
    })

    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/vendors', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setCustomers(data)
        })
    },[token])

    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/paymentsmade', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setPayments(data)
        })
    },[token])

    function handleChange(event){
        const {name,value} = event.target

        setFormData(prev => ({
            ...prev,
            [name]:value,
        }))
    }

    const paymentNumber = payments.length + 1

    function handleCustomer(event){
        const selectedValue = event.target.value;
        
        if (selectedValue === "new_vendor") {
            navigate("/vendors");
            return;
        }
        
        const selectedCustomer = customers.find(customer => customer.vendor_name === selectedValue);
        
        if (selectedCustomer) {
            setFormData(prevFormData => ({
                ...prevFormData,
                vendor_name: selectedCustomer.vendor_name,
                vendor_phone: selectedCustomer.vendor_phone,
                vendor_email: selectedCustomer.vendor_email,
                vendor_pin: selectedCustomer.kra_pin,
                currency: selectedCustomer.currency,
                total_amount_owed: selectedCustomer.total_amount_owed
            }));
        }
    }

    function handleCloseSnackBar(event,reason){
        if (reason === 'clickaway')return ;
        setOpenSnackBar(false)
    }

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

    const totalPages = Math.ceil(payments.length / itemsPerPage)
    const displayedItems = payments.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    async function updateInvoices(invoices) {
        let remainingAmount = parseFloat(formData.payment_amount);
        const updatedInvoiceIds = [];
    
        for (const invoice of invoices) {
            if (remainingAmount <= 0) break;
    
            const paymentMade = parseFloat(invoice.amount_paid) || 0;
            const totalAmount = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
            const remainingBalance = totalAmount - paymentMade;
            const paymentToApply = Math.min(remainingAmount, remainingBalance);
    
            const updatedPaymentMade = paymentMade + paymentToApply;
            const amountOwed = totalAmount - updatedPaymentMade;
            const updatedStatus = updatedPaymentMade >= totalAmount ? "PAID" : "PARTIALLY PAID";
    
            try {
                const response = await fetch(`https://demo-server-757m.onrender.com/newbillspayment/${invoice.id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        status: updatedStatus,
                        amount_paid: updatedPaymentMade,
                        amount_owed: amountOwed
                    })
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to update invoice ID: ${invoice.id}`);
                }
    
                updatedInvoiceIds.push({ bill_id: invoice.id });
                remainingAmount -= paymentToApply;
            } catch (error) {
                console.error(`Error updating invoice ID ${invoice.id}:`, error);
            }
        }
    
        return updatedInvoiceIds;
    }
    
    
    function handleSubmit(event) {
        event.preventDefault();
    
        // Fetch unpaid or partially paid invoices
        fetch(`https://demo-server-757m.onrender.com/newbillstatus?vendor_name=${formData.vendor_name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch invoices. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(async (invoices) => {
                 // Debugging: Log the actual response
                console.log("Fetched invoices:", invoices);

                if (!Array.isArray(invoices)) {
                    throw new Error("Invalid response format: Expected an array");
                }
    
                // Process invoices and get updated invoice IDs
                const updatedInvoiceIds = await updateInvoices(invoices);
    
                // Submit the payment
                fetch('https://demo-server-757m.onrender.com/paymentsmade', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formData,
                        payment: paymentNumber,
                        payment_amount: formData.payment_amount,
                        bill_items: updatedInvoiceIds,
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to post payments');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        setOpenSnackBar(true);

                        fetch('https://demo-server-757m.onrender.com/paymentsmade', {
                            method:'GET',
                            headers:{
                                'Authorization':`Bearer ${token}`
                            },
                            credentials:'include' 
                        })
                        .then(response => response.json())
                        .then((data) => {
                            setPayments(data)
                        })

                        
                        setSuccessMessage('Payment recorded successfully');
                        setFormData({
                            vendor_name: "",
                            vendor_email: "",
                            vendor_phone: "",
                            vendor_pin: "",
                            currency: "",
                            payment_amount: "",
                            payment_date: "",
                            payment: "",
                            payment_mode: "",
                            bill_items: []
                        });
                    })
                    .catch(error => {
                        console.error('Failed to post payment:', error);
                        setOpenSnackBar(true);
                        setSuccessMessage('Failed to record payment');
                    });
            })
            .catch(error => console.error('Error fetching invoices:', error));
    }
    
    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "vendor_name",
          headerName: "VENDOR NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.3,
          align: "left",
        },
        {
            field: "vendor_email",
            headerName: "VENDOR EMAIL",
            flex: 0.3,
        },
        {
            field: "vendor_phone",
            headerName: "VENDOR PHONE",
            flex: 0.2,
        },
        {
            field: "currency",
            headerName: "CURRENCY",
            flex: 0.15,
        },
        {
          field: "payment_amount",
          headerName: "AMOUNT RECEIVED",
          flex: 0.2,
          renderCell: (params) => {
            // Use Intl.NumberFormat for currency formatting
            const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency] || 'en-KE', {
              style: 'currency',
              currency: params.row.currency, // Replace with your desired currency
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
          field: "payment_date",
          headerName: "PAYMENT DATE",
          flex: 0.15,
        },
        {
          field: "payment_mode",
          headerName: "PAYMENT MODE",
          flex: 0.2,
        },
      ];

    return ( 
        <Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                  onClose={handleCloseSnackBar} 
                  severity={successMessage.startsWith('Failed') ? "error" : "success"} 
                  sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
            <Typography fontWeight={'bold'} fontSize={'27px'} textAlign={'center'}>NEW PAYMENT MADE</Typography>
            <Box
               sx={{
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto', // Adjust height for better flexibility
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '10px',
                      margin: '30px',
                      backgroundColor: '#fff',
                      // Media queries for responsive design
                      '@media (max-width: 600px)': {
                        margin: '15px', // Adjust margin for smaller screens
                        padding: '5px', // Adjust padding for smaller screens
                      },
                      '@media (min-width: 600px)': {
                        margin: '30px', // Keep margin for medium screens and above
                        padding: '10px', // Keep padding for medium screens and above
                      },
               }}
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: '30px' }}>
                    <FormControl>
                        <Typography fontWeight={'bold'}>Vendor Name</Typography>
                            <Select name="vendor_name" value={formData.vendor_name} onChange={handleCustomer} sx={{mb:'20px'}}>
                                <MenuItem value="">Select Vendor</MenuItem>
                                {customers.map((customer, index) => (
                                    <MenuItem key={index} value={customer.vendor_name}>{customer.vendor_name}</MenuItem>
                                ))}
                            </Select>
                    </FormControl>

                    <TextField 
                        type="text"
                        name="vendor_phone"
                        label="Vendor Phone"
                        value={formData.vendor_phone}
                        onChange={handleChange}
                        readOnly
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <TextField 
                        type="text"
                        name="vendor_email"
                        label="Vendor Email"
                        value={formData.vendor_email}
                        onChange={handleChange}
                        readOnly
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <TextField
                        type="text"
                        name="vendor_pin"
                        label="Vendor Pin"
                        value={formData.vendor_pin}
                        onChange={handleChange}
                        readOnly
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <TextField
                        type="text"
                        name="currency"
                        label="Currency"
                        value={formData.currency}
                        onChange={handleChange}
                        readOnly
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    {formData.vendor_name ? <h2 className="OWE">YOU OWE {formData.vendor_name} {formData.currency} {formData.total_amount_owed}</h2> : ""}

                    <TextField 
                        type="number"
                        name="payment_amount"
                        label="PAYMENT AMOUNT"
                        value={formData.payment_amount}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <FormControl>
                        <Typography fontWeight={'bold'}>PAYMENT MODE</Typography>
                        <Select
                            type="text"
                            name="payment_mode"
                            value={formData.payment_mode}
                            onChange={handleChange}
                            sx={{mb:'20px'}}
                        >
                            <MenuItem value="">Select Payment Mode</MenuItem>
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                            <MenuItem value="Cheque">Cheque</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography fontWeight={'bold'}>PAYMENT DATE</Typography>
                    <TextField
                        type="date"
                        name="payment_date"
                        value={formData.payment_date}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <TextField
                        type="number"
                        name="payment"
                        label= 'Payment Number'
                        className="bill-inputfield"
                        value={`${paymentNumber}`}
                        onChange={handleChange}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        sx={{mb:'20px',}}
                    />

                    <Button type="submit" color="secondary" variant="contained">SAVE PAYMENT</Button>

                </form>
            </Box>

            {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>PAYMENTS MADE</Typography>
                <Box
                    display={'grid'}
                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                    gap="10px"
                    margin="0 10px"
                >

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
                            sx={{
                                borderRadius: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'auto', // Adjust height for better flexibility
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                padding: '10px',
                                backgroundColor: '#fff',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            <CardContent>
                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Vendor Name:</Typography>
                                        <Typography fontWeight={'bold'}>{item.vendor_name}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Vendor Phone:</Typography>
                                        <Typography fontWeight={'bold'}>{item.vendor_phone}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Vendor Email:</Typography>
                                        <Typography fontWeight={'bold'}>{item.vendor_email}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Amount:</Typography>
                                        <Typography fontWeight={'bold'}>{new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:item.currency}).format(item.payment_amount)}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Payment Date:</Typography>
                                        <Typography fontWeight={'bold'}>{item.payment_date}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Payment Mode:</Typography>
                                        <Typography fontWeight={'bold'}>{item.payment_mode}</Typography>
                                    </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
                    </Box>
                </Box>
                </Box>
              ) : (
                <Box m="20px">
                  <Typography
                      fontSize='30px'
                      fontWeight='bold'
                      textAlign='center'
                  >
                      PAYMENTS MADE
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                        rows={payments}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                      />
                  </Box>
                </Box>
              )}

        </Box>
     );
}
 
export default PaymentsMade;