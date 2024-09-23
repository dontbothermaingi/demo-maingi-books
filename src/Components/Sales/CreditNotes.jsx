import { useEffect, useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Invoice.css';
import { useNavigate } from "react-router-dom";

function CreditNote() {
    const [creditnotes, setCreditnotes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [storeItems, setStoreItems] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [isVatInclusive, setIsVatInclusive] = useState(true); // true for inclusive, false for exclusive
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        vendor_pin:"",
        credit_number: "",
        measurement:"",
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
        fetch('https://db-demo-u07o.onrender.com/creditnotes')
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setCreditnotes(invoiceTotal);
            });
    }, []);

    useEffect(() => {
        if (formData.payment_terms && formData.bill_date) {
            calculateDueDate(formData.payment_terms, formData.bill_date);
        }
    }, [formData.payment_terms, formData.bill_date]);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/customers')
            .then(response => response.json())
            .then(data => setVendors(data))
            .catch(error => console.error('Error fetching vendors:', error));
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/stockitems')
            .then(response => response.json())
            .then((data) => setStoreItems(data));
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
    
        fetch('https://db-demo-u07o.onrender.com/creditnotes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData, 
                credit_number: paymentNumber,
                category_name: 'Stock'
            })
        })
            .then(response => response.json())
            .then(data => {

                fetch('https://db-demo-u07o.onrender.com/creditnotes')
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

    return (
        <div>

                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Payment Received?</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">Has you paid the vendor?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlePaymentReceived} color="primary">Yes</Button>
                            <Button onClick={handleCloseDialog} color="secondary">No</Button>
                        </DialogActions>
                    </Dialog>

             <div className="bill-content">
                    
                <div>
                    <h2 className="h2">NEW CREDIT NOTE</h2>
                    <form className="bill-form" onSubmit={handleSubmit}>

                        <div className="bill-input">
                        <label>Customer Name</label>
                        <select name="customer_name" className="bill-inputfield" value={formData.customer_name} onChange={handleSelectVendor}>
                            <option value="">Select Customer</option>
                            {vendors.map((vendor, index) => (
                                <option key={index}>{vendor.customer_name}</option>
                            ))}
                        </select>
                        </div>
                        

                        <div className="bill-input">
                        <label>Credit Number:</label>
                        <input
                            type="text"
                            name="credit_number"
                            placeholder="Credit Number"
                            className="bill-inputfield"
                            value={paymentNumber}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Customer Email</label>
                        <input
                            type="text"
                            name="customer_email"
                            placeholder="Customer Email"
                            className="bill-input"
                            value={formData.customer_email}
                            onChange={handleChange}
                            required
                        />
                        </div>


                        <div className="bill-input">
                        <label>Customer Phone</label>
                        <input
                            type="text"
                            name="customer_phone"
                            placeholder="Customer Phone"
                            className="bill-input"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Customer Pin</label>
                        <input
                            type="text"
                            name="vendor_pin"
                            placeholder="Customer Pin"
                            className="bill-input"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Credit Date</label>
                        <input
                            type="date"
                            name="credit_date"
                            placeholder="Credit Date"
                            className="bill-input"
                            value={formData.credit_date}
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
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Measurement</th>
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
                                        <td>{item.measurement}</td>
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
                                        <select value={newItem.item_details} name="item_details" className="bill-inputfield" onChange={handleNewItemChange}>
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
                                        <select 
                                               type="number"
                                               name="measurement"
                                               placeholder="Quantity"
                                               className="bill-inputfield"
                                               value={newItem.measurement}
                                               onChange={handleNewItemChange}
                                        >
                                            <option value="">Select</option>
                                            {units.map((unit) => (
                                            <option key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </option>
                                            ))}
                                            <option value='new_category'>Create New Category</option>
                                        </select>
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

                        <h3 className="total-amount">Sub Total Amount: {subTotalAmount.toLocaleString()}</h3>
                        <h3 className="total-amount">VAT Amount: {vatAmount.toLocaleString()}</h3>
                        <h3 className="total-amount">Total Amount: {totalAmount.toLocaleString()}</h3>
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
                                CREDIT NOTES
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
                                rows={creditnotes}
                                columns={columns}
                                components={{ Toolbar: GridToolbar }}
                                />
                            </Box>
                         </Box>
        </div>
    );
}

export default CreditNote;
