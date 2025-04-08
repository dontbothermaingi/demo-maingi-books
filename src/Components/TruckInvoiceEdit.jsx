import { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, FormControl, Select, MenuItem, TextField, RadioGroup, FormControlLabel, TableContainer, Paper, Table, TableHead, TableRow, TableCell, ListSubheader, Divider} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Radio } from "@mui/material";
import { AddOutlined, DeleteForever } from "@mui/icons-material";

function TruckInvoiceEdit() {
    const [isVatInclusive, setIsVatInclusive] = useState(true); // true for inclusive, false for exclusive
    const [customers, setCustomers] = useState([]);
    const [invoice, setInvoice] = useState([])
    const [vatAmount, setVatAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [trucks, setTrucks] = useState([])
    const {invoiceId} = useParams()
    const [originalInvoiceAmount, setOriginalInvoiceAmount] = useState(0);
    const token = localStorage.getItem('access_token')
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        invoice_id:"",
        customer_email: "",
        invoice_number: "",
        order_number: "",
        invoice_date: "",
        invoice_terms: "",
        category_id:"",
        vendor_pin: "",
        type_vat:"",
        due_date: "",
        consignee: "",
        sales_person: "",
        amount_paid:"",
        amount_owed:"",
        category_name:"",
        payment_made:0,
        invoice_total:0,
        status:"",
        currency:"",
        previous_category_name:"",
        original_amount:"",
        items: [],
        terms_conditions: "",
        customer_amount:"",
        customer_id:"",
    });

    const [newItem, setNewItem] = useState([
        {
            item_details: "",
            description: "",
            quantity: 0,
            vat: 0,
            sub_total:"",
            rate_vat: 0,
            rate: 0,
            amount: 0,
            truck_id: "",
        }
    ]);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`https://demo-server-757m.onrender.com/invoices/${invoiceId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch invoice");
                }
    
                const data = await response.json();
                
                setInvoice(data);
                setOriginalInvoiceAmount(data.items ? data.items.reduce((total, item) => total + item.amount, 0) : 0);
                setFormData({
                    customer_name: data.customer_name,
                    customer_phone: data.customer_phone,
                    customer_email: data.customer_email,
                    invoice_number: data.invoice_number,
                    order_number: data.order_number,
                    invoice_date: data.invoice_date,
                    invoice_terms: data.invoice_terms,
                    vendor_pin: data.vendor_pin,
                    type_vat: data.type_vat,
                    due_date: data.due_date,
                    sales_person: data.sales_person,
                    amount_paid: data.amount_paid,
                    amount_owed: data.amount_owed,
                    category_name: data.category_name,
                    payment_made: data.payment_made,
                    status: data.status,
                    currency: data.currency,
                    category_id: data.category_id,
                    customer_id: data.customer_id,
                    invoice_id: data.id,
                });
    
                setIsVatInclusive(data.type_vat !== "Exclusive VAT");

                setNewItem(data.items);
    
            } catch (error) {
                console.error("Error fetching invoice:", error);
            }
        };
    
        fetchInvoice();
    }, [invoiceId, token]);
    

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/customers',{
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

        // Update values based on their name
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
        
        // Update truck id's
        if(name === 'item_details'){
            const matchingTruck = trucks.find(item => item.truck_number === value);
            values[index].truck_id = matchingTruck ? matchingTruck.id : "";
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
        

    function handleNewInputField() {
        setNewItem([ ...newItem, { item_details: "", description: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total:0, amount: 0 } ]);
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
    

    function handleSubmit(event) {
        event.preventDefault();
    
        const calculateInvoiceTotal = () => {
            return formData.items.reduce((total, item) => total + item.amount, 0);
        }
        
    
        const allData = {
            ...formData,
            amount_paid: invoice.amount_paid,
            amount_owed: invoice.amount_owed + (parseFloat(calculateInvoiceTotal()) - parseFloat(originalInvoiceAmount)),
            status: invoice.status,
            invoice_total: calculateInvoiceTotal(),
            customer_amount: parseFloat(calculateInvoiceTotal()) - parseFloat(originalInvoiceAmount),
            previous_category_name: invoice.category_name,
            original_amount:originalInvoiceAmount,
        };
    
        fetch(`https://demo-server-757m.onrender.com/invoices/${invoiceId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
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
                category_name:"",
                currency:"",
                description: "",
                amount_paid:"",
                amount_owed:"",
                items: [],
                terms_conditions: "",
            });

        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
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

    const handleCustomBill = () => {
        navigate(`/invoice-control`);
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
                       color="secondary"
                       variant="contained"
                       onClick={()=> handleCustomBill()}
                       sx={{margin:'30px', width:'150px'}}
                    >
                        <Typography fontWeight={'bold'}>BACK</Typography>
                    </Button>

                <Box>
                    <Typography fontSize={'30px'} fontWeight={'bold'} textAlign={'center'} marginTop={'20px'}>EDIT INVOICE</Typography>

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
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <TextField
                                type="text"
                                name="invoice_number"
                                label="Invoice Number"
                                className="bill-inputfield"
                                value={formData.invoice_number}
                                onChange={handleChange}
                                readOnly
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <FormControl>
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
                            </FormControl>

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

                            <Typography fontSize={'25px'} fontWeight={'bold'}>Items</Typography>
                            <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', marginTop: 2 }}>
                                <Table aria-label="Invoice Table" sx={{ minWidth: isMobile ? 900 : 'auto' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Item</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 200 }}><Typography fontWeight="bold">Description</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">Quantity</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">Rate</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">Sub Total</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">VAT</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">VAT Amount</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">Total Amount</Typography></TableCell>
                                            {/* <TableCell sx={{ minWidth: 50 }}><Typography fontWeight="bold">Truck Id</Typography></TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    
                                </Table>
                            </TableContainer>

                            <Box mt={'20px'}>
                                {newItem.map((item, index) => (
                                    <Box key={index} display={'flex'} gap={'20px'} mb={'20px'} alignItems={'center'}>

                                        {trucks.length > 0 ? (
                                            <Select name="item_details" value={item.item_details} onChange={(e) => handleNewItemChange(e, index)} fullWidth displayEmpty>
                                            <MenuItem value="">Select Item</MenuItem>
                                                {trucks.map((truck, index) => (
                                                    <MenuItem key={index} value={truck.truck_number}>{truck.truck_number}</MenuItem>
                                                ))}
                                            </Select>
                                        ):(
                                            <p>Loading trucks...</p>
                                        )}
                                         

                                        <TextField
                                            name="description"
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => handleNewItemChange(e, index)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{minWidth:'400px'}}
                                            multiline
                                            minRows={4}  // Initial number of rows
                                            maxRows={20}   // Maximum number of rows
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

                                        {/* <TextField
                                            placeholder="Truck Id"
                                            name="truck_id"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={item.truck_id}
                                            onChange={(e) => handleNewItemChange(e, index)}
                                            InputProps={{ readOnly: true }}
                                        /> */}

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

                            <Button variant="contained" color="secondary" type="submit" sx={{width:'150px'}}><Typography fontWeight={'bold'}>SAVE</Typography></Button>

                        </form>
                    </Box>
                </Box>
            </Box>
            
        </Box>
    );
}

export default TruckInvoiceEdit;
