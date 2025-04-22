import { useEffect, useState } from "react";
import { Box, Button, Typography,IconButton, FormControl, MenuItem, Select, TextField, Divider, ListSubheader, Radio, RadioGroup, FormControlLabel, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Card, CardContent, Pagination, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Invoice.css';
import { useNavigate } from "react-router-dom";

function CreditNote() {
    const [creditnotes, setCreditnotes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [storeItems, setStoreItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const [vendors, setVendors] = useState([]);
    const [isVatInclusive, setIsVatInclusive] = useState(true); // true for inclusive, false for exclusive
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        vendor_pin:"",
        credit_number: "",
        measurement:"",
        currency:"",
        credit_date: "",
        category_name:"",
        type_vat: "Inclusive VAT",
        items: [],
    });

    const paymentNumber = creditnotes.length + 1;

    const [newItem, setNewItem] = useState({
        item_details: "",
        quantity: 0,
        type_vat:"",
        vat: 0,
        sub_total: 0,
        rate_vat: 0,
        rate: 0,
        amount: 0,
    });

    useEffect(() => {
        fetch('https://maingi-demo-server.onrender.com/creditnotes',{
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
                setCreditnotes(invoiceTotal);
            });
    }, [token]);

    useEffect(() => {
        if (formData.payment_terms && formData.bill_date) {
            calculateDueDate(formData.payment_terms, formData.bill_date);
        }
    }, [formData.payment_terms, formData.bill_date]);

    useEffect(() => {
        fetch('https://maingi-demo-server.onrender.com/customers', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then(data => setVendors(data))
            .catch(error => console.error('Error fetching vendors:', error));
    }, [token]);

    useEffect(() => {
        fetch('https://maingi-demo-server.onrender.com/stockitems',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => setStoreItems(data));
    }, [token]);

   const navigate = useNavigate()

    function calculateDueDate(terms, invoiceDate) {
        const date = new Date(invoiceDate);
        switch (terms) {
            case 'Cash':
                date.setDate(date.getDate())
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

    function handleSelectVendor(event) {
        const selectedVendor = vendors.find(vendor => vendor.customer_name === event.target.value);
        setFormData(prevFormData => ({
            ...prevFormData,
            customer_name: selectedVendor.customer_name,
            customer_phone: selectedVendor.customer_phone,
            customer_email: selectedVendor.customer_email,
            vendor_pin: selectedVendor.kra_pin,
        }));
    }

    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
    }

    function handleChange(event) {
        const { name, value } = event.target;
        if (value === "new_account") {
            navigate("/accounts");
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    }

    function handleNewItemChange(event) {
        const { name, value } = event.target;
        const uppercasedValue = name === 'item_details' ? value.toUpperCase() : value;
    
        setNewItem(prevNewItem => {
          const updatedItem = { ...prevNewItem, [name]: uppercasedValue };
          if (name === 'quantity' || name === 'rate' || name === 'vat') {
            if (isVatInclusive) {
              // Inclusive VAT calculation
              updatedItem.amount = updatedItem.quantity * updatedItem.rate;
              updatedItem.rate_vat = ((updatedItem.vat / 100) * updatedItem.amount);
              updatedItem.sub_total = (updatedItem.quantity * updatedItem.rate) - updatedItem.rate_vat
            } else {
              // Exclusive VAT calculation
              updatedItem.rate_vat = ((updatedItem.vat / 100) * updatedItem.amount);
              updatedItem.sub_total = (updatedItem.quantity * updatedItem.rate)
              updatedItem.amount = (updatedItem.sub_total) + updatedItem.rate_vat;
              
            }
          }
          return updatedItem;
        });
      }
    
      
      // Ensure to include VAT and rate_vat when adding an item
      function addItem() {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, newItem]
        }));
        setNewItem({ item_details: "", description: "",measurement:"", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total: 0 ,amount: 0 });
    }
      
    
    function handleSubmit(event) {
        event.preventDefault();
    
        const paymentNumber = creditnotes.length + 1;
    
        fetch('https://maingi-demo-server.onrender.com/creditnotes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify({
                ...formData, 
                credit_number: paymentNumber,
                category_name: 'Stock'
            })
        })
            .then(response => response.json())
            .then(data => {

                fetch('https://maingi-demo-server.onrender.com/creditnotes',{
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
                    setCreditnotes(invoiceTotal);
                });

                console.log('Submitted bill:', data);
                setFormData({
                    customer_name: "",
                    customer_phone: "",
                    customer_email: "",
                    vendor_pin:"",
                    credit_number: "",
                    measurement:"",
                    credit_date: "",
                    currency:"",
                    category_name:"",
                    type_vat: "",
                    items: [],
                });
            setOpenDialog(true); // Open the dialog
            })
            .catch(error => console.error('Error submitting bill:', error));
    }
    
    const vatAmount = formData.items.reduce((total, item) => total + item.rate_vat, 0);
    const totalAmount = isVatInclusive ? formData.items.reduce((total, item) => total + item.amount, 0) : (formData.items.reduce((total, item) => total + item.amount, 0))
    const subTotalAmount = isVatInclusive ? formData.items.reduce((total, item) => total + item.sub_total, 0) : formData.items.reduce((total, item) => total + item.sub_total, 0);

    function handleToggleVat() {
        setIsVatInclusive(!isVatInclusive);
        setFormData(prevFormData => ({
            ...prevFormData,
            type_vat: isVatInclusive ? "Exclusive VAT" : "Inclusive VAT"
        }));
    }

    const units = [
        // Volume
        { value: 'L', label: 'Liters (L)' },
        { value: 'mL', label: 'Milliliters (mL)' },
        { value: 'gal', label: 'Gallons (gal)' },
        { value: 'qt', label: 'Quarts (qt)' },
        { value: 'pt', label: 'Pints (pt)' },
      
        // Mass/Weight
        { value: 'g', label: 'Grams (g)' },
        { value: 'kg', label: 'Kilograms (kg)' },
        { value: 'mg', label: 'Milligrams (mg)' },
        { value: 'oz', label: 'Ounces (oz)' },
        { value: 'lb', label: 'Pounds (lb)' },
      
        // Length/Dimensions
        { value: 'mm', label: 'Millimeters (mm)' },
        { value: 'cm', label: 'Centimeters (cm)' },
        { value: 'm', label: 'Meters (m)' },
        { value: 'in', label: 'Inches (in)' },
        { value: 'ft', label: 'Feet (ft)' },
      
        // Pressure
        { value: 'Pa', label: 'Pascals (Pa)' },
        { value: 'bar', label: 'Bar' },
        { value: 'psi', label: 'Pounds per Square Inch (psi)' },
        { value: 'kPa', label: 'Kilopascals (kPa)' },
      
        // Temperature
        { value: 'C', label: 'Degrees Celsius (°C)' },
        { value: 'F', label: 'Degrees Fahrenheit (°F)' },
      
        // Quantity
        { value: 'pcs', label: 'Pieces (pcs)' },
        { value: 'sets', label: 'Sets' },
        { value: 'pairs', label: 'Pairs' },
      
        // Torque
        { value: 'Nm', label: 'Newton-meters (Nm)' },
        { value: 'lb-ft', label: 'Pound-feet (lb-ft)' },
        { value: 'kg-m', label: 'Kilogram-meters (kg-m)' },
      
        // Speed/RPM
        { value: 'RPM', label: 'Revolutions Per Minute (RPM)' },
        { value: 'km/h', label: 'Kilometers Per Hour (km/h)' },
        { value: 'mph', label: 'Miles Per Hour (mph)' },
      
        // Electrical
        { value: 'V', label: 'Volts (V)' },
        { value: 'A', label: 'Amperes (A)' },
        { value: 'Ohm', label: 'Ohms (Ω)' },
        { value: 'W', label: 'Watts (W)' },
      
        // Fuel Efficiency
        { value: 'mpg', label: 'Miles Per Gallon (mpg)' },
        { value: 'L/100km', label: 'Liters Per 100 Kilometers (L/100 km)' },
      
        // Area
        { value: 'mm²', label: 'Square Millimeters (mm²)' },
        { value: 'cm²', label: 'Square Centimeters (cm²)' },
        { value: 'm²', label: 'Square Meters (m²)' },
        { value: 'in²', label: 'Square Inches (in²)' },
        { value: 'ft²', label: 'Square Feet (ft²)' },
      
        // Concentration
        { value: 'PPM', label: 'Parts Per Million (PPM)' },
        { value: '%', label: 'Percentage (%)' },
      ];
    
    const handleViewDetails = (billId) => {
        navigate(`/newbills/${billId}`);
      };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    const handlePaymentReceived = () => {
        navigate('/payments-made')
        handleCloseDialog();
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.2 },
        {
          field: "customer_name",
          headerName: "Customer Name",
          flex: 0.2,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "customer_email",
            headerName: "Customer Email",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "customer_phone",
            headerName: "Customer Phone",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
          field: "credit_date",
          headerName: "Credit Date",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
            flex: 0.2,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.credit_number)}
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

    const totalPages = Math.ceil(creditnotes.length / itemsPerPage)
    const displayedItems = creditnotes.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box margin={'40px'}>

             <Box>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Payment Made?</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">Have you paid the customer?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlePaymentReceived} color="primary">Yes</Button>
                            <Button onClick={handleCloseDialog} color="secondary">No</Button>
                        </DialogActions>
                </Dialog>

                <Box
                   sx={{
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto', // Adjust height for better flexibility
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    padding: '10px',
                    backgroundColor: '#fff',
                    // Media queries for responsive design
                    '@media (max-width: 600px)': {
                      padding: '5px', // Adjust padding for smaller screens
                    },
                    '@media (min-width: 600px)': {
                      padding: '10px', // Keep padding for medium screens and above
                    },
                  }}
                   
                >
                    <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>NEW CREDIT NOTE</Typography>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: '30px' }}>

                        <FormControl>
                        <Typography fontWeight={'bold'}>Vendor Name</Typography>
                        <Select name="customer_name" value={formData.customer_name} onChange={handleSelectVendor} sx={{mb:'20px'}}>
                            <MenuItem value="">Select Vendor</MenuItem>
                            {vendors.map((vendor, index) => (
                                <MenuItem key={index} value={vendor.customer_name}>{vendor.customer_name}</MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        

                        <TextField
                            type="text"
                            name="credit_number"
                            label="Credit Number"
                            value={paymentNumber}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="customer_email"
                            label="Customer Email"
                            value={formData.customer_email}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />


                        <TextField
                            type="text"
                            name="customer_phone"
                            label="Customer Phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="vendor_pin"
                            label="Customer Pin"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="currency"
                            label="Currency"
                            value={formData.currency}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />
 
                        <FormControl>
                                <Typography fontWeight={'bold'}>Account</Typography>
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
                        </FormControl>

                        <Typography fontWeight={'bold'}>Date</Typography>
                        <TextField
                            type="date"
                            name="bill_date"
                            value={formData.bill_date}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />
                        
                        <FormControl>
                            <Typography fontWeight={'bold'}>Payment terms</Typography>
                                <Select
                                    value={formData.payment_terms}
                                    className="bill-input"
                                    name="payment_terms"
                                    onChange={handleChange}
                                    sx={{mb:'20px'}}
                                >
                                    <MenuItem value="">Select Payment Term</MenuItem>
                                    <MenuItem value="Cash">Cash</MenuItem>
                                    <MenuItem value="15 days">15 days</MenuItem>
                                    <MenuItem value="30 days">30 days</MenuItem>
                                    <MenuItem value="45 days">45 days</MenuItem>
                                    <MenuItem value="60 days">60 days</MenuItem>
                                </Select>
                        </FormControl>

                        <Typography fontWeight={'bold'}>Due Date</Typography>
                        <TextField
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                            variant='outlined'
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


                        <Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Item Details</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 100 }}><Typography fontWeight="bold">Quantity</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Measurement</Typography></TableCell>
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
                                                <TableCell>{new Intl.NumberFormat().format(item.measurement)}</TableCell>
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
                                        <TableRow>
                                            <TableCell>
                                                <Select 
                                                    type="text"
                                                    name="item_details"
                                                    placeholder="Item Details"
                                                    value={newItem.item_details}
                                                    onChange={handleNewItemChange}
                                                    fullWidth
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">Select</MenuItem>
                                                    {storeItems.map((unit) => (
                                                    <MenuItem key={unit.value} value={unit.value}>
                                                        {unit.label}
                                                    </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>

                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="Quantity"
                                                    value={newItem.quantity}
                                                    onChange={handleNewItemChange}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Select 
                                                    type="number"
                                                    name="measurement"
                                                    placeholder="Quantity"
                                                    value={newItem.measurement}
                                                    onChange={handleNewItemChange}
                                                    fullWidth
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">Select</MenuItem>
                                                    {units.map((unit) => (
                                                    <MenuItem key={unit.value} value={unit.value}>
                                                        {unit.label}
                                                    </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>

                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    name="rate"
                                                    placeholder="Rate"
                                                    className="bill-inputfield"
                                                    value={newItem.rate}
                                                    onChange={handleNewItemChange}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
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
                                                <MenuItem value="">Select VAT</MenuItem>
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
                        <Button type="button" color="secondary" variant="contained" sx={{margin:'20px'}} onClick={addItem}>Add Item</Button>

                        <Box display={'flex'} flexDirection={'column'} gap={'15px'} m={'10px'} textAlign={'right'} fontWeight={'bold'}>
                                <Typography fontWeight={'bold'}>
                                        Sub Total Amount:{" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat('en-KE', { style: 'currency', currency:"KES" }).format(subTotalAmount)
                                        ) : (
                                            subTotalAmount
                                        )}
                                </Typography>

                                <Typography fontWeight={'bold'}>VAT Amount: {" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat('en-KE', { style: 'currency', currency: "KES" }).format(vatAmount)
                                        ) : (
                                            vatAmount
                                        )}
                                </Typography>

                                <Typography fontWeight={'bold'}>Total Amount: {" "}
                                    { formData.currency ? (
                                        new Intl.NumberFormat('en-KE', {currency:"KES", style:'currency'}).format(totalAmount)
                                    ):(
                                        totalAmount
                                    )}
                                </Typography>
                            </Box>
                        
                        </Box>

                        <Button type="submit" color="secondary" variant="contained">Save</Button>
                    </form>
                </Box>
            </Box> 

            {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>BILLS</Typography>
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
                                    <Typography>ID: {item.id}</Typography>
                                    <Typography>Customer Name: {item.customer_name}</Typography>
                                    <Typography>Customer Email: {item.customer_email}</Typography>
                                    <Typography>Customer Phone: {item.customer_phone}</Typography>
                                    <Typography>Payment Terms: {item.credit_date}</Typography>
                                    <Typography>Amount: {new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.totalAmount)}</Typography>
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
                      CREDIT NOTES
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={creditnotes}
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

export default CreditNote;
