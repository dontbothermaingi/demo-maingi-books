
import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { NavLink, useNavigate } from "react-router-dom";
import './Purchases/Expense.css'
import PieChart from "./PieChart";

function Purchasespare() {
    const [vendors, setVendors] = useState([]);
    const [nextSpareNumber, setNextSpareNumber] = useState([]);
    const [type,setType] = useState([])
    const [spares, setSpares] = useState([]);
    const [isVatInclusive, setIsVatInclusive] = useState(null);
    const [itemExpense, setItemExpense] = useState([]);
    const [name, setName] = useState('');
    const [results, setResults] = useState('');
    const [formData, setFormData] = useState({
        spare_date: "",
        vendor_phone: "",
        spare_number:"",
        vendor_email: "",
        account_name: "",
        vendor_pin:"",
        type_vat: "Exclusive VAT",
        vendor_name: "",
        items:[]
    });

    const [newItem, setNewItem] = useState({
        item_details:"",
        quantity:"",
        sub_total: "",
        vat:"",
        vat_rate:"",
        rate:"",
        amount:""
    })

    useEffect(() => {
        fetch('/spares')
            .then(response => response.json())
            .then(data => {
                const spareItems = data.flatMap(spare => 
                    spare.items.map(item => ({
                        ...item,
                        ...spare
                    }))
                );
                setSpares(spareItems);
                setNextSpareNumber(data.length)
            })
            .catch(error => console.error('Error fetching spares:', error));
    }, []);
    


    useEffect(() => {
        fetch('/vendors')
            .then(response => response.json())
            .then((data) => setVendors(data))
    }, []);

    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
    }

    function handleSelectVendor(event) {
        const selectedCustomer = vendors.find(vendor => vendor.vendor_name === event.target.value);
        setFormData(prevFormData => ({
            ...prevFormData,
            vendor_name: selectedCustomer.vendor_name,
            vendor_phone: selectedCustomer.vendor_phone,
            vendor_email: selectedCustomer.vendor_email,
            vendor_pin: selectedCustomer.kra_pin,
        }));
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
    

    function addItem() {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, newItem]
        }));
        setNewItem({ item_details: "", description: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total: 0 ,amount: 0 });
    }

    const spareNumber = formData.spare_number + 1

    function handleSubmit(event){
        event.preventDefault()

        const spareNumber = nextSpareNumber + 1

        fetch('/spares', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                ...formData,
                spare_number: spareNumber,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setFormData({
                vendor_phone: "",
                vendor_email: "",
                vendor_pin:"",
                spare_date: "",
                vendor_name: "",
                items: [],
            });
        })
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

    
    function calculateTotalAmount(items) {
        return items.reduce((total, item) => total + item.amount, 0);
    }

    const handleViewDetails = (expenseId) => {
        navigate(`/expenses/${expenseId}`);
      };

      useEffect(() => {
        fetch('/items')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log(data); 

            const formattedSpares = data.map(item => ({
                id: item.item_details,
                value: item.quantity
              }));

            setType(formattedSpares);
          })
          .catch(error => console.error('Error fetching data:', error));
      }, []);
    
      const columns = [
        {
          field: "vendor_name",
          headerName: "VENDOR NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
        },
        {
          field: "spare_date",
          headerName: "DATE",
          flex: 0.2,
        },
        { field: "item_details", headerName: "ITEM", flex: 0.2 },
        { field: "quantity", headerName: "QUANTITY", flex: 0.2 },
        { field: "rate", headerName: "RATE", flex: 0.2 },
        { field: "vat", headerName: "VAT", flex: 0.2 },
        { field: "amount", headerName: "AMOUNT", flex: 0.2,},
      ];

    return (
        <div>
            <div className="bill-content">
                <div>
                    <h2 className="h2">ADD SPARE TO STORE</h2>
                    <form className="bill-form" onSubmit={handleSubmit}>
                        <div className="bill-input">
                            <label>Vendor Name</label>
                        <select name="vendor_name" className="bill-inputfield" value={formData.vendor_name} onChange={handleSelectVendor}>
                            <option value="">Select Vendor</option>
                            {vendors.map((vendor, index) => (
                                <option key={index} value={vendor.vendor_name}>{vendor.vendor_name}</option>
                            ))}
                        </select>
                        </div>

                        <div className="bill-input">
                        <label>Vendor Phone</label>
                        <input
                            type="text"
                            name="vendor_phone"
                            placeholder="Vendor Phone"
                            className="bill-inputfield"
                            value={formData.vendor_phone}
                            onChange={handleChange}
                            readOnly
                        />
                        </div>

                        <div className="bill-input">
                        <label>Vendor Email</label>
                        <input
                            type="text"
                            name="vendor_email"
                            placeholder="Vendor Email"
                            className="bill-inputfield"
                            value={formData.vendor_email}
                            onChange={handleChange}
                            readOnly
                        />
                        </div>

                        <div className="bill-input">
                        <label>Vendor PIN</label>
                        <input
                            type="text"
                            name="vendor_pin"
                            placeholder="Vendor Pin"
                            className="bill-inputfield"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            readOnly
                        />
                        </div>
                        
                        <div className="bill-input">
                        <label>Spare Date</label>
                        <input
                            type="date"
                            name="spare_date"
                            placeholder="Spare Date"
                            className="bill-inputfield"
                            value={formData.spare_date}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <button
                           type="button"
                           className="button"
                           onClick={handleToggleVat}
                        >
                            {isVatInclusive ? 'Inclusive Tax' : 'Exclusive Tax'}
                        </button>

                        <div className="bill-input">
                        <label>Items</label>
                        <table className="item-table">
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
                                        <td>{item.sub_total.toLocaleString()}</td>
                                        <td>{item.vat}</td>
                                        <td>{item.rate_vat.toLocaleString()}</td>
                                        <td>{item.amount.toLocaleString()}</td>
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

                                    {/* <td>
                                    <select value={newItem.unit} className="bill-input" name="unit" onChange={handleNewItemChange}>
                                                <option value=''>Select Unit</option>
                                                <option value=''>16%</option>
                                                <option value='0'> 0% </option>
                                        </select>
                                    </td> */}
                                    
                                    <td>
                                        <input
                                            type="integer"
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
                                    <td><input value={newItem.sub_total} /></td>
                                    <td>
                                    <select value={newItem.vat} className="bill-input" name="vat" onChange={handleNewItemChange}>
                                                <option value=''>Select vat</option>
                                                <option value='16'>16%</option>
                                                <option value='0'> 0% </option>
                                        </select>
                                    </td>
                                    <td>{newItem.rate_vat}</td>
                                    <td>{newItem.amount}</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <button type="button" className="button" onClick={addItem}>Add Item</button>

                        <h3 className="total-amount">Sub Total Amount: {subTotalAmount.toLocaleString()}</h3>
                        <h3 className="total-amount">VAT Amount: {vatAmount.toLocaleString()}</h3>
                        <h3 className="total-amount">Total Amount: {totalAmount.toLocaleString()}</h3>

                        <button type="submit" className="button">Save Payment</button>
                    </form>
                </div>
            </div>

            <Box m="20px">
            <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    MOST PURCHASED SPARES
                </Typography>
                <PieChart chartdata={type} />
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    SPARES ADDED TO STORE
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
                        rows={spares}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                    />
                </Box>
            </Box>
        </div>
    );
}

export default Purchasespare;
