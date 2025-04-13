import { useEffect, useState } from "react";
import { Box, Button, Typography,IconButton, FormControl, MenuItem, Select, TextField, Divider, ListSubheader, Radio, RadioGroup, FormControlLabel, TableContainer, Table, TableHead, TableRow, TableCell, Snackbar, Alert, Dialog, DialogContent, CircularProgress} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { AddOutlined, DeleteForever } from "@mui/icons-material";

function BillEdit() {
    const [bills, setBills] = useState(null);
    const { billId } = useParams();
    const token = localStorage.getItem('access_token')
    const [errorMessage, setErrorMessage] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [loading, setLoading] = useState(false);
    const [vatAmount, setVatAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [openDialog, setOpenDialog] = useState(false)
    const [vendors, setVendors] = useState([]);
    const [originalAmount, setOriginalAmount] = useState([]);
    const [isVatInclusive, setIsVatInclusive] = useState(true); // true for inclusive, false for exclusive
    const [formData, setFormData] = useState({
        vendor_name: "",
        vendor_phone: "",
        vendor_email: "",
        vendor_pin:"",
        bill_number: "",
        account_name: "",
        order_number: "",
        bill_date: "",
        due_date: "",
        category_name:"",
        payment_terms: "",
        amount_paid:0,
        currency:"",
        amount_owed:0,
        bill_total:"",
        original_amount:"",
        vendor_amount:"",
        status:"",
        previous_category_name:"",
        type_vat: "Inclusive VAT",
        items: [],
    });

    const [newItem, setNewItem] = useState([{
        item_details: "",
        quantity: 0,
        type_vat:"",
        vat: 0,
        sub_total: 0,
        rate_vat: 0,
        rate: 0,
        amount: 0,
    }]);

    useEffect(() => {
        fetch(`https://demo-server-757m.onrender.com/newbills/${billId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {

                setTimeout(() => {
                    setNewItem(data.items)
                },500)

                setBills(data);
                setOriginalAmount(data.items ? data.items.reduce((total,bill) => bill.amount + total, 0) : 0)

                setFormData({
                    vendor_name: data.vendor_name,
                    vendor_phone: data.vendor_phone,
                    vendor_email: data.vendor_email,
                    vendor_pin: data.vendor_pin,
                    bill_number: data.bill_number,
                    account_name: data.account_name,
                    order_number: data.order_number,
                    bill_date: data.bill_date,
                    due_date: data.due_date,
                    category_name: data.category_name,
                    payment_terms: data.payment_terms,
                    amount_paid: data.amount_paid,
                    currency: data.currency,
                    amount_owed: data.amount_owed,
                    status: data.status,
                    type_vat: data.type_vat,
                    items: data.items,
                })

                setIsVatInclusive(data.type_vat !== 'Exclusive VAT')

            });
    }, [token, originalAmount,billId]);
    

    useEffect(() => {
        if (formData.payment_terms && formData.bill_date) {
            calculateDueDate(formData.payment_terms, formData.bill_date);
        }
    }, [formData.payment_terms, formData.bill_date]);

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/vendors',{
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
        const selectedVendor = vendors.find(vendor => vendor.vendor_name === event.target.value);
        setFormData(prevFormData => ({
            ...prevFormData,
            vendor_name: selectedVendor.vendor_name,
            vendor_phone: selectedVendor.vendor_phone,
            vendor_email: selectedVendor.vendor_email,
            vendor_pin: selectedVendor.kra_pin,
            currency: selectedVendor.currency,
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
        const values = [...newItem];

        // Update based on the name of the field
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

        setNewItem(values)

        setVatAmount(values.reduce((total, item) => total + item.rate_vat, 0))
        setTotalAmount(values.reduce((total, item) => total + item.amount, 0))
        setSubTotalAmount(values.reduce((total, item) => total + item.sub_total, 0))

        setFormData(prevFormData => ({
            ...prevFormData,
            items: values
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

    function hanldleNewInputField() {
        setNewItem([ ...newItem, { item_details: "", description: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total:0, amount: 0 }]);
    }

    function handleDeleteInputField(index) {
        const updatedItems = newItem.filter((_,i) => i !== index)

        setNewItem(updatedItems);
        
        setFormData(prevFormData => ({
            ...prevFormData,
            items: updatedItems
        }))
    } 
    
    function handleSubmit(event) {
        event.preventDefault();


        setLoading(true);
        setOpenDialog(true);

        const calculateInvoiceTotal = () => {
            return formData.items.reduce((total, item) => total + item.amount, 0);
        }
    
        fetch(`https://demo-server-757m.onrender.com/newbills/${billId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify({
                ...formData, 
                bill_number: bills.bill_number,
                status: formData.status,
                amount_owed:formData.amount_owed,
                amount_paid:formData.amount_paid,
                bill_total:calculateInvoiceTotal(),
                original_amount: originalAmount,
                vendor_amount:parseFloat(calculateInvoiceTotal()) - parseFloat(originalAmount),
                previous_category_name:bills.category_name,
            })
        })
            .then(response => response.json())
            .then(data => {

                console.log('Submitted bill:', data);
                setFormData({
                    vendor_name: "",
                    vendor_phone: "",
                    vendor_email: "",
                    bill_number: "",
                    order_number: "",
                    category_name:"",
                    currency:"",
                    bill_date: "",
                    due_date: "",
                    payment_terms: "",
                    items: [],
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
                setOpenSnackbar(true)
                setErrorMessage("Bill updated successfully!")
                navigate(`/newbills/${billId}`)
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                setOpenSnackbar(true)
                setErrorMessage("Failed to save the bill. Please try again.")
            });
    }


    function handleCustomBill() {
        navigate('/bill-control');
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
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

    return (
        <Box>

             <Box>
                <Button
                  type="button"
                  onClick={()=> handleCustomBill()}
                  variant="contained"
                  color="secondary"
                  sx={{margin:'30px'}}

                >
                    BACK
                </Button>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogContent sx={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <CircularProgress sx={{fontSize:'10px'}}/>
                        <Typography fontFamily={"GT Bold"}>Updating...</Typography>
                    </DialogContent>
                </Dialog>
                                
                <Snackbar
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={handleCloseSnackbar} 
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes('Please') ? "error" : "success"} sx={{ width: '100%' }}>{errorMessage}</Alert>
                </Snackbar>

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
                      padding: '5px', // Adjust padding for smaller screens
                    },
                    '@media (min-width: 600px)': {
                      padding: '10px', // Keep padding for medium screens and above
                    },
                  }}
                
                >
                    <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>EDIT BILL</Typography>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: '30px' }}>

                        <FormControl>
                        <Typography fontWeight={'bold'}>Vendor Name</Typography>
                        <Select name="vendor_name" value={formData.vendor_name} onChange={handleSelectVendor} sx={{mb:'20px'}}>
                            <MenuItem value="">Select Vendor</MenuItem>
                            {vendors.map((vendor, index) => (
                                <MenuItem key={index} value={vendor.vendor_name}>{vendor.vendor_name}</MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        

                        <TextField
                            type="text"
                            name="bill_number"
                            label="Bill Number"
                            value={formData.bill_number}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="vendor_email"
                            label="Vendor Email"
                            value={formData.vendor_email}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />


                        <TextField
                            type="text"
                            name="vendor_phone"
                            label="Vendor Phone"
                            value={formData.vendor_phone}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="vendor_pin"
                            label="Vendor Pin"
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
                            inputProps={{readOnly:true}}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <Typography fontWeight={'bold'}>STATUS</Typography>
                        <TextField
                            type="text"
                            name="status"
                            label="Status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <Typography fontWeight={'bold'}>AMOUNT PAID</Typography>
                        <TextField
                            type="number"
                            name="amount_paid"
                            label="Amount Paid"
                            value={formData.amount_paid}
                            onChange={handleChange}
                            required
                            variant='outlined'
                            sx={{mb:'20px'}}
                        />

                        <Typography fontWeight={'bold'}>AMOUNT PAID</Typography>
                        <TextField
                            type="number"
                            name="amount_owed"
                            label="Amount Owed"
                            value={formData.amount_owed}
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
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Rate</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 120 }}><Typography fontWeight="bold">Sub Total</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 80 }}><Typography fontWeight="bold">VAT</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 120 }}><Typography fontWeight="bold">VAT Amount</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 120 }}><Typography fontWeight="bold">Total Amount</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 30 }}><Typography fontWeight="bold">Action</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>

                            <Box mt={'10px'}>
                                {newItem.map((item, index) => (
                                    <Box key={index} display={'flex'} gap={'20px'} alignItems={'center'} mb={'20px'}>
                                        <TextField
                                            name="item_details"
                                            placeholder="Item Details"
                                            value={item.item_details}
                                            onChange={(e) => handleNewItemChange(e, index)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />

                                        <TextField
                                            type="number"
                                            name="quantity"
                                            placeholder="Quantity"
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

                                <Button onClick={hanldleNewInputField} variant="contained" style={{backgroundColor:'grey', color:'white', marginTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'20px'}}>
                                        <AddOutlined sx={{color:'white', fontSize:'19px'}}/>
                                        <Typography fontWeight={'bold'} fontSize={'12px'}>Add new row</Typography>
                                </Button>

                            </Box> 
                            
                            <Box display={'flex'} flexDirection={'column'} gap={'15px'} m={'10px'} textAlign={'right'} fontWeight={'bold'}>
                                <Typography fontFamily={"GT Regular"} fontSize={'20px'} fontWeight={'bold'}>
                                        Sub Total Amount:{" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat(currencyLocaleMap[formData.currency] || 'en-KE', { style: 'currency', currency: formData.currency }).format(subTotalAmount)
                                        ) : (
                                            new Intl.NumberFormat().format(subTotalAmount)
                                        )}
                                </Typography>

                                <Typography fontFamily={"GT Regular"} fontSize={'20px'} fontWeight={'bold'}>VAT Amount: {" "}
                                        {formData.currency ? (
                                            new Intl.NumberFormat(currencyLocaleMap[formData.currency] || 'en-KE', { style: 'currency', currency: formData.currency }).format(vatAmount)
                                        ) : (
                                            new Intl.NumberFormat().format(vatAmount)
                                        )}
                                </Typography>

                                <Typography fontFamily={"GT Regular"} fontSize={'20px'} fontWeight={'bold'}>Total Amount: {" "}
                                    { formData.currency ? (
                                        new Intl.NumberFormat(currencyLocaleMap[formData.currency] || 'en-KE', {currency:formData.currency, style:'currency'}).format(totalAmount)
                                    ):(
                                        new Intl.NumberFormat().format(totalAmount)
                                    )}
                                </Typography>
                            </Box>
                        
                        </Box>

                        <Button disabled={loading} variant="contained" color="secondary" type="submit" sx={{width:'150px'}}><Typography fontFamily={"GT Bold"}>{loading ? "Updating..." : "Update"}</Typography></Button>
                      
                    </form>
                </Box>
            </Box> 

        </Box>
    );
}

export default BillEdit;
