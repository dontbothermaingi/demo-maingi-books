import { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, FormControl, Select, MenuItem, TextField, RadioGroup, FormControlLabel, TableContainer, Paper, Table, TableHead, TableRow, TableCell, ListSubheader, Divider, Card, CardContent, Pagination, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Radio } from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import { AddOutlined, DeleteForever } from "@mui/icons-material";

function FuelInvoice() {
    const [invoices, setInvoices] = useState([]);
    const [activeItem, setActiveItem] = useState(0);
    const [isVatInclusive, setIsVatInclusive] = useState(true); // true for inclusive, false for exclusive
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false)
    const [vatAmount, setVatAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [subTotalAmount, setSubTotalAmount] = useState(0)
    const [trucks, setTrucks] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [lastInvoiceNumber, setLastInvoiceNumber] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
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
        currency:"",
        vendor_pin: "",
        type_vat:"Inclusive Tax",
        due_date: "",
        amount_paid:"",
        amount_owed:"",
        sales_person: "",
        category_name:"",
        status:"UNPAID",
        items: [],
    });

    const [newItem, setNewItem] = useState([
        {
            item_details: "PUMP A",
            description: "",
            quantity: 0,
            vat: 0,
            sub_total:0,
            rate_vat: 0,
            rate: 0,
            amount: 0,
        }
    ]);

    const navigate = useNavigate(); 
    
    function handleActiveItem(id){
        setActiveItem( activeItem === id ? null : id);
    }

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/invoices', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then((data) => {
            const invoiceTotal = data.map((invoice) => {
                const totalAmount = invoice.items.reduce((total, item) => total + item.amount, 0);
                return { ...invoice, totalAmount };
            });
    
            // Sort invoices by invoice_number to get the last one
            const sortedInvoices = invoiceTotal.sort((a, b) => b.id - a.id);
            const lastInvoiceNumber = sortedInvoices.length > 0 ? sortedInvoices[0].invoice_number : null;
    
            console.log("Last Invoice Number:", lastInvoiceNumber);
            setLastInvoiceNumber(lastInvoiceNumber)
            setInvoices(invoiceTotal);
        });
    }, [token]);
    
    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/trucks',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setTrucks(data));
    }, [token]);

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/customers', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setCustomers(data));
    }, [token]);

    // useEffect(() => {

    //     if (newItem.length > 0){
    //         const firstItem = newItem[0]

    //     fetch('https://maingi-server-3.onrender.com/pumpnames', {
    //         method:'GET',
    //         headers:{
    //             'Authorization':`Bearer ${token}`
    //         },
    //         credentials:'include'
    //     })
    //       .then(response => response.json())
    //       .then(data => {

    //         const pumpname = firstItem.item_details

    //         const pump = pumpname ? data.filter(pump => pump.pump_name === pumpname) : [];
            
    //         const fuelPump = pump[0]
            
    //         console.log(fuelPump)

    //         const total = parseInt(fuelPump.litres, 10)

    //         setFuel(total);
    //       })
    //       .catch(error => console.error('Error fetching data:', error));
    //     }

    //     console.log("Fuel in litres",fuel)
          
    //   }, [newItem,token]);

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

    function handleToggleVat() {
        setIsVatInclusive(!isVatInclusive);
        
        setFormData(prevFormData => ({
            ...prevFormData,
            type_vat: isVatInclusive ? "Exclusive VAT" : "Inclusive VAT"
        }));
    }

    function handleNewItemChange(event, index) {
        const { name, value } = event.target;
        const uppercasedValue = name === 'item_details' || name === 'description' ? value.toUpperCase() : value;
        const values = [...newItem]

        // Update values based on their names
        values[index] = {...values[index], [name]:uppercasedValue}
        
        if (name === 'quantity' || name === 'rate' || name === 'vat'){
            if(isVatInclusive){
                values[index].amount = values[index].quantity * values[index].rate;
                values[index].rate_vat = ((values[index].vat / 100) * values[index].amount)
                values[index].sub_total = (values[index].amount - values[index].rate_vat)
            }else{
                values[index].sub_total = values[index].quantity * values[index].rate;
                values[index].rate_vat = (values[index].vat / 100) * values[index].sub_total;
                values[index].amount = values[index].sub_total + values[index].rate_vat;
            }
            
        }

        setNewItem(values);

        setVatAmount(values.reduce((total, item) => total + item.rate_vat, 0))
        setTotalAmount(values.reduce((total, item) => total + item.amount, 0))
        setSubTotalAmount(values.reduce((total, item) => total + item.sub_total, 0))

        setFormData(prevformData => ({
            ...prevformData,
            items: values,
        }))
    }

    useEffect(() => {
        setNewItem(prevItems => {
            return prevItems.map(item => {
                let newAmount;
                let newRateVat;
                let newSubTotal;
    
                if (isVatInclusive) {
                    newAmount = item.quantity * item.rate;
                    newRateVat = ((item.vat / 100) * newAmount).toFixed(2);
                    newSubTotal = (newAmount - newRateVat).toFixed(2);
                } else {
                    newAmount = (item.quantity * item.rate) + item.rate_vat;
                    newRateVat = ((item.vat / 100) * (item.quantity * item.rate)).toFixed(2);
                    newSubTotal = (item.quantity * item.rate).toFixed(2);
                }
    
                // Convert strings back to numbers to avoid issues in calculations
                newAmount = parseFloat(newAmount);
                newRateVat = parseFloat(newRateVat);
                newSubTotal = parseFloat(newSubTotal);
    
                // Only update if values have changed
                if (item.amount !== newAmount || item.rate_vat !== newRateVat || item.sub_total !== newSubTotal) {
                    return {
                        ...item,
                        amount: newAmount,
                        rate_vat: newRateVat,
                        sub_total: newSubTotal
                    };
                }
    
                return item;
            });
        });
    }, [isVatInclusive]);
    
        
    useEffect(() => {
    
        setVatAmount(newItem.reduce((total, item) => total + item.rate_vat, 0))
        setTotalAmount(newItem.reduce((total, item) => total + item.amount, 0))
        setSubTotalAmount(newItem.reduce((total, item) => total + item.sub_total, 0))
    
        // Ensure formData.items updates when VAT type is toggled 
        setFormData(prevFormData => ({
            ...prevFormData,
            items: newItem
        }));
        
    }, [newItem]);

    function handleNewInputField() {
        setNewItem([...newItem, { item_details: "PUMP A", description: "", weight: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total:0, amount: 0 }]);
    }

    function handleDeleteInputField(index) {
        const updatedItems = newItem.filter((_,i) => i !== index)

        setNewItem(updatedItems);
        
        setFormData(prevFormData => ({
            ...prevFormData,
            items: updatedItems
        }))
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
    
    const invoiceNumber = parseInt(lastInvoiceNumber) + 1

    function handleSubmit(event) {
        event.preventDefault();

        if(!formData.customer_name || !formData.invoice_terms){
            setOpenSnackbar(true);
            setErrorMessage(`Please fill in all the fields!`);
            return;
        }

        // Validate items
        const hasValidItem = formData.items.some(item => 
            item.item_details || item.description || item.quantity || item.vat || item.rate
        )

        if (!hasValidItem) {
            setOpenSnackbar(true)
            setErrorMessage("Please add at least one item before saving.");
            return;
        }
            
        setOpenDialog(true)
        setLoading(true)
    
        const calculateInvoiceTotal = () => {
            return formData.items.reduce((total, item) => total + item.amount, 0);
        }
        
    
        const allData = {
            ...formData,
            amount_paid:calculateInvoiceTotal(),
            amount_owed: 0,
            status: 'PAID',
            invoice_total: calculateInvoiceTotal(),
            fuel: 1,
            invoice_number: invoiceNumber,
        };
    
        fetch('https://demo-server-757m.onrender.com/fuelinvoices', {
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
                throw new Error('Network response was not ok')
            }else{
                setOpenDialog(false); // Open the dialog
                return response.json();
            }
           
        })
        .then((data) => {

            fetch('https://demo-server-757m.onrender.com/invoices', {
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

            
            setFormData({
                customer_name: "",
                customer_phone: "",
                customer_email: "",
                invoice_number: "",
                order_number: "",
                invoice_date: "",
                invoice_terms: "",
                due_date: "",
                vendor_pin: "",
                sales_person: "",
                account_name: "",
                category_name:"",
                description: "",
                amount_paid:"",
                amount_owed:"",
                items: [],
                terms_conditions: "",
            });

            setNewItem([{
                item_details: "",
                description: "",
                quantity: 0,
                vat: 0,
                sub_total:"",
                rate_vat: 0,
                rate: 0,
                amount: 0,
            }])
            
            setOpenDialog(false); 
            setLoading(false);
            setOpenSnackbar(true);
            setErrorMessage("Invoice saved successfully!")

        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            setOpenSnackbar(true)
            setErrorMessage("Failed to save the invoice. Please try again.")
        });
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };
    

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

    const handleViewDetails = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`);
      };

    const handleCustomBill = () => {
        navigate(`/invoice-control`);
      };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    
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
            onClick={() => handleViewDetails(params.row.invoice_number)}
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
            onClick={() => handleViewDetails(params.row.invoice_number)}
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
                  onClick={() => handleViewDetails(params.row.invoice_number)}
                >
                  <Typography variant="h7">
                    {formattedAmount}  {/* Display formatted amount */}
                  </Typography>
                </Box>
              );
            },
          },          
        {
          field: "consignee",
          headerName: "Consignee",
          flex: 0.5,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.invoice_number)}
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
          headerName: "Invoice Date",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.invoice_number)}
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
            onClick={() => handleViewDetails(params.row.invoice_number)}
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
            onClick={() => handleViewDetails(params.row.invoice_number)}
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

                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogContent sx={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <CircularProgress sx={{fontSize:'10px'}}/>
                            <Typography fontFamily={"GT Bold"}>Saving...</Typography>
                        </DialogContent>
                    </Dialog>

                <Box>
                    <Typography fontFamily={"GT Medium"} fontSize={{xs:'25px', md:'27px'}} textAlign={'center'} marginTop={'20px'}>NEW FUEL INVOICE</Typography>
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
                        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', margin:'40px'}}>
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
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <TextField
                                type="text"
                                name="invoice_number"
                                label="Invoice Number"
                                className="bill-inputfield"
                                value={invoiceNumber}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

    <                       Typography>Account</Typography>
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
                                        <MenuItem value='Diesel Sales'>Diesel Sales</MenuItem>
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

                            <TextField
                                type="date"
                                name="due_date"
                                value={formData.due_date}
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

                            <Typography fontFamily={"GT Bold"} fontSize={{xs:'20px', md:'25px'}}>ITEMS</Typography>
                            
                            {isMobile ? (
                                <Box mt={'20px'}>
                                    {newItem.map((item, index) => (
                                        <Box>
                                            <Box onClick={() => handleActiveItem(index)} sx={{backgroundColor:'purple', borderRadius:'5px',mb:'20px',cursor:'pointer', display:'flex', justifyContent:'center', padding:'5px'}}>
                                                <Typography sx={{cursor:'pointer'}} fontFamily={"GT Medium"} color={'white'}>Item {index}</Typography>
                                            </Box>
                                            {activeItem === index && 
                                                <Box key={index} display={'flex'} gap={'20px'} flexDirection={'column'} >

                                                <Typography fontFamily={"GT Medium"}>Pump</Typography>
                                                <Select 
                                                    name="item_details" 
                                                    value={item.item_details} 
                                                    className="bill-inputfield" 
                                                    onChange={(e) => handleNewItemChange(e, index)} 
                                                >
                                                    <MenuItem value="" >Select Pump</MenuItem>
                                                    <MenuItem value="PUMP A" >PUMP A</MenuItem>
                                                    <MenuItem value="PUMP B" >PUMP B</MenuItem>

                                                </Select> 

                                                <Typography fontFamily={"GT Medium"}>Vehicle</Typography>
                                                <Select name="description" value={item.description} onChange={(e) => handleNewItemChange(e, index)} fullWidth displayEmpty>
                                                    <MenuItem value="">Select Item</MenuItem>
                                                        {trucks.map((truck, index) => (
                                                            <MenuItem key={index} value={truck.truck_number}>{truck.truck_number}</MenuItem>
                                                        ))}
                                                </Select>

                                                <Typography fontFamily={"GT Medium"}>Litres</Typography>
                                                <TextField
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="Litres"
                                                    className="bill-inputfield"
                                                    value={item.quantity}
                                                    onChange={(e) => handleNewItemChange(e, index)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />

                                                <Typography fontFamily={"GT Medium"}>Rate</Typography>
                                                <TextField
                                                    type="number"
                                                    name="rate"
                                                    placeholder="Rate"
                                                    className="bill-inputfield"
                                                    value={item.rate}
                                                    onChange={(e) => handleNewItemChange(e, index)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />

                                                <Typography fontFamily={"GT Medium"}>Sub Total</Typography>
                                                <TextField
                                                    placeholder="Sub Total"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={item.sub_total}
                                                    InputProps={{ readOnly: true }}
                                                />

                                                <Typography fontFamily={"GT Medium"}>VAT</Typography>
                                                <Select
                                                    value={item.vat}
                                                    name="vat"
                                                    fullWidth
                                                    onChange={(e) => handleNewItemChange(e, index)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value=""><em>Select VAT</em></MenuItem>
                                                    <MenuItem value={16}>16%</MenuItem>
                                                    <MenuItem value={0}>0%</MenuItem>
                                                </Select>

                                                <Typography fontFamily={"GT Medium"}>VAT Amount</Typography>
                                                <TextField
                                                    placeholder="VAT Amount"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={item.rate_vat}
                                                    InputProps={{ readOnly: true }}
                                                />

                                                <Typography fontFamily={"GT Medium"}>Total Amount</Typography>
                                                <TextField
                                                    placeholder="Total Amount"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={item.amount}
                                                    InputProps={{ readOnly: true }}
                                                />

                                                <IconButton onClick={() => handleDeleteInputField(index)}>
                                                    <DeleteForever sx={{fontSize:'30px', color:'black', border:'2px solid red', padding:'10px', borderRadius:"8px", ":hover":{backgroundColor:'red', color:'white'}}}/>
                                                </IconButton>

                                                </Box>
                                            }
                                        </Box>
                                        
                                    ))}

                                    <Button onClick={handleNewInputField} variant="contained" style={{backgroundColor:'grey', color:'white', marginTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'20px'}}>
                                            <AddOutlined sx={{color:'white', fontSize:'19px'}}/>
                                            <Typography fontWeight={'bold'} fontSize={'12px'}>Add new row</Typography>
                                    </Button>
                                </Box>
                            ):(
                                <Box>
                                    <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', marginTop: 2 }}>
                                        <Table aria-label="Invoice Table" sx={{ minWidth: isMobile ? 900 : 'auto' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">Pump</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 90 }}><Typography fontWeight="bold">Truck</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 70 }}><Typography fontWeight="bold">Litres</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 90 }}><Typography fontWeight="bold">Rate</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 90 }}><Typography fontWeight="bold">Sub Total</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">VAT</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">VAT Amount</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">Total Amount</Typography></TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableContainer>

                                    <Box mt={'20px'}>
                                        {newItem.map((item, index) => (
                                            <Box key={index} display={'flex'} gap={'20px'} alignItems={'center'}>

                                                    <Select 
                                                        name="item_details" 
                                                        value={item.item_details} 
                                                        className="bill-inputfield" 
                                                        onChange={(e) => handleNewItemChange(e, index)} 
                                                    >
                                                        <MenuItem value="" >Select Pump</MenuItem>
                                                        <MenuItem value="PUMP A" >PUMP A</MenuItem>
                                                        <MenuItem value="PUMP B" >PUMP B</MenuItem>

                                                    </Select> 

                                                <Select name="description" value={item.description} onChange={(e) => handleNewItemChange(e, index)} fullWidth displayEmpty>
                                                    <MenuItem value="">Select Item</MenuItem>
                                                        {trucks.map((truck, index) => (
                                                            <MenuItem key={index} value={truck.truck_number}>{truck.truck_number}</MenuItem>
                                                        ))}
                                                </Select>

                                                <TextField
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="Litres"
                                                    className="bill-inputfield"
                                                    value={item.quantity}
                                                    onChange={(e) => handleNewItemChange(e, index)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />

                                                <TextField
                                                    type="number"
                                                    name="rate"
                                                    placeholder="Rate"
                                                    className="bill-inputfield"
                                                    value={item.rate}
                                                    onChange={(e) => handleNewItemChange(e, index)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />

                                                <TextField
                                                    placeholder="Sub Total"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={item.sub_total}
                                                    InputProps={{ readOnly: true }}
                                                />

                                                <Select
                                                    value={item.vat}
                                                    name="vat"
                                                    fullWidth
                                                    onChange={(e) => handleNewItemChange(e, index)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value=""><em>Select VAT</em></MenuItem>
                                                    <MenuItem value={16}>16%</MenuItem>
                                                    <MenuItem value={0}>0%</MenuItem>
                                                </Select>

                                                <TextField
                                                    placeholder="VAT Amount"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={item.rate_vat}
                                                    InputProps={{ readOnly: true }}
                                                />

                                                <TextField
                                                    placeholder="Total Amount"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={item.amount}
                                                    InputProps={{ readOnly: true }}
                                                />

                                                <IconButton onClick={() => handleDeleteInputField(index)}>
                                                    <DeleteForever sx={{fontSize:'30px', color:'black', border:'2px solid red', padding:'10px', borderRadius:"8px", ":hover":{backgroundColor:'red', color:'white'}}}/>
                                                </IconButton>

                                            </Box>
                                            
                                        ))}

                                        <Button onClick={handleNewInputField} variant="contained" style={{backgroundColor:'grey', color:'white', marginTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'20px'}}>
                                                <AddOutlined sx={{color:'white', fontSize:'19px'}}/>
                                                <Typography fontWeight={'bold'} fontSize={'12px'}>Add new row</Typography>
                                        </Button>

                                    </Box>
                                </Box>
                            )}
                            

                            <Box display={'flex'} flexDirection={'column'} gap={'15px'} m={'10px'} textAlign={'right'} fontWeight={'bold'}>
                                <Typography fontFamily={"GT Regular"} fontSize={{xs:'16px', md:'20px'}} fontWeight={'bold'}>
                                        Sub Total:{" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat(userLocale, { style: 'currency', currency: formData.currency }).format(subTotalAmount)
                                        ) : (
                                            new Intl.NumberFormat().format(subTotalAmount)
                                        )}
                                </Typography>

                                <Typography fontSize={{xs:'16px', md:'20px'}} fontFamily={"GT Regular"} fontWeight={'bold'}>VAT Amount: {" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat(userLocale, { style: 'currency', currency: formData.currency }).format(vatAmount)
                                        ) : (
                                            new Intl.NumberFormat().format(vatAmount)
                                        )}
                                </Typography>

                                <Typography fontSize={{xs:'16px', md:'20px'}} fontFamily={"GT Regular"} fontWeight={'bold'}>Total: {" "}
                                    { formData.currency ? (
                                        new Intl.NumberFormat(userLocale, {currency:formData.currency, style:'currency'}).format(totalAmount)
                                    ):(
                                        new Intl.NumberFormat().format(totalAmount)
                                    )}
                                </Typography>
                            </Box>

                            <Button variant="contained" color="secondary" disabled={loading} type="submit" sx={{width:'150px', fontFamily:"GT Bold"}}><Typography sx={{fontFamily:'GT Bold'}}>{loading ? "Saving..." : "Save"}</Typography></Button>
                            
                        </form>
                    </Box>

                    <Snackbar
                         open={openSnackbar} 
                         autoHideDuration={6000} 
                         onClose={handleCloseSnackbar} 
                         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes('Please') ? "error" : "success"} sx={{ width: '100%' }}>{errorMessage}</Alert>
                    </Snackbar>
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
                            onClick={() => handleViewDetails(item.invoice_number)}
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
                                            <Typography fontFamily={"GT Medium"} fontSize={'14px'}>Customer:</Typography>
                                            <Typography ffontFamily={"GT Light"} fontSize={'15px'}>{item.customer_name}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Invoice Number:</Typography>
                                            <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.invoice_number}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Amount:</Typography>
                                            <Typography fontFamily={"GT Light"} fontSize={'15px'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:item.currency}).format(item.totalAmount)}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Currency:</Typography>
                                            <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.currency}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Date:</Typography>
                                            <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.invoice_date}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Status:</Typography>
                                            <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.status}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Sales Person:</Typography>
                                            <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.sales_person}</Typography>
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

export default FuelInvoice;
