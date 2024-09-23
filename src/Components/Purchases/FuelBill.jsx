import { useEffect, useState } from "react";
import { Box, Button, Typography,IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Bill.css';
import { useNavigate } from "react-router-dom";

function FuelBill() {
    const [bills, setBills] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [pumps,setPumps] = useState([]);
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
        amount_owed:0,
        status:"",
        type_vat: "Inclusive VAT",
        items: [],
    });

    const paymentNumber = bills.length + 1;

    const [newItem, setNewItem] = useState({
        item_details: "",
        quantity: 0,
        type_vat:"",
        reading:"",
        vat: 0,
        sub_total: 0,
        rate_vat: 0,
        rate: 0,
        amount: 0,
    });

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/pumpnames')
        .then(response => response.json())
        .then((data) => {
            setPumps(data)
        })
    },[])

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/newbills')
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setBills(invoiceTotal);
            });
    }, []);
    
    
    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
    }

    useEffect(() => {
        if (formData.payment_terms && formData.bill_date) {
            calculateDueDate(formData.payment_terms, formData.bill_date);
        }
    }, [formData.payment_terms, formData.bill_date]);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/vendors')
            .then(response => response.json())
            .then(data => setVendors(data))
            .catch(error => console.error('Error fetching vendors:', error));
    }, []);

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
        setNewItem({ item_details: "", description: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total: 0 ,amount: 0 });
    }
      
    
    function handleSubmit(event) {
        event.preventDefault();

        const calculateInvoiceTotal = () => {
            return formData.items.reduce((total, item) => total + item.amount, 0);
        }
    
        fetch('https://db-demo-u07o.onrender.com/fuelbills', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData, 
                bill_number: paymentNumber,
                payment_made: 0,
                status: "UNPAID",
                amount_paid: 0,
                amount_owed: calculateInvoiceTotal(),
            })
        })
        .then(response => response.json())
        .then(data => {

            fetch('https://db-demo-u07o.onrender.com/newbills')
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setBills(invoiceTotal);
            });


            console.log('Submitted bill:', data);
            setFormData({
                vendor_name: "",
                vendor_phone: "",
                vendor_email: "",
                bill_number: "",
                order_number: "",
                category_name:"",
                bill_date: "",
                due_date: "",
                payment_terms: "",
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

    function handleCustomBill() {
        navigate('/fuel-bill-control');
    }
    
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
          field: "vendor_name",
          headerName: "Vendor Name",
          flex: 0.5,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
          field: "bill_number",
          headerName: "Bill Number",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
          field: "bill_date",
          headerName: "Bill Date",
          flex: 0.4,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
          field: "payment_terms",
          headerName: "Payment Terms",
          flex: 0.5,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
            headerName: "Status",
            flex: 0.5,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.bill_number)}
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
            flex: 0.5,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.bill_number)}
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
            field: "due_date",
            headerName: "Due Date",
            flex: 0.5,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.bill_number)}
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

             <div className="bill-content">
                <button
                  type="button"
                  className="button"
                  onClick={()=> handleCustomBill()}
                >
                    BACK
                </button>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Payment Received?</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">Have you paid the vendor?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlePaymentReceived} color="primary">Yes</Button>
                            <Button onClick={handleCloseDialog} color="secondary">No</Button>
                        </DialogActions>
                </Dialog>

                <div>
                    <h2 className="h2">NEW FUEL BILL</h2>
                    <form className="bill-form" onSubmit={handleSubmit}>

                        <div className="bill-input">
                        <label>Vendor Name</label>
                        <select name="vendor_name" className="bill-inputfield" value={formData.vendor_name} onChange={handleSelectVendor}>
                            <option value="">Select Vendor</option>
                            {vendors.map((vendor, index) => (
                                <option key={index}>{vendor.vendor_name}</option>
                            ))}
                        </select>
                        </div>
                        

                        <div className="bill-input">
                        <label>Bill Number:</label>
                        <input
                            type="text"
                            name="bill_number"
                            placeholder="Bill Number"
                            className="bill-inputfield"
                            value={paymentNumber}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Vendor Email</label>
                        <input
                            type="text"
                            name="vendor_email"
                            placeholder="Vendor Email"
                            className="bill-input"
                            value={formData.vendor_email}
                            onChange={handleChange}
                            required
                        />
                        </div>


                        <div className="bill-input">
                        <label>Vendor Phone</label>
                        <input
                            type="text"
                            name="vendor_phone"
                            placeholder="Vendor Phone"
                            className="bill-input"
                            value={formData.vendor_phone}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Vendor Pin</label>
                        <input
                            type="text"
                            name="vendor_pin"
                            placeholder="Vendor Pin"
                            className="bill-input"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Currency</label>
                        <input
                            type="text"
                            name="currency"
                            placeholder="Currency"
                            className="bill-input"
                            value={formData.currency}
                            onChange={handleChange}
                            required
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
                                    <option value='Diesel Expense'>Diesel Expense</option>
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
                                    <option value='Late Fee Income'>Late Fee Income</option>
                                    <option value='Other Charges'>Other Charges</option>
                                    <option value='Sales'>Sales</option>
                                    <option value='Shipping Charge'>Shipping Charge</option>
                                </optgroup>

                                <option value='new_account'>Create New Account</option>
                            </select>
                        </div>

                        <div className="bill-input">
                        <label>Bill Date</label>
                        <input
                            type="date"
                            name="bill_date"
                            placeholder="Bill Date"
                            className="bill-input"
                            value={formData.bill_date}
                            onChange={handleChange}
                            required
                        />
                        </div>
                        
                        <div className="bill-input">
                        <label>Payment terms</label>
                        <select
                            value={formData.payment_terms}
                            className="bill-input"
                            name="payment_terms"
                            onChange={handleChange}
                        >
                            <option value="">Select Payment Term</option>
                            <option value="Cash">Cash</option>
                            <option value="15 days">15 days</option>
                            <option value="30 days">30 days</option>
                            <option value="45 days">45 days</option>
                            <option value="60 days">60 days</option>
                        </select>
                        </div>

                        <div className="bill-input">
                        <label>Due Date</label>
                        <input
                            type="date"
                            name="due_date"
                            placeholder="Due Date"
                            className="bill-input"
                            value={formData.due_date}
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


                        <div className="bill-input">
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Pump Name</th>
                                    <th>Litres</th>
                                    <th>Rate</th>
                                    <th>Sub Total</th>
                                    <th>VAT</th>
                                    <th>VAT Amount</th>
                                    <th>Total</th>
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
                                        <td>{item.amount.toLocaleString()}</td>
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
                                    <select name="item_details" value={newItem.item_details} className="bill-inputfield" onChange={handleNewItemChange}>
                                            <option value="">Select Pump</option>
                                            {pumps.map((pump, index) => (
                                                    <option key={index} value={pump.pump_name}>{pump.pump_name}</option>
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
                                            type="number"
                                            name="rate"
                                            placeholder="Rate"
                                            className="bill-inputfield"
                                            value={newItem.rate}
                                            onChange={handleNewItemChange}
                                        />
                                    </td>
                                    <td>
                                        <input value={newItem.sub_total.toLocaleString()}/>
                                    </td>
                                    <td>
                                        <select value={newItem.vat} className="bill-input" name="vat" onChange={handleNewItemChange}>
                                                <option value=''>Select vat</option>
                                                <option value='16'>16%</option>
                                                <option value='0'>0%</option>
                                        </select>
                                        {/* <input
                                            type="number"
                                            name="vat"
                                            placeholder="VAT"
                                            className="bill-inputfield"
                                            value={newItem.vat}
                                            onChange={handleNewItemChange}
                                        /> */}
                                    </td>
                                    <td>
                                        <input 
                                            className="bill-inputfield"
                                            value={newItem.rate_vat.toLocaleString()}
                                            readOnly
                                        />
                                    </td>
                                    <td>{newItem.amount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="button" onClick={addItem}>Add Item</button>

                        <Typography fontSize='20px' fontWeight='bold' className="total-amount">Sub Total Amount: {subTotalAmount.toLocaleString()}</Typography>
                        <Typography fontSize='20px' fontWeight='bold' className="total-amount">VAT Amount: {vatAmount.toLocaleString()}</Typography>
                        <Typography fontSize='20px' fontWeight='bold' className="total-amount">Total Amount: {totalAmount.toLocaleString()}</Typography>
                        
                        </div>

                        <button type="submit" className="button">Save and Send</button>
                    </form>
                </div>
            </div> 

            <Box m="20px">
                            <Typography
                            fontWeight='bold'
                            variant="h5"
                            textAlign='center'
                            >
                                BILLS
                            </Typography>
                            <Box
                                height="75vh"
                                sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                },
                                "& .name-column--cell": {
                                    // color: colors.greenAccent[300],
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    // backgroundColor: colors.blueAccent[700],
                                    borderBottom: "none",
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
                                rows={bills}
                                columns={columns}
                                components={{ Toolbar: GridToolbar }}
                                />
                            </Box>
                         </Box>
        </div>
    );
}

export default FuelBill;
