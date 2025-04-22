import { Box, Typography, Autocomplete, TextField, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close'; 


function RetreadTyreShop(){
    const [usedTyres, setUsedTyres] = useState([])
    const [vendors, setVendors] = useState([])
    const [trips,setTrips] = useState([])
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        vendor_name: "",
        vendor_email: "",
        vendor_phone: "",
        vendor_pin:"",
        trip_number:"",
        currency:"",
        date:"",
        items:[]
    })
    const [newItem, setNewItem] = useState({
        item_details: "",
        size: "",
        serial_number: "",
        tyre_mileage:"",
    });

    useEffect(()=>{
        fetch('https://maingi-demo-server.onrender.com/usedtyres')
        .then(response => response.json())
        .then((data) => {
            setUsedTyres(data)
        })
    },[])

    useEffect(()=>{
        fetch('https://maingi-demo-server.onrender.com/retreadshoptrips')
        .then(response => response.json())
        .then((data) => {
            setTrips(data)
        })
    },[])

    useEffect(()=>{
        fetch('https://maingi-demo-server.onrender.com/vendors')
        .then(response => response.json())
        .then((data) => {
            setVendors(data)
        })
    },[])

    function addItem() {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, newItem]
        }));
        setNewItem({ item_details: "", size: "", serial_number: "", tyre_mileage:"", });
    }

    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
    }

    function handleNewItemChange(event){
        const {name,value} = event.target

        setNewItem(prevNewItem => ({
            ...prevNewItem,
            [name]:value,
        }))
    }

    function handleChange(event){
        const {name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    const repairTrip = trips.length + 1

    function handleSubmit(event){
        event.preventDefault()

        fetch('https://maingi-demo-server.onrender.com/retreadshoptrips', {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                ...formData,
                trip_number: repairTrip,
            })
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data)

            fetch('https://maingi-demo-server.onrender.com/retreadshoptrips')
            .then(response => response.json())
            .then((data) => {
                setTrips(data)
            })

            setFormData({
                item_details: "",
                vendor_name:"",
                vendor_phone:"",
                vendor_email:"",
                vendor_pin:"",
                size: "",
                serial_number: "",
                tyre_mileage:"",
                date:"",
                items:[],
            })
        })
    }

    function handleSelectSerialNumber(event, value) {
        const selectedTyre = usedTyres.find((tyre) => tyre.serial_number === value);
    
        if (selectedTyre) {
          setNewItem((prevFormData) => ({
            ...prevFormData,
            serial_number: selectedTyre.serial_number,
            item_details: selectedTyre.item_details,
            size: selectedTyre.size,
            tyre_mileage: selectedTyre.tyre_mileage,
          }));
        }
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

    const handleViewDetails = (reportId) => {
        navigate(`/retreadtyretripreport/${reportId}`);
      };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "vendor_name",
            headerName: "Vendor Name",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.trip_number)}
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
            field: "vendor_phone",
            headerName: "Vendor Phone",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "vendor_email",
            headerName: "Vendor Email",
            flex: 1,
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];


    return ( 
        <div>
            <div className="bill-content">
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
                        <label>Vendor Email</label>
                        <input
                            type="text"
                            name="vendor_email"
                            placeholder="Vendor Email"
                            className="bill-input"
                            value={formData.vendor_email}
                            onChange={handleChange}
                            readOnly
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
                            readOnly
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
                            readOnly
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
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            placeholder="Date"
                            className="bill-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bill-input">
                        <table className="invoice-table">
                            <thead>
                                <tr>

                                    <th>Serial Number</th>
                                    <th>Tyre Name</th>
                                    <th>Size</th>
                                    <th>Tyre Mileage</th>
    
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.serial_number}</td>
                                        <td>{item.item_details}</td>
                                        <td>{item.size}</td>
                                        <td>{item.tyre_mileage}</td>
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
                                        <Autocomplete
                                            freeSolo
                                            options={usedTyres.map((tyre) => tyre.serial_number)}
                                            onChange={handleSelectSerialNumber}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    className="bill-inputfield"
                                                    value={newItem.serial_number}
                                                />
                                            )}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="item_details"
                                            placeholder="Tyre Brand"
                                            className="bill-inputfield"
                                            value={newItem.item_details}
                                            onChange={handleNewItemChange}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            name="size"
                                            placeholder="Size"
                                            className="bill-inputfield"
                                            value={newItem.size}
                                            onChange={handleNewItemChange}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            name="tyre_mileage"
                                            placeholder="Tyre Mileage"
                                            className="bill-inputfield"
                                            value={newItem.tyre_mileage}
                                            onChange={handleNewItemChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                            <button type="button" className="button" onClick={addItem}>Add Tyre</button>
                        </div>

                        <button type="submit" className="button">SEND TO RETREAD SHOP</button>
                </form>
            </div>

            <Box m="20px" mt='50px'>
                  <Typography fontWeight="bold" variant="h5" textAlign="center">
                        NUMBER OF RETREAD TRIPS
                  </Typography>
                  <Box
                    margin='auto'
                    mt='20px'
                    height="75vh"
                    // width="1000px"
                    sx={{
                      "& .MuiDataGrid-root": {
                        border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                      },
                      "& .name-column--cell": {},
                      "& .MuiDataGrid-columnHeaders": {
                        borderBottom: "none",
                      },
                      "& .MuiDataGrid-virtualScroller": {},
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                      },
                      "& .MuiCheckbox-root": {},
                      "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
                    }}
                  >
                    <DataGrid
                      rows={trips}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Box>
                </Box> 
        </div>
     );
}
 
export default RetreadTyreShop;