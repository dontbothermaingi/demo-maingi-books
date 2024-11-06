import { useEffect, useState } from "react";
import { Box, Typography, Button,IconButton, FormControl, Select, MenuItem, TextField,FormControlLabel, RadioGroup, Radio, ListSubheader, Divider, TableContainer, TableCell, Table, TableHead, TableBody, TableRow,Paper, Card, CardContent, Pagination } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';


function InventoryInvoice() {
    const [invoices, setInvoices] = useState([]);
    const [selectedItem, setSelectedItem] = useState([])
    const [openDialog, setOpenDialog] = useState(false);
    const [isVatInclusive, setIsVatInclusive] = useState(true); // true for inclusive, false for exclusive
    const [customers, setCustomers] = useState([]);
    const [storeItems, setStoreItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem('access_token')
    const itemsPerPage = 16;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        invoice_number: "",
        order_number: "",
        invoice_date: "",
        invoice_terms: "",
        vendor_pin: "",
        type_vat:"Inclusive Tax",
        due_date: "",
        sales_person: "",
        amount_paid:"",
        amount_owed:"",
        category_name:"",
        currency:"",
        payment_made:"",
        status:"UNPAID",
        items: [],
    });

    const [newItem, setNewItem] = useState({
        item_details: "",
        description: "",
        quantity: 0,
        vat: 0,
        sub_total:"",
        rate_vat: 0,
        rate: 0,
        amount: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/invoices', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {

                const sort = data.sort((a,b) => b.id - a.id)
                const invoiceTotal = sort.map((invoice) => {
                    const totalAmount = (invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setInvoices(invoiceTotal);
            });
    }, [token]);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/stockitems', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setStoreItems(data));
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
        if (formData.invoice_terms && formData.invoice_date) {
            calculateDueDate(formData.invoice_terms, formData.invoice_date);
        }
    }, [formData.invoice_terms, formData.invoice_date]);

    function handleChange(event) {
        const { name, value } = event.target;
        const uppercasedValue = name === 'consignee' || name === 'sales_person' ? value.toUpperCase() : value;

        if (value === "new_account") {
            navigate("/accounts");
        }else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: uppercasedValue,
            }));
        }
    }

    function handleNewItemChange(event) {
        const { name, value } = event.target;
        const uppercasedValue = name === 'item_details' || name === 'description' ? value.toUpperCase() : value;
        
        setNewItem(prevNewItem => {
            const updatedItem = { ...prevNewItem, [name]: uppercasedValue };
    
            if (name === 'quantity' || name === 'rate' || name === 'vat') {
                if (isVatInclusive) {
                    // Inclusive VAT calculation
                    updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                    updatedItem.rate_vat = ((updatedItem.vat / 100) * updatedItem.amount);
                    updatedItem.sub_total = (updatedItem.quantity * updatedItem.rate) - updatedItem.rate_vat;
                } else {
                    // Exclusive VAT calculation
                    updatedItem.rate_vat = ((updatedItem.vat / 100) * updatedItem.amount);
                    updatedItem.sub_total = (updatedItem.quantity * updatedItem.rate);
                    updatedItem.amount = (updatedItem.sub_total) + updatedItem.rate_vat;
                }
            }
            return updatedItem;
        });
    }
    
    function addInventoryItem() {
        const itemWithAmount = { ...newItem };
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, itemWithAmount]
        }));
        setNewItem({ item_details: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total:0, amount: 0 });
    }

    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
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
                currency:selectedCustomer.currency,
                invoice_terms:selectedCustomer.payment_terms
            }));
        }
    }

    const invoiceNumber = invoices.length + 1

    function handleSubmit(event) {
        event.preventDefault();

        const calculateInvoiceTotal = () => {
            return formData.items.reduce((total, item) => total + item.amount, 0);
        }
        
    
        const allData = {
            ...formData,
            status: 'UNPAID',
            amount_paid:0,
            amount_owed:calculateInvoiceTotal(),
            invoice_number: invoiceNumber,
        };
    
        // Submit the invoice
        fetch('https://db-demo-u07o.onrender.com/inventoryinvoices', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify(allData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {

            fetch('https://db-demo-u07o.onrender.com/invoices', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setInvoices(invoiceTotal);
            });

            console.log(data);
                    // Clear form data
                    setFormData({
                        customer_name: "",
                        customer_phone: "",
                        customer_email: "",
                        invoice_number: "",
                        order_number: "",
                        invoice_date: "",
                        invoice_terms: "",
                        due_date: "",
                        consignee: "",
                        vendor_pin: "",
                        sales_person: "",
                        account_name: "",
                        currency:"",
                        type_name:"",
                        category_name:"",
                        subcategory_name:"",
                        description: "",
                        items: [],
                        terms_conditions: "",
                    });
                
                    setOpenDialog(true); // Open the dialog
                })
                .catch((error) => {
                    console.error('Error with stock update operations:', error);
                });
    }
    
    

    function calculateDueDate(terms, invoiceDate) {
        const date = new Date(invoiceDate);
        switch (terms) {
            case 'Cash':
                date.setDate(date.getDate());
                break;
            case '15 days':
                date.setDate(date.getDate() + 15);
                break;
            case '30 days':
                date.setDate(date.getDate() + 30);
                break;
            case '45 days':
                date.setDate(date.getDate() + 45);
                break;
            case '60 days':
                date.setDate(date.getDate() + 60);
                break;
            default:
                return;
        }
        setFormData(prevFormData => ({
            ...prevFormData,
            due_date: date.toISOString().split('T')[0]
        }));
    }

    const vatAmount = formData.items.reduce((total, item) => total + item.rate_vat, 0);
    const totalAmount = isVatInclusive ? formData.items.reduce((total, item) => total + item.amount, 0) : (formData.items.reduce((total, item) => total + item.sub_total, 0) + vatAmount)
    const subTotalAmount = isVatInclusive ? formData.items.reduce((total, item) => total + item.sub_total, 0): formData.items.reduce((total, item) => total + item.sub_total, 0);


    function handleToggleVat() {
        setIsVatInclusive(!isVatInclusive);
        setFormData(prevFormData => ({
            ...prevFormData,
            type_vat: isVatInclusive ? "Exclusive VAT" : "Inclusive VAT"
        }));
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    const handlePaymentReceived = () => {
        navigate('/payments-received')
        handleCloseDialog();
    };

    const handleViewDetails = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`);
      };
    
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

      const userLocale = currencyLocaleMap[formData.currency] || 'en-KE'


    function handleSelectRemoveItem(event) {
        const selectedItemName = event.target.value;
        const selectedItem = storeItems.find(item => item.item_details === selectedItemName);
        setSelectedItem(selectedItem);
        setNewItem(prevNewItem => ({
            ...prevNewItem,
            item_details: selectedItemName,
            // quantity: selectedItem ? selectedItem.quantity : 0
        }));
    }

    function handleCustomBill(){
        navigate('/invoice-control')
    }
    
    const columns = [
        { field: "id", headerName: "ID", flex: 0.2 },
        {
          field: "customer_name",
          headerName: "Customer Name",
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
          headerName: "Invoice Number",
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
          field: "totalAmount",
          headerName: "Amount",
          flex: 0.3,
          renderCell: (params) => {
            // Use Intl.NumberFormat for currency formatting
            const formattedAmount = new Intl.NumberFormat(userLocale, {
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
                onClick={() => handleViewDetails(params.row.id)}
              >
                <Typography variant="h7">
                  {formattedAmount}  {/* Display formatted amount */}
                </Typography>
              </Box>
            );
          },
        },
        {
          field: "invoice_date",
          headerName: "Invoice Date",
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
          field: "sales_person",
          headerName: "Sales Person",
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

    const totalPages = Math.ceil(invoices.length / itemsPerPage)
    const displayedItems = invoices.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    return (
        <Box>
            <Box>
                    <Button
                        type="button"
                        color="secondary"
                        variant="contained"
                        onClick={()=> handleCustomBill()}
                        sx={{margin:'30px', width:'150px'}}
                    >
                        <Typography fontWeight={'bold'}>BACK</Typography>
                    </Button>

                <Box>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Payment Received?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Was the payment received?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handlePaymentReceived} color="primary">Yes</Button>
                        <Button onClick={handleCloseDialog} color="secondary">No</Button>
                    </DialogActions>
                </Dialog>

                    <Box>
                        <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} m={'20px'}>NEW INVENTORY INVOICE</Typography>

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
                                  margin: '40px', // Keep margin for medium screens and above
                                  padding: '10px', // Keep padding for medium screens and above
                                },
                              }}
                        >
                        <form style={{display:'flex', flexDirection:'column', margin:'40px'}} onSubmit={handleSubmit}>
                            <FormControl>
                                <Typography fontWeight={'bold'}>Customer Name</Typography>
                                <Select name="customer_name" value={formData.customer_name} onChange={handleSelectCustomer} sx={{mb:'20px'}}>
                                    <MenuItem value="">Select Customer</MenuItem>
                                    {customers.map((customer, index) => (
                                        <MenuItem key={index} value={customer.customer_name}>{customer.customer_name}</MenuItem>
                                    ))}
                                    <MenuItem value="new_customer">Create New Customer</MenuItem>
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
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <TextField
                                type="text"
                                name="invoice_number"
                                label="Invoice Number"
                                value={formData.invoice_number}
                                onChange={handleChange}
                                readOnly
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />


                                <Typography>Account</Typography>
                                <Select name="category_name" sx={{mb:'20px'}} value={formData.category_name} onChange={handleChange}>
                                    <MenuItem value=''>Select Account</MenuItem>

                                    <ListSubheader sx={{fontWeight:"bold", fontSize:'18px',}}>Fixed Assets</ListSubheader>
                                    <Divider orientation="horizontal" sx={{ml:'20px', mr:'20px'}}/>
                                        <MenuItem value='Furniture'>Furniture</MenuItem>
                                        <MenuItem value='Vehicles'>Vehicles</MenuItem>
                                        <MenuItem value='Machinery and Equipment'>Machinery and Equipment</MenuItem>
                                        <MenuItem value='Computer Hardware and Software'>Computer Hardware and Software</MenuItem>
                                        <MenuItem value='Leasehold Assets'>Leasehold Assets</MenuItem>
                                        <MenuItem value='Land'>Land</MenuItem>

                                    <ListSubheader sx={{fontWeight:"bold", fontSize:'18px',}}>Current Assets</ListSubheader>
                                    <Divider orientation="horizontal" sx={{ml:'20px', mr:'20px'}}/>
                                        <MenuItem value='Cash at Bank'>Cash at Bank</MenuItem>
                                        <MenuItem value='Cash at Hand'>Cash at Hand</MenuItem>
                                        <MenuItem value='Debtors'>Debtors</MenuItem>
                                        <MenuItem value='Stock'>Stock</MenuItem>
                                        <MenuItem value='Office Supplies'>Office Supplies</MenuItem>
                                        <MenuItem value='Work in Progress Goods'>Work in Progress Goods</MenuItem>
                                        <MenuItem value='Finished Goods'>Finished Goods</MenuItem>
                                        <MenuItem value='Merchandise Inventory'>Merchandise Inventory</MenuItem>
                                        <MenuItem value='Prepaid Rent'>Prepaid Rent</MenuItem>
                                        <MenuItem value='Prepaid Insurance'>Prepaid Insurance</MenuItem>
                                        <MenuItem value='Prepaid Taxes'>Prepaid Taxes</MenuItem>
                                        <MenuItem value='Accrued Revenue'>Accrued Revenue</MenuItem>

                                    <ListSubheader sx={{fontWeight:"bold", fontSize:'18px',}}>Long Term Liabilities</ListSubheader>
                                    <Divider orientation="horizontal" sx={{ml:'20px', mr:'20px'}}/>
                                        <MenuItem value='Long Term Loans'>Long Term Loans</MenuItem>

                                    <ListSubheader sx={{fontWeight:"bold", fontSize:'18px',}}>Short Term Liabilities</ListSubheader>
                                    <Divider orientation="horizontal" sx={{ml:'20px', mr:'20px'}}/>
                                        <MenuItem value='Accrued Expenses'>Accrued Expenses</MenuItem>
                                        <MenuItem value='Unearned Revenue'>Unearned Revenue</MenuItem>
                                        <MenuItem value='Taxes Payable'>Taxes Payable</MenuItem>
                                        <MenuItem value='Office Supplies'>Office Supplies</MenuItem>
                                        <MenuItem value='Unpaid Rent'>Unpaid Rent</MenuItem>
                                        <MenuItem value='Unpaid Wages'>Unpaid Wages</MenuItem>
                                        <MenuItem value='Creditor'>Creditor</MenuItem>

                                    <ListSubheader sx={{fontWeight:"bold", fontSize:'18px',}}>Expenses</ListSubheader>
                                    <Divider orientation="horizontal" sx={{ml:'20px', mr:'20px'}}/>
                                        <MenuItem value='Advertising and Marketing'>Advertising and Marketing</MenuItem>
                                        <MenuItem value='Automobile Expense'>Automobile Expense</MenuItem>
                                        <MenuItem value='Bad Debt'>Bad Debt</MenuItem>
                                        <MenuItem value='Bank Fees Charges'>Bank Fees Charges</MenuItem>
                                        <MenuItem value='Consultant Expense'>Consultant Expense</MenuItem>
                                        <MenuItem value='Depreciation Expense'>Depreciation Expense</MenuItem>
                                        <MenuItem value='Diesel Expense'>Diesel Expense</MenuItem>
                                        <MenuItem value='IT and Internet Expense'>IT and Internet Expense</MenuItem>
                                        <MenuItem value='Janitorial Expense'>Janitorial Expense</MenuItem>
                                        <MenuItem value='Lodging'>Lodging</MenuItem>
                                        <MenuItem value='Postage'>Postage</MenuItem>
                                        <MenuItem value='Printing and Stationery'>Printing and Stationery</MenuItem>
                                        <MenuItem value='Purchase Discounts'>Purchase Discounts</MenuItem>
                                        <MenuItem value='Rent Expense'>Rent Expense</MenuItem>
                                        <MenuItem value='Salaries and Employee Wages'>Salaries and Employee Wages</MenuItem>
                                        <MenuItem value='Telephone Expense'>Telephone Expense</MenuItem>
                                        <MenuItem value='Travel Expense'>Travel Expense</MenuItem>
                                        <MenuItem value='Repairs and Maintenance'>Repairs and Maintenance</MenuItem>
                                        <MenuItem value='Meals and Entertainment'>Meals and Entertainment</MenuItem>
                                        <MenuItem value='New Tyres'>New Tyres</MenuItem>
                                        <MenuItem value='Retread Tyres'>Retread Tyres</MenuItem>
                                        <MenuItem value='Spare Parts'>Spare Parts</MenuItem>

                                    <ListSubheader sx={{fontWeight:"bold", fontSize:'18px',}}>Income</ListSubheader>
                                    <Divider orientation="horizontal" sx={{ml:'20px', mr:'20px'}}/>
                                        <MenuItem value='Discount'>Discount</MenuItem>
                                        <MenuItem value='General Income'>General Income</MenuItem>
                                        <MenuItem value='Interest Income'>Interest Income</MenuItem>
                                        <MenuItem value='Inventory Sales'>Inventory Sales</MenuItem>
                                        <MenuItem value='Late Fee Income'>Late Fee Income</MenuItem>
                                        <MenuItem value='Other Charges'>Other Charges</MenuItem>
                                        <MenuItem value='Other Sales'>Other Sales</MenuItem>
                                        <MenuItem value='Shipping Charge'>Shipping Charge</MenuItem>
                                        <MenuItem value='Transport Sales'>Transport Sales</MenuItem>

                                    <MenuItem value='new_account'>Create New Account</MenuItem>
                                </Select>

                            <Typography fontWeight={'bold'}>Invoice Date</Typography>
                            <TextField
                                type="date"
                                name="invoice_date"
                                value={formData.invoice_date}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <TextField
                                type="text"
                                name="invoice_terms"
                                label="Invoice Terms"
                                value={formData.invoice_terms}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <Typography fontWeight={'bold'}>Due Date</Typography>
                            <TextField
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <Typography fontWeight={'bold'}>Sales Person</Typography>
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


                            <RadioGroup
                                name="vat_type"
                                value={isVatInclusive ? "Inclusive VAT" : "Exclusive VAT"} // use value for better control
                                onChange={handleToggleVat}
                                sx={{display:'flex', flexDirection:'row'}}
                            >
                                <FormControlLabel
                                    value="Inclusive VAT"
                                    control={<Radio />}
                                    label="Inclusive VAT"
                                    checked={isVatInclusive}
                                />
                                <FormControlLabel
                                    value="Exclusive VAT"
                                    control={<Radio />}
                                    label="Exclusive VAT"
                                    checked={!isVatInclusive}
                                />
                            </RadioGroup>

                            <Divider orientation="horizontal" sx={{margin:'20px'}}/>



                        {newItem.item_details ? <h2 className="OWE">THERE ARE {new Intl.NumberFormat().format(selectedItem.quantity)} {selectedItem.item_details}'s LEFT.</h2> : ""}

            
                            <label className="label">Items</label>

                            <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', marginTop: 2 }}>
                                <Table aria-label="Invoice Table" sx={{ minWidth: isMobile ? 900 : 'auto' }}>
                                    <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Item Details</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 100 }}><Typography fontWeight="bold">Quantity</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Rate</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 120 }}><Typography fontWeight="bold">Sub Total</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 80 }}><Typography fontWeight="bold">VAT</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 120 }}><Typography fontWeight="bold">VAT Amount</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 120 }}><Typography fontWeight="bold">Total Amount</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 80 }}><Typography fontWeight="bold">Action</Typography></TableCell>
                                    </TableRow>
                                    </TableHead>

                                    <TableBody>
                                    {formData.items.map((item, index) => (
                                        <TableRow key={index}>
                                        <TableCell>{item.item_details}</TableCell>
                                        <TableCell>{new Intl.NumberFormat().format(item.quantity)}</TableCell>
                                        <TableCell>{new Intl.NumberFormat().format(item.rate)}</TableCell>
                                        <TableCell>{new Intl.NumberFormat().format(item.sub_total)}</TableCell>
                                        <TableCell>{item.vat}%</TableCell>
                                        <TableCell>{new Intl.NumberFormat().format(item.rate_vat)}</TableCell>
                                        <TableCell>{new Intl.NumberFormat().format(item.amount)}</TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={() => handleDeleteItem(index)}>
                                            <CloseIcon />
                                            </IconButton>
                                        </TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Row for Adding New Item */}
                                    <TableRow>
                                        <TableCell>
                                        <Select
                                            value={newItem.item_details}
                                            name="item_details"
                                            fullWidth
                                            displayEmpty
                                            onChange={handleSelectRemoveItem}
                                        >
                                            <MenuItem value=""><em>Select Item</em></MenuItem>
                                            {storeItems.map((item, index) => (
                                            <MenuItem key={index} value={item.item_details}>{item.item_details}</MenuItem>
                                            ))}
                                        </Select>
                                        </TableCell>

                                        <TableCell>
                                        <TextField
                                            type="number"
                                            name="quantity"
                                            placeholder="Quantity"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={newItem.quantity}
                                            onChange={handleNewItemChange}
                                        />
                                        </TableCell>

                                        <TableCell>
                                        <TextField
                                            type="number"
                                            name="rate"
                                            placeholder="Rate"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={newItem.rate}
                                            onChange={handleNewItemChange}
                                        />
                                        </TableCell>

                                        <TableCell>
                                        <TextField
                                            placeholder="Sub Total"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={newItem.sub_total}
                                            InputProps={{ readOnly: true }}
                                        />
                                        </TableCell>

                                        <TableCell>
                                        <Select
                                            value={newItem.vat}
                                            name="vat"
                                            fullWidth
                                            onChange={handleNewItemChange}
                                            displayEmpty
                                        >
                                            <MenuItem value=""><em>Select VAT</em></MenuItem>
                                            <MenuItem value={16}>16%</MenuItem>
                                            <MenuItem value={0}>0%</MenuItem>
                                        </Select>
                                        </TableCell>

                                        <TableCell>
                                        <TextField
                                            placeholder="VAT Amount"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={newItem.rate_vat}
                                            InputProps={{ readOnly: true }}
                                        />
                                        </TableCell>

                                        <TableCell>
                                        <TextField
                                            placeholder="Total Amount"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={newItem.amount}
                                            InputProps={{ readOnly: true }}
                                        />
                                        </TableCell>

                                        <TableCell>
                                        <IconButton color="primary" onClick={() => handleDeleteItem(formData.items.length)}>
                                            <CloseIcon />
                                        </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Button type="button" variant="contained" color="secondary" onClick={addInventoryItem} sx={{margin:'20px'}}><Typography fontWeight={'bold'}>ADD ITEM</Typography></Button>

                            <Box display={'flex'} flexDirection={'column'} gap={'15px'} m={'10px'} textAlign={'right'} fontWeight={'bold'}>
                                <Typography fontWeight={'bold'}>
                                        Sub Total Amount:{" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat(userLocale, { style: 'currency', currency: formData.currency }).format(subTotalAmount)
                                        ) : (
                                            subTotalAmount
                                        )}
                                </Typography>

                                <Typography fontWeight={'bold'}>VAT Amount: {" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat(userLocale, { style: 'currency', currency: formData.currency }).format(vatAmount)
                                        ) : (
                                            vatAmount
                                        )}
                                </Typography>

                                <Typography fontWeight={'bold'}>Total Amount: {" "}
                                    { formData.currency ? (
                                        new Intl.NumberFormat(userLocale, {currency:formData.currency, style:'currency'}).format(totalAmount)
                                    ):(
                                        totalAmount
                                    )}
                                </Typography>
                            </Box>
                            <Button variant="contained" color="secondary" type="submit" sx={{width:'150px'}}><Typography fontWeight={'bold'}>SAVE</Typography></Button>
                        </form>
                        </Box>
                    </Box>
                </Box>
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

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleViewDetails(item.id)}
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
                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Customer Name:</Typography>
                                            <Typography fontWeight={'bold'}>{item.customer_name}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Invoice Number:</Typography>
                                            <Typography  fontWeight={'bold'}>{item.invoice_number}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Amount:</Typography>
                                            <Typography fontWeight={'bold'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:item.currency}).format(item.totalAmount)}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Currency:</Typography>
                                            <Typography fontWeight={'bold'}>{item.currency}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Date:</Typography>
                                            <Typography fontWeight={'bold'}>{item.invoice_date}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Status:</Typography>
                                            <Typography fontWeight={'bold'}>{item.status}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Sales Person:</Typography>
                                            <Typography fontWeight={'bold'}>{item.sales_person}</Typography>
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
                      INVOICES
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={invoices}
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

export default InventoryInvoice;
