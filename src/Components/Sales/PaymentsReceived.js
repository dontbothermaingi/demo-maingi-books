import { useEffect, useState } from "react";
import { Box, Typography, Button,Snackbar, FormControl, Select, MenuItem, TextField, useMediaQuery, CardContent, Pagination, Card } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './PaymentsReceived.css';
import { useNavigate } from "react-router-dom";

function PaymentsReceived() {
    const [paymentsReceived, setPaymentsReceived] = useState([]);
    const [currencyErrorMessage, setCurrencyErrorMessage] = useState("");
    const [customers, setCustomers] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([])
    const [funds,setFunds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone:"",
        customer_email:"",
        customer_pin:"",
        amount_received: "",
        bank_charges: 0,
        currency: "",
        bank_name:"",
        bank_details:"",
        payment_date: "",
        sales_person: "",
        payment: "",
        payment_mode: "",
        deposit_to: "",
    });

    const paymentNumber = paymentsReceived.length + 1;


    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/paymentsreceived', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setPaymentsReceived(data))
            .catch(error => console.error('Error fetching payments:', error));
    }, [token]);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/customers', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setCustomers(data));
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
            .then((data) => {
                console.log(data); // Log the data to verify
                setFunds(data);
            })
            .catch(error => console.error('Error fetching funds:', error));
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

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        // Check if amount_received exceeds total_amount_owed
        const selectedCustomer = customers.find(customer => customer.customer_name === formData.customer_name);
        if (selectedCustomer && parseFloat(formData.amount_received) > parseFloat(selectedCustomer.total_amount_owed)) {
            setErrorMessage("Amount received cannot exceed the total amount owed.");
            return;
        }

        console.log(formData.currency)

        const selectedBank = bankAccounts.find(bank => bank.bank_details === formData.bank_details);
        if (selectedBank && formData.currency !== selectedBank.currency) {
            setCurrencyErrorMessage("You are depositing money into the wrong account.");
            return;
        }

        const paymentNumber = paymentsReceived.length + 1;

        fetch('https://db-demo-u07o.onrender.com/paymentsreceived', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify({
                ...formData,
                payment: paymentNumber, // Update the payment field with the incremented number
                amount_received: formData.amount_received
            })
        })
        .then((response) => response.json())
        .then((newPayment) => {


            setPaymentsReceived(prev => [...prev, newPayment]);

            
            let remainingAmount = parseFloat(formData.amount_received);

            const updateInvoices = (invoices) => {
                if (invoices.length > 0 && remainingAmount > 0) {
                    const invoice = invoices.shift(); // Select and remove the first unpaid or partially paid invoice
                    const paymentMade = parseFloat(invoice.amount_paid) || 0;
                    const totalAmount = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                    const remainingBalance = totalAmount - paymentMade;
                    const paymentToApply = Math.min(remainingAmount, remainingBalance);

                    const updatedPaymentMade = paymentMade + paymentToApply;
                    const amountOwed = totalAmount - updatedPaymentMade
                    const updatedStatus = updatedPaymentMade >= totalAmount ? "PAID" : "PARTIALLY PAID";

                    fetch(`https://db-demo-u07o.onrender.com/invoices/${invoice.invoice_number}`, {
                        method: 'PATCH',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        credentials:'include',
                        body: JSON.stringify({
                            status: updatedStatus,
                            amount_paid: updatedPaymentMade,
                            amount_owed: amountOwed
                        })
                    })
                    .then(response => response.json())
                    .then(updatedInvoice => {
                        remainingAmount -= paymentToApply;
                        updateInvoices(invoices);
                    })
                    .catch(error => console.error('Error updating invoice:', error));
                } else {
                    // Clear form data once all invoices are updated
                    setFormData({
                        customer_name: "",
                        amount_received: "",
                        bank_charges: "",
                        payment_date: "",
                        sales_person: "",
                        bank_name: "",
                        payment: "",
                        payment_mode: "",
                        deposit_to: "",
                        currency:"",
                        customer_phone:"",
                        customer_email:"",
                        bank_details:"",
                        customer_pin:"",
                    });
                }
            };

            // Fetch the unpaid or partially paid invoices associated with the customer
            fetch(`https://db-demo-u07o.onrender.com/invoices?customer_name=${formData.customer_name}&status=UNPAID,PARTIALLY PAID`,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
            .then(response => response.json())
            .then(invoices => {
                updateInvoices(invoices);
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
                            amount: selectedBank.amount + parseFloat(formData.amount_received) - parseFloat(formData.bank_charges || 0)
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

    function handleSelectCustomer(event) {
        const selectedValue = event.target.value;
        
        if (selectedValue === "new_customer") {
            navigate("/customers");
            return;
        }
        
        const selectedCustomer = customers.find(customer => customer.customer_name === selectedValue);
        
        if (selectedCustomer) {
            setFormData(prevFormData => ({
                ...prevFormData,
                customer_name: selectedCustomer.customer_name,
                customer_phone: selectedCustomer.customer_phone,
                customer_email: selectedCustomer.customer_email,
                vendor_pin: selectedCustomer.kra_pin,
                currency: selectedCustomer.currency,
                total_amount_owed: selectedCustomer.total_amount_owed
            }));
        }
    }

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
    
    const navigate = useNavigate()

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

    const totalPages = Math.ceil(paymentsReceived.length / itemsPerPage)
    const displayedItems = paymentsReceived.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "customer_name",
          headerName: "CUSTOMER NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.3,
          align: "left",
        },
        {
            field: "customer_email",
            headerName: "Customer Email",
            flex: 0.3,
        },
        {
            field: "customer_phone",
            headerName: "Customer Phone",
            flex: 0.2,
        },
        {
            field: "currency",
            headerName: "Currency",
            flex: 0.15,
        },
        {
            field: "bank_name",
            headerName: "Bank Name",
            flex: 0.2,
        },
        {
          field: "amount_received",
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
          field: "bank_charges",
          headerName: "BANK CHARGES",
          flex: 0.2,
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
            <Box>
                    <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>NEW PAYMENT RECEIVED</Typography>

                    <Box sx={{
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
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: '30px' }}>
                                    <FormControl>
                                    <Typography fontWeight={'bold'}>Customer Name</Typography>
                                        <Select name="customer_name" value={formData.customer_name} onChange={handleSelectCustomer} sx={{mb:'20px'}}>
                                            <MenuItem value="">Select Customer</MenuItem>
                                            {customers.map((customer, index) => (
                                                <MenuItem key={index} value={customer.customer_name}>{customer.customer_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        type="text"
                                        name="customer_phone"
                                        label="Customer Phone"
                                        value={formData.customer_phone}
                                        onChange={handleChange}
                                        readOnly
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                                    <TextField
                                        type="text"
                                        name="customer_email"
                                        label="Customer Email"
                                        value={formData.customer_email}
                                        onChange={handleChange}
                                        readOnly
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                                        <TextField
                                            type="text"
                                            name="customer_pin"
                                            label="Customer Pin"
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

                            {formData.customer_name ? <h2 className="OWE">{formData.customer_name} OWES YOU {formData.currency} {formData.total_amount_owed}</h2> : ""}

                                        <TextField
                                            type="number"
                                            name="amount_received"
                                            label="Amount Received"
                                            value={formData.amount_received}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{mb:'20px'}}
                                        />

                                        <FormControl>
                                            <Typography fontWeight={'bold'}>Payment Mode</Typography>
                                            <Select value={formData.payment_mode} name="payment_mode" onChange={handleChange} sx={{mb:'20px'}}>
                                                <MenuItem value="">Select Payment Mode</MenuItem>
                                                <MenuItem value="Cash">Cash</MenuItem>
                                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                <MenuItem value="Bank Remittance">Bank Remittance</MenuItem>
                                                <MenuItem value="Cheque">Cheque</MenuItem>
                                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                        <Typography>Deposit To</Typography>
                                        <Select name="deposit_to" value={formData.deposit_to} onChange={handleChange} sx={{mb:'20px'}}>
                                            <MenuItem value="">Select</MenuItem>
                                            {funds.map((fund, index) => (
                                                <MenuItem key={index} value={fund.fund_name}>{fund.fund_name}</MenuItem>
                                            ))}
                                        </Select>
                                        </FormControl>
                            

                                        {formData.deposit_to === 'Bank' ? 
                                            <Box>
                                                 <FormControl>
                                                <Typography fontWeight={'bold'}>BANK ACCOUNT</Typography>
                                                <Select name="bank_details" value={formData.bank_details} onChange={handleSelectBank} sx={{mb:'20px'}}>
                                                <MenuItem value="">Select Bank Account</MenuItem>
                                                {bankAccounts.map((bank,index) => (
                                                <MenuItem key={index} value={bank.bank_details}>{bank.bank_details}</MenuItem>
                                                ))}
                                                </Select>
                                                </FormControl>
                                            </Box> : ""
                                        }

                                        {formData.deposit_to === 'Bank' ? 
                                            <Box>
                                                <TextField
                                                    type="text"
                                                    name="bank_name"
                                                    placeholder="Bank Name"
                                                    className="bill-inputfield"
                                                    value={formData.bank_name}
                                                    onChange={handleChange}
                                                    readOnly
                                                    variant="outlined"
                                                    sx={{mb:'20px'}}
                                                />
                                            </Box>
                                        : "" }

                                        {formData.deposit_to === 'Bank' ? 
                                        <Box>
                                            <TextField
                                                type="text"
                                                name="bank_charges"
                                                label="Bank Charges"
                                                value={formData.bank_charges}
                                                onChange={handleChange}
                                                variant="outlined"
                                                sx={{mb:'20px'}}
                                            />
                                        </Box> : ""}

                                    <Typography fontWeight={'bold'}>Payment Date</Typography>
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
                                        type="text"
                                        name="sales_person"
                                        label="Sales Person"
                                        value={formData.sales_person}
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

                            <Button type="submit" variant="contained" color="secondary">Save</Button>

                        </form>
                    </Box>
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

            {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>PAYMENTS RECEIVED</Typography>
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
                                    <Typography>Customer Name: {item.customer_name}</Typography>
                                    <Typography>Customer Phone: {item.customer_name}</Typography>
                                    <Typography>Customer Email: {item.customer_email}</Typography>
                                    <Typography>Amount Received: {new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:item.currency}).format(item.amount_received)}</Typography>
                                    <Typography>Bank Charges: {item.bank_charges}</Typography>
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
                      PAYMENTS RECEIVED
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={paymentsReceived}
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

export default PaymentsReceived;
