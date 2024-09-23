import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';


function Quotes (){

    const [quotes,setQuotes] = useState([]);
    const navigate = useNavigate()
    const [isVatInclusive, setIsVatInclusive] = useState(true);
    const [customers,setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        quote_number: "",
        quote_date: "",
        vendor_pin: "",
        type_vat:"Inclusive Tax",
        items: [],
    })

    const [newItem,setNewItem] = useState({
        item_details: "",
        description: "",
        quantity: 0,
        vat: 0,
        sub_total:"",
        rate_vat: 0,
        rate: 0,
        amount: 0,
    })

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/customers')
        .then(response => response.json())
        .then(data => setCustomers(data))
    }, [])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/quotes')
        .then(response => response.json())
        .then((data) => {

            
            const quote_total = data.map((quote) => {
                const totalAmount = new Intl.NumberFormat().format(quote.items.reduce((total, item) => total + item.amount, 0));
                return { ...quote, totalAmount };

            })
            

            setQuotes(quote_total)
        })
    },[])

    function handleChange(event){
        const{name,value} = event.target

        setFormData(prevFormData =>({
            ...prevFormData,
            [name]:value,
        }))
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

    function addItem() {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, newItem]
        }));
        setNewItem({ item_details: "", description: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total:0, amount: 0 });
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
            }));
        }
    }


    function handleSubmit(event){
        event.preventDefault()

        const quoteNumber = quotes.length + 1

        fetch('https://db-demo-u07o.onrender.com/quotes', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({...formData, quote_number:quoteNumber})
        })
        .then(response => response.json())
        .then(data => {

                fetch('https://db-demo-u07o.onrender.com/quotes')
                .then(response => response.json())
                .then((data) => {
                    
                    const quote_total = data.map((quote) => {
                        const totalAmount = new Intl.NumberFormat().format(quote.items.reduce((total, item) => total + item.amount, 0));
                        return { ...quote, totalAmount };
        
                    })
                    
        
                    setQuotes(quote_total)
                })

            setFormData({
                customer_name: "",
                customer_phone: "",
                customer_email: "",
                quote_number: "",
                quote_date: "",
                vendor_pin: "",
                type_vat:"Inclusive Tax",
                items: [],
            })
        })
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

    const handleViewDetails = (quoteId) => {
        navigate(`/quote-details/${quoteId}`);
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
            onClick={() => handleViewDetails(params.row.quote_number)}
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
          field: "quote_number",
          headerName: "Quote Number",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.quote_number)}
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
            onClick={() => handleViewDetails(params.row.quote_number)}
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
          field: "quote_date",
          headerName: "Quote Date",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.quote_number)}
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
                <div>
                    <Typography fontSize='25px' fontWeight="bold" textAlign='center'>NEW QUOTE</Typography>
                    <form className="bill-form" onSubmit={handleSubmit}>

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
                        <label>Quote Date</label>
                        <input
                            type="date"
                            name="quote_date"
                            placeholder="Quote Date"
                            className="input"
                            value={formData.quote_date}
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
                        <label>Items</label>
                        <table className="item-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Description</th>
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
                                        <td>{item.description}</td>
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
                                        <input
                                            type="text"
                                            name="item_details"
                                            placeholder="Item Details"
                                            className="bill-inputfield"
                                            value={newItem.item_details}
                                            onChange={handleNewItemChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="description"
                                            placeholder="Description"
                                            className="bill-inputfield"
                                            value={newItem.description}
                                            onChange={handleNewItemChange}
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
                                    <td><input value={newItem.sub_total.toLocaleString()}/></td>
                                    <td>

                                        <select value={newItem.vat} className="bill-input" name="vat" onChange={handleNewItemChange}>
                                                {/* <option value=''>Select vat</option> */}
                                                <option value='16'>16%</option>
                                                <option value='0'> 0% </option>
                                        </select>

                                    </td>
                                    <td><input value={newItem.rate_vat.toLocaleString()}/></td>
                                    <td><input value={newItem.amount.toLocaleString()}/></td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        
                        <button type="button" className="button" onClick={addItem}>Add Item</button>
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
                    QUOTES
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
                    rows={quotes}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
            </Box>


        </div>
     );
}
 
export default Quotes;