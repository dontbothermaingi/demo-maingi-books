import { useEffect, useState } from "react";
import { Box, Typography, Button,IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Invoice.css'

function InventoryInvoice() {
    const [invoices, setInvoices] = useState([]);
    const [selectedItem, setSelectedItem] = useState([])
    const [openDialog, setOpenDialog] = useState(false);
    const [isVatInclusive, setIsVatInclusive] = useState(true); // true for inclusive, false for exclusive
    const [customers, setCustomers] = useState([]);
    const [storeItems, setStoreItems] = useState([]);
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
        fetch('https://db-demo-u07o.onrender.com/invoices')
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setInvoices(invoiceTotal);
                generateInvoiceNumber(data);
            });
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/stockitems')
            .then(response => response.json())
            .then((data) => setStoreItems(data));
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/customers')
            .then(response => response.json())
            .then((data) => setCustomers(data));
    }, []);

    useEffect(() => {
        if (formData.invoice_terms && formData.invoice_date) {
            calculateDueDate(formData.invoice_terms, formData.invoice_date);
        }
    }, [formData.invoice_terms, formData.invoice_date]);

    function generateInvoiceNumber(invoices) {
        if (invoices.length === 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                invoice_number: 'INV00000001'
            }));
            return;
        }

        const lastInvoiceNumber = invoices[invoices.length - 1].invoice_number;
        const nextInvoiceNumber = 'INV' + String(parseInt(lastInvoiceNumber.slice(3)) + 1).padStart(8, '0');

        setFormData(prevFormData => ({
            ...prevFormData,
            invoice_number: nextInvoiceNumber
        }));
    }

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
        };
    
        // Submit the invoice
        fetch('https://db-demo-u07o.onrender.com/inventoryinvoices', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(allData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {

            fetch('https://db-demo-u07o.onrender.com/invoices')
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setInvoices(invoiceTotal);
                generateInvoiceNumber(data);
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
                        type_name:"",
                        category_name:"",
                        subcategory_name:"",
                        description: "",
                        items: [],
                        terms_conditions: "",
                    });
                    // Generate new invoice number
                    generateInvoiceNumber([...invoices, data]);
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

    return (
        <div>
            <div className="invoice-content">
                    <button
                    type="button"
                    className="button"
                    onClick={()=> handleCustomBill()}
                    >
                        BACK
                    </button>
                <div>
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
                    <h2 className="h2">NEW INVENTORY INVOICE</h2>
                    <form className="invoice-form" onSubmit={handleSubmit}>

                    <div className="bill-input">
                        <label>Customer Name</label>
                        <select name="customer_name" className="bill-inputfield" value={formData.customer_name} onChange={handleSelectCustomer}>
                            <option value="">Select Customer</option>
                            {customers.map((customer, index) => (
                                <option key={index} value={customer.customer_name}>{customer.customer_name}</option>
                            ))}
                             <option value="new_customer">Create New Customer</option>
                        </select>
                    </div>

                    <div className="bill-input">
                        <label>Customer Phone</label>
                        <input
                            type="text"
                            name="customer_phone"
                            placeholder="Customer Phone"
                            className="bill-inputfield"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Customer Email</label>
                        <input
                            type="text"
                            name="customer_email"
                            placeholder="Customer Email"
                            className="bill-inputfield"
                            value={formData.customer_email}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Customer Pin</label>
                        <input
                            type="text"
                            name="customer_pin"
                            placeholder="Customer Pin"
                            className="bill-inputfield"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Currency</label>
                        <input
                            type="text"
                            name="currency"
                            placeholder="Currency"
                            className="bill-inputfield"
                            value={formData.currency}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Invoice Number</label>
                        <input
                            type="text"
                            name="invoice_number"
                            placeholder="Invoice Number"
                            className="bill-inputfield"
                            value={formData.invoice_number}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>


                    <div className="bill-input">
                            <label>Account</label>
                            <select name="category_name" className="bill-inputfield" value={formData.category_name} onChange={handleChange}>
                                <option value=''>Select Account</option>

                                <optgroup label="Fixed Assets">
                                    <option value='Furniture'>Furniture</option>
                                    <option value='Vehicles'>Vehicles</option>
                                    <option value='Machinery and Equipment'>Machinery and Equipment</option>
                                    <option value='Computer Hardware and Software'>Computer Hardware and Software</option>
                                    <option value='Leasehold Assets'>Leasehold Assets</option>
                                    <option value='Land'>Land</option>
                                </optgroup>

                                <optgroup label="Current Assets">
                                    <option value='Cash at Bank'>Cash at Bank</option>
                                    <option value='Cash at Hand'>Cash at Hand</option>
                                    <option value='Debtors'>Debtors</option>
                                    <option value='Stock'>Stock</option>
                                    <option value='Office Supplies'>Office Supplies</option>
                                    <option value='Work in Progress Goods'>Work in Progress Goods</option>
                                    <option value='Finished Goods'>Finished Goods</option>
                                    <option value='Merchandise Inventory'>Merchandise Inventory</option>
                                    <option value='Prepaid Rent'>Prepaid Rent</option>
                                    <option value='Prepaid Insurance'>Prepaid Insurance</option>
                                    <option value='Prepaid Taxes'>Prepaid Taxes</option>
                                    <option value='Accrued Revenue'>Accrued Revenue</option>
                                </optgroup>

                                <optgroup label="Long Term Liabilities">
                                    <option value='Long Term Loans'>Long Term Loans</option>
                                </optgroup>

                                <optgroup label="Short Term Liabilities">
                                    <option value='Accrued Expenses'>Accrued Expenses</option>
                                    <option value='Unearned Revenue'>Unearned Revenue</option>
                                    <option value='Taxes Payable'>Taxes Payable</option>
                                    <option value='Office Supplies'>Office Supplies</option>
                                    <option value='Unpaid Rent'>Unpaid Rent</option>
                                    <option value='Unpaid Wages'>Unpaid Wages</option>
                                    <option value='Creditor'>Creditor</option>
                                </optgroup>

                                <optgroup label="Expenses">
                                    <option value='Advertising and Marketing'>Advertising and Marketing</option>
                                    <option value='Automobile Expense'>Automobile Expense</option>
                                    <option value='Bad Debt'>Bad Debt</option>
                                    <option value='Bank Fees Charges'>Bank Fees Charges</option>
                                    <option value='Consultant Expense'>Consultant Expense</option>
                                    <option value='Depreciation Expense'>Depreciation Expense</option>
                                    <option value='IT and Internet Expense'>IT and Internet Expense</option>
                                    <option value='Janitorial Expense'>Janitorial Expense</option>
                                    <option value='Lodging'>Lodging</option>
                                    <option value='Postage'>Postage</option>
                                    <option value='Printing and Stationery'>Printing and Stationery</option>
                                    <option value='Purchase Discounts'>Purchase Discounts</option>
                                    <option value='Rent Expense'>Rent Expense</option>
                                    <option value='Salaries and Employee Wages'>Salaries and Employee Wages</option>
                                    <option value='Telephone Expense'>Telephone Expense</option>
                                    <option value='Travel Expense'>Travel Expense</option>
                                    <option value='Repairs and Maintenance'>Repairs and Maintenance</option>
                                    <option value='Meals and Entertainment'>Meals and Entertainment</option>
                                    <option value='New Tyres'>New Tyres</option>
                                    <option value='Retread Tyres'>Retread Tyres</option>
                                    <option value='Spare Parts'>Spare Parts</option>
                                </optgroup>

                                <optgroup label="Income">
                                    <option value='Discount'>Discount</option>
                                    <option value='General Income'>General Income</option>
                                    <option value='Interest Income'>Interest Income</option>
                                    <option value='Inventory Sales'>Inventory Sales</option>
                                    <option value='Late Fee Income'>Late Fee Income</option>
                                    <option value='Other Charges'>Other Charges</option>
                                    <option value='Other Sales'>Other Sales</option>
                                    <option value='Shipping Charge'>Shipping Charge</option>
                                    <option value='Transport Sales'>Transport Sales</option>

                                </optgroup>

                                <option value='new_account'>Create New Account</option>
                            </select>
                    </div>

                    <div className="bill-input">
                        <label>Invoice Date</label>
                        <input
                            type="date"
                            name="invoice_date"
                            placeholder="Invoice Date"
                            className="input"
                            value={formData.invoice_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bill-input">
                        <label>Invoice Terms</label>
                        {/* <select
                            value={formData.invoice_terms}
                            className="bill-inputfield"
                            name="invoice_terms"
                            onChange={handleChange}
                        >
                            <option value="">Select Invoice Term</option>
                            <option value="Cash">Cash</option>
                            <option value="15 days">15 days</option>
                            <option value="30 days">30 days</option>
                            <option value="45 days">45 days</option>
                            <option value="60 days">60 days</option>
                        </select> */}
                        <input
                            type="text"
                            name="invoice_terms"
                            placeholder="Invoice Terms"
                            className="bill-inputfield"
                            value={formData.invoice_terms}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Due Date</label>
                        <input
                            type="date"
                            name="due_date"
                            placeholder="Due Date"
                            className="bill-inputfield"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Sales Person</label>
                        <input
                            type="text"
                            name="sales_person"
                            placeholder="Sales Person"
                            className="bill-inputfield"
                            value={formData.sales_person}
                            onChange={handleChange}
                            required
                        />
                        </div>
                        <div className="vat-options">
                                <div className="vat-option">
                                    <input
                                        type="radio"
                                        id="inclusiveVat"
                                        name="vat_type"
                                        value="Inclusive VAT"
                                        checked={isVatInclusive}
                                        onChange={handleToggleVat}
                                    />
                                    <label htmlFor="inclusiveVat">Inclusive VAT</label>
                                </div>
                                <div className="vat-option">
                                    <input
                                        type="radio"
                                        id="exclusiveVat"
                                        name="vat_type"
                                        value="Exclusive VAT"
                                        checked={!isVatInclusive}
                                        onChange={handleToggleVat}
                                    />
                                    <label htmlFor="exclusiveVat">Exclusive VAT</label>
                                </div>
                            </div>


                    {newItem.item_details ? <h2 className="OWE">THERE ARE {new Intl.NumberFormat().format(selectedItem.quantity)} {selectedItem.item_details}'s LEFT.</h2> : ""}

        
                        <label className="label">Items</label>

                        <div className="bill-input">
                        
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Item Details</th>
                                    <th>Quantity</th>
                                    <th>Rate</th>
                                    <th>Sub Total</th>
                                    <th>VAT</th>
                                    <th>VAT Amount</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.item_details}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.rate}</td>
                                        <td>{item.sub_total}</td>
                                        <td>{item.vat}</td>
                                        <td>{item.rate_vat}</td>
                                        <td>{item.amount}</td>
                                        <td>
                                            <IconButton 
                                                color="error"
                                                onClick={() => handleDeleteItem(index)}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}

                                <tr>
                                    <td>
                                        <select value={newItem.item_details} name="item_details" className="bill-inputfield" onChange={handleSelectRemoveItem}>
                                            <option value="">Select Item</option>
                                            {storeItems.map((item, index) => (
                                                    <option key={{index}} value={item.item_details}>{item.item_details}</option>
                                                
                                            ))}
                                        </select>
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            name="quantity"
                                            placeholder="Quantity"
                                            className="bill-inputfield"
                                            value={newItem.quantity}
                                            onChange={handleNewItemChange}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="integer"
                                            name="rate"
                                            placeholder="Rate"
                                            className="bill-inputfield"
                                            value={newItem.rate}
                                            onChange={handleNewItemChange}
                                        />
                                    </td>
                                    <td><input value={newItem.sub_total}/></td>
                                    <td>
                                    <select value={newItem.vat} className="bill-input" name="vat" onChange={handleNewItemChange}>
                                                <option value=''>Select vat</option>
                                                <option value='16'>16%</option>
                                                <option value='0'> 0% </option>
                                        </select>
                                    </td>

                                    <td><input value={newItem.rate_vat}/></td>

                                    <td><input value={newItem.amount}/></td>
                                </tr>
                            </tbody>
                        </table>

                        </div>
                        
                        <button type="button" className="button" onClick={addInventoryItem}>Add Item</button>
                        <h3 className="total-amount">Sub Total Amount: {subTotalAmount.toLocaleString()}</h3>
                        <h3 className="total-amount">VAT Amount: {vatAmount.toLocaleString()}</h3>
                        <h3 className="total-amount">Total Amount: {totalAmount.toLocaleString()}</h3>
                        <button type="submit" className="button">Save and Send</button>
                    </form>
                </div>
            </div>
        
            <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    INVOICES
                </Typography>
                <Box
                    m="40px 0 0 0"
                    height="75vh"
                    sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        // fontSize: "16px",
                    },
                    "& .name-column--cell": {
                        // color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        // fontSize: "16px",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        // backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        // backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        // color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        // color: `${colors.grey[100]} !important`,
                    },
                    }}
                >
                    <DataGrid
                    rows={invoices}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
            </Box>


        </div>
    );
}

export default InventoryInvoice;
