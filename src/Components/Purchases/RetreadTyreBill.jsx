import { useEffect, useState } from "react";
import { Button, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Bill.css';
import { useNavigate } from "react-router-dom";

function RetreadTyreBill() {
    const [bills, setBills] = useState([]);
    const [tyres, setTyres] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [vendors, setVendors] = useState([]);
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
        amount_paid:"",
        amount_made:"",
        payment_terms: "",
        status:"",
        type_vat: "Inclusive VAT",
        items: [],
    });

    const paymentNumber = bills.length + 1;

    const [newItem, setNewItem] = useState({
        item_details: "",
        tyre_mileage: "",
        quantity: 1,
        type_vat:"",
        reading:"",
        vat: 0,
        sub_total: 0,
        rate_vat: 0,
        rate: 0,
        amount: 0,
    });

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/shopretreads')
        .then(response => response.json())
        .then((data) => {

            const filtered = data.filter(item => item.position === 'SHOP')
            setTyres(filtered)
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

    function handleSelectSerialNumber(event) {
        const selectedValue = event.target.value;
        
        if (selectedValue === "new_bank_account") {
            navigate("/banks");
            return;
        }
        
        const selectedTyre = tyres.find(tyre => tyre.serial_number === selectedValue);
        
        if (selectedTyre) {
            setNewItem(prevFormData => ({
                ...prevFormData,
                item_details: selectedTyre.serial_number,
                description: selectedTyre.item_details,
                spare_name: selectedTyre.size,
                tyre_mileage: selectedTyre.tyre_mileage,
            }));
        }
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
        setNewItem({ item_details: "", description: "", spare_name:"", quantity: 1, rate: 0, vat: 0, rate_vat: 0,sub_total: 0 ,amount: 0 });
    }
      
    
    function handleSubmit(event) {
        event.preventDefault();

        const calculateInvoiceTotal = () => {
            return formData.items.reduce((total, item) => total + item.amount, 0);
        }
    
        fetch('https://db-demo-u07o.onrender.com/retreadtyrebills', {
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
                amount_made:"",
                amount_paid:"",
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
        navigate('/bill-control');
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    const handlePaymentReceived = () => {
        navigate('/payments-made')
        handleCloseDialog();
    };

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
                    <h2 className="h2">NEW RETREAD TYRE BILL</h2>
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
                                    <th>Serial Number</th>
                                    <th>Tyre Name</th>
                                    <th>Size</th>
                                    <th>Tyre Mileage</th>
                                    <th>Quantity</th>
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
                                        <td>{item.description}</td>
                                        <td>{item.spare_name}</td>
                                        <td>{item.tyre_mileage}</td>
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
                                    <select name="item_details" value={newItem.item_details} className="bill-inputfield" onChange={handleSelectSerialNumber}>
                                            <option value="">Select Serial Number</option>
                                            {tyres.map((tyre, index) => (
                                                    <option key={index} value={tyre.serial_number}>{tyre.serial_number}</option>
                                                ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="description"
                                            placeholder="Tyre Name"
                                            className="bill-inputfield"
                                            value={newItem.description}
                                            onChange={handleNewItemChange}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="spare_name"
                                            placeholder="Tyre Size"
                                            className="bill-inputfield"
                                            value={newItem.spare_name}
                                            onChange={handleNewItemChange}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="tyre_mileage"
                                            placeholder="Tyre Mileage"
                                            className="bill-inputfield"
                                            value={newItem.tyre_mileage}
                                            onChange={handleNewItemChange}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="quantity"
                                            placeholder="Quantity"
                                            className="bill-inputfield"
                                            value={newItem.quantity}
                                            onChange={handleNewItemChange}
                                            readOnly
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

        </div>
    );
}

export default RetreadTyreBill;
