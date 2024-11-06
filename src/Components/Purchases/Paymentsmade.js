import { useEffect, useState } from "react";
import { Box, Typography, Button, Snackbar, FormControl, Select, MenuItem, TextField, useMediaQuery, Card, CardContent, Pagination } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './Paymentsmade.css';
import { useNavigate } from "react-router-dom";

function Paymentsmade() {
    const [vendors, setVendors] = useState([]);
    const [payments, setPayments] = useState([]);
    const [funds,setFunds] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [currentPage, setCurrentPage] = useState(1)
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem('access_token')
    const [currencyErrorMessage, setCurrencyErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        vendor_name: "",
        payment:"",
        bank_name: "",
        bank_details:"",
        currency:"",
        deposit_to: "",
        payment_amount: "",
        payment_date: "",
        payment_mode: "",
    });


    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/paymentsmade', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {
                const formattedPayment = data.map((payments) => ({
                    ...payments,
                    payment_amount: new Intl.NumberFormat().format(payments.payment_amount)
                }))
                setPayments(formattedPayment)})
    }, [token]);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/vendors', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setVendors(data))
    }, [token]);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/bankaccounts', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then(data => {
    
                setBankAccounts(data);
            })
            .catch(error => console.error('Error fetching bills:', error));
    }, [token]);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/funds', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setFunds(data))
    }, [token]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const selectedBank = bankAccounts.find(bank => bank.bank_details === formData.bank_details);
        if (selectedBank && parseFloat(formData.payment_amount) > parseFloat(selectedBank.amount)) {
            setErrorMessage("You have insufficient funds in your Bank Account.");
            return;
        }

        console.log(formData.currency)

        if (selectedBank && formData.currency !== selectedBank.currency) {
            setCurrencyErrorMessage("You are using the wrong currency to pay your Bill.");
            return;
        }
        
    
        const paymentNumber = payments.length + 1;
    
        fetch('https://db-demo-u07o.onrender.com/paymentsmade', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify({
                ...formData,
                payment: paymentNumber
            })
        })
        .then((response) => response.json())
        .then((newPayment) => {

                fetch('https://db-demo-u07o.onrender.com/paymentsmade', {
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    },
                    credentials:'include'
                })
                .then(response => response.json())
                .then((data) => {
                const formattedPayment = data.map((payments) => ({
                    ...payments,
                    payment_amount: new Intl.NumberFormat().format(payments.payment_amount)
                }))
                setPayments(formattedPayment)})

                
            let remainingAmount = parseFloat(formData.payment_amount);
    
            const updateInvoices = (bills) => {
                if (bills.length > 0 && remainingAmount > 0) {
                    const bill = bills.shift(); // Select and remove the first unpaid or partially paid invoice
                    const paymentMade = parseFloat(bill.payment_made) || 0;
                    const totalAmount = bill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                    const remainingBalance = totalAmount - paymentMade;
                    const paymentToApply = Math.min(remainingAmount, remainingBalance);
    
                    const updatedPaymentMade = paymentMade + paymentToApply;
                    const amountOwed = totalAmount - updatedPaymentMade
                    const updatedStatus = updatedPaymentMade >= totalAmount ? "PAID" : "PARTIALLY PAID";
    
                    fetch(`https://db-demo-u07o.onrender.com/newbills/${bill.id}`, {
                        method: 'PATCH',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        credentials:'include',
                        body: JSON.stringify({
                            amount_owed: amountOwed,
                            status: updatedStatus,
                            amount_paid: updatedPaymentMade
                        })
                    })
                    .then(response => response.json())
                    .then(updatedInvoice => {
                        remainingAmount -= paymentToApply;
                        updateInvoices(bills);
                    })
                    .catch(error => console.error('Error updating invoice:', error));
                } else {
                    // Clear form data once all invoices are updated
                    setFormData({
                        vendor_name: "",
                        amount_received: "",
                        currency:"",
                        bank_details:"",
                        bank_charges: "",
                        payment_date: "",
                        sales_person: "",
                        payment: "",
                        payment_mode: "",
                        deposit_to: "",
                    });
                }
            };
    
            // Fetch the unpaid or partially paid invoices associated with the customer
            fetch(`https://db-demo-u07o.onrender.com/newbills?vendor_name=${formData.vendor_name}&status=UNPAID,PARTIALLY PAID`,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
            .then(response => response.json())
            .then(bills => {
                updateInvoices(bills);
            })
            .catch(error => console.error('Error fetching invoices:', error));

            if (formData.deposit_to === 'Bank') {
                // Update bank information
                const selectedBank = bankAccounts.find(bank => bank.bank_details === formData.bank_details);
                if (selectedBank) {
                    fetch(`https://db-demo-u07o.onrender.com/bankaccounts/${selectedBank.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        credentials:'include',
                        body: JSON.stringify({
                            amount: selectedBank.amount - parseFloat(formData.payment_amount)
                        })
                    })
                    .then(response => response.json())
                    .then(updatedBank => {
                        console.log('Bank updated successfully:', updatedBank);
                    })
                    .catch(error => console.error('Error updating bank:', error));
                }
            }
        })
        .catch(error => console.error('Error creating payment:', error));
    }

    function handleSelectVendor(event) {
        const selectedValue = event.target.value;
        
        if (selectedValue === "new_vendor") {
            navigate("/vendors");
            return;
        }
        
        const selectedVendor = vendors.find(vendor => vendor.vendor_name === selectedValue);
        
        if (selectedVendor) {
            setFormData(prevFormData => ({
                ...prevFormData,
                vendor_name: selectedVendor.vendor_name,
                vendor_phone: selectedVendor.vendor_phone,
                vendor_email: selectedVendor.vendor_email,
                vendor_pin: selectedVendor.kra_pin,
                currency: selectedVendor.currency,
                total_amount_owed: selectedVendor.total_amount_owed
            }));
        }
    }

    const navigate = useNavigate()

    const paymentNumber = payments.length + 1;

    function handleSelectBank(event) {
        const selectedValue = event.target.value;
        
        const selectedCustomer = bankAccounts.find(customer => customer.bank_details === selectedValue);
        
        if (selectedCustomer) {
            setFormData(prevFormDepositData => ({
                ...prevFormDepositData,
                bank_name: selectedCustomer.bank_name,
                bank_details: selectedCustomer.bank_details,
                currency: selectedCustomer.currency,
            }));
        }
    }

    

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "vendor_name",
          headerName: "Vendor Name",
          flex: 0.2,
          cellClassName: "name-column--cell",
        },
        {
            field: "vendor_email",
            headerName: "Vendor Email",
            flex: 0.3,
        },
        {
            field: "vendor_phone",
            headerName: "Vendor Phone",
            flex: 0.3,
        },
        {
            field: "currency",
            headerName: "Currency",
            flex: 0.15,
        },
        {
            field: "bank_name",
            headerName: "Bank Name",
            flex: 0.3,
        },
        {
          field: "payment_amount",
          headerName: "Amount Paid",
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
          headerName: "Payment Date",
          flex: 0.2,
        },
        {
            field: "payment_mode",
            headerName: "Payment Mode",
            flex: 0.2,
        },
        
    ]

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

    return (
        <Box>
            <Box>
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
                    <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>NEW PAYMENT</Typography>
                    <form style={{ display: 'flex', flexDirection: 'column', margin: '30px' }} onSubmit={handleSubmit}>

                        <FormControl>
                            <Typography fontWeight={'bold'}>Vendor Name</Typography>
                            <Select name="vendor_name" className="bill-inputfield" value={formData.vendor_name} onChange={handleSelectVendor} sx={{mb:'20px'}}>
                                <MenuItem value="">Select Vendor</MenuItem>
                                {vendors.map((vendor, index) => (
                                 <MenuItem key={index} >{vendor.vendor_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            type="text"
                            name="vendor_phone"
                            label="Vendor Phone"
                            value={formData.vendor_phone}
                            onChange={handleChange}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="vendor_email"
                            label="Vendor Email"
                            value={formData.vendor_email}
                            onChange={handleChange}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="vendor_pin"
                            label="Vendor Pin"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                            InputProps={{ readOnly: true }}
                        />

                            <TextField
                                type="text"
                                name="currency"
                                label="Currency"
                                value={formData.currency}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mb:'20px'}}
                                InputProps={{ readOnly: true }}
                            />

                        {formData.vendor_name ? <h2 className="OWE">YOU OWE {formData.vendor_name} {formData.currency} {formData.total_amount_owed}</h2> : ""}


                            <TextField
                                type="number"
                                name="payment"
                                label="Payment Number"
                                value={paymentNumber}
                                variant="outlined"
                                sx={{mb:'20px'}}
                                InputProps={{ readOnly: true }}
                            />

                            <TextField
                                type="number"
                                name="payment_amount"
                                label="Payment Amount"
                                value={formData.payment_amount}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <FormControl>
                                <Typography fontWeight={'bold'}>Pay With</Typography>
                                <Select name="deposit_to" className="bill-inputfield" value={formData.deposit_to} onChange={handleChange} sx={{mb:'20px'}}>
                                    <MenuItem value="">Select</MenuItem>
                                    {funds.map((fund, index) => (
                                        <MenuItem key={index} value={fund.fund_name}>{fund.fund_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        

                        {formData.deposit_to === 'Bank' ? 
                            <Box className="bill-input">
                                <FormControl>
                                    <Typography fontWeight={'bold'}>BANK ACCOUNT</Typography>
                                    <Select name="bank_details" value={formData.bank_details} onChange={handleSelectBank} sx={{mb:"20px"}}>
                                    <MenuItem value="">Select Bank Account</MenuItem>
                                    {bankAccounts.map((bank,index) => (
                                    <MenuItem key={index} value={bank.bank_details}>{bank.bank_details}</MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </Box> : ""
                        }

                        {formData.deposit_to === 'Bank' ? 
                                <TextField
                                    type="text"
                                    name="bank_name"
                                    label="Bank Name"
                                    value={formData.bank_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{mb:'20px'}}
                                    InputProps={{ readOnly: true }}
                                />
                        : "" }

                        <Typography fontWeight={'bold'}>Date</Typography>
                            <TextField
                                type="date"
                                name="payment_date"
                                value={formData.payment_date}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <FormControl>
                            <Typography fontWeight={'bold'}>Payment Mode</Typography>
                            <Select value={formData.payment_mode} className="bill-inputfield" name="payment_mode" onChange={handleChange} sx={{mb:'20px'}}>
                                <MenuItem value="">Select Payment Mode</MenuItem>
                                <MenuItem value="Cash">Cash</MenuItem>
                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                <MenuItem value="Bank Remittance">Bank Remittance</MenuItem>
                                <MenuItem value="Cheque">Cheque</MenuItem>
                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                            </Select>
                            </FormControl>

                        <Button type="submit" variant="contained" color="secondary">Save Payment</Button>
                    </form>
                    {errorMessage && <Snackbar
                        open={Boolean(errorMessage)}
                        autoHideDuration={6000}
                        onClose={() => setErrorMessage('')}
                        message={errorMessage}
                        action={
                            <Button color="inherit" onClick={() => setErrorMessage('')}>Close</Button>
                        }
                    />}

                    {currencyErrorMessage && <Snackbar
                        open={Boolean(currencyErrorMessage)}
                        autoHideDuration={6000}
                        onClose={() => setCurrencyErrorMessage('')}
                        message={currencyErrorMessage}
                        action={
                            <Button color="inherit" onClick={() => setCurrencyErrorMessage('')}>Close</Button>
                        }
                    />}
                </Box>
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
                                margin: '30px',
                                backgroundColor: '#fff',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            <CardContent>
                                    <Typography>Vendor Name: {item.vendor_name}</Typography>
                                    <Typography>Vendor Phone: {item.vendor_name}</Typography>
                                    <Typography>Vendor Email: {item.vendor_email}</Typography>
                                    <Typography>Amount: {new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:item.currency}).format(item.payment_amount)}</Typography>
                                    <Typography>Payment Date: {item.payment_date}</Typography>
                                    <Typography>Payment Mode: {item.payment_mode}</Typography>
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
                      PAYMENTS
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

export default Paymentsmade;
