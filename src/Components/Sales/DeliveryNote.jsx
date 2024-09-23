import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography,IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import './DeliveryNote.css'

function DeliveryNote(){
    const navigate = useNavigate();
    const [deliveryNote, setDeliveryNote] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [customers,setCustomers] = useState([]);
    const [formData,setFormData] = useState({
        customer_name: "",
        truck_number:"",
        customer_phone: "",
        customer_email: "",
        invoice_number: "",
        delivery_number: "",
        delivery_date: "",
        vendor_pin: "",
        origin_place: "",
        destination: "",
        driver_contact:"",
        driver:"",
        items: [],
    });
    const [newItem, setNewItem] = useState({
        container_number:"",
        cargo_description: "",
        quantity: 0,
        weight:0,
        measurement:"",
    });


    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/deliverynotes')
        .then(response => response.json())
        .then((data) => {
            setDeliveryNote(data)
        })
    },[])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/trucks')
        .then(response => response.json())
        .then((data) => {
            setTrucks(data)
        })
    },[])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/customers')
        .then(response => response.json())
        .then((data) => {
            setCustomers(data)
        })
    },[])

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/invoices')
        .then(response => response.json())
        .then((data) => {
            const invoiceNumbers = data.map(invoice => invoice.invoice_number);
            setInvoices(invoiceNumbers);
        })
        .catch((error) => {
            console.error('Error fetching invoices:', error);
        });
    }, []);
    

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
            }));
        }
    }

    function handleTrucks(event){
        const selectedValue = event.target.value

        const selectedTruck = trucks.find(truck => truck.truck_number === selectedValue);

        if(selectedTruck){
            setFormData(prevFormData => ({
                ...prevFormData,
                truck_number: selectedTruck.truck_number,
                driver: selectedTruck.driver,
                driver_contact: selectedTruck.contact,
            }));
        }

    }


    function handleChange(event){
        const {name,value} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value
        }))
    }

    function handleNewItemChange(event){
        const {name,value} = event.target
        setNewItem(prevNewItem => ({
            ...prevNewItem,
            [name]:value
        }))
    }

    function addItem(){
        setFormData( prevFormData => ({
            ...prevFormData,
            items:[...prevFormData.items, newItem]
        }))
        setNewItem({container_number:"", cargo_description:"",quantity:"",weight:"",measurement:""})
    }

    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const deliveryNumber = deliveryNote.length + 1

        const submit = {
            ...formData,
            delivery_number:deliveryNumber
        }

        console.log(submit)
    
        // POST request to submit form data
        fetch('https://db-demo-u07o.onrender.com/deliverynotes', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                delivery_number:deliveryNumber
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then((data) => {
            // Assuming `data` contains the updated delivery notes
            fetch('https://maingi-server-3.onrender.com/deliverynotes')
            .then(response => response.json())
            .then((data) => {
                setDeliveryNote(data)
            })
    
            // Reset form data
            setFormData({
                customer_name: "",
                customer_phone: "",
                customer_email: "",
                truck_number: "",
                invoice_number: "",
                delivery_number: "",
                delivery_date: "",
                vendor_pin: "",
                origin_place: "",
                destination: "",
                driver_contact: "",
                driver: "",
                items: [],
            });
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    

    function handleDeliveryNote(deliveryId){
        navigate(`/delivery-note/${deliveryId}`)
    }

    const handleViewDetails = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`);
    };

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
        { value: 'Tonnes', label: 'Tonnes(t)' },
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

    const columns = [
        {
            field: "customer_name",
            headerName: "Consignee",
            flex: 0.35,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleDeliveryNote(params.row.delivery_number)}
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
            headerName: "Consignee Contact",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleDeliveryNote(params.row.delivery_number)}
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
            field: "truck_number",
            headerName: "Vehicle",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleDeliveryNote(params.row.delivery_number)}
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
            field: "cargo_description",
            headerName: "Cargo",
            flex: 0.35,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleDeliveryNote(params.row.delivery_number)}
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
            field: "weight",
            headerName: "Weight",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleDeliveryNote(params.row.delivery_number)}
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
            flex: 0.2,
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
            field: "container_number",
            headerName: "Container Number",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleDeliveryNote(params.row.delivery_number)}
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
                <h2 className="h2">NEW DELIVERY NOTE</h2>
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
                    <label>Invoice Number</label>

                    <select name="invoice_number" className="bill-inputfield" value={formData.invoice_number} onChange={handleChange}>
                            <option value="">Select Invoice</option>
                            {invoices?.map((invoice, index) => (
                                <option key={index} value={invoice.invoice_number}>
                                    {invoice.invoice_number}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="bill-input">
                    <label>Date</label>
                    <input
                        type="date"
                        name="delivery_date"
                        placeholder="Date"
                        className="input"
                        value={formData.delivery_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="bill-input">
                    <label>Vehicle Number</label>

                    <select name="truck_number" className="bill-inputfield" value={formData.truck_number} onChange={handleTrucks}>
                            <option value="">Select Truck</option>
                            {trucks.map((truck, index) => (
                                <option key={index} value={truck.truck_number}>
                                    {truck.truck_number}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="bill-input">
                    <label>Driver</label>
                    <input
                        type="text"
                        name="driver"
                        placeholder="Driver"
                        className="bill-inputfield"
                        value={formData.driver}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="bill-input">
                    <label>Driver Phone Number</label>
                    <input
                        type="text"
                        name="driver_contact"
                        placeholder="Driver Phone NUmber"
                        className="bill-inputfield"
                        value={formData.driver_contact}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="bill-input">
                    <label>Origin Location</label>
                    <input
                        type="text"
                        name="origin_place"
                        placeholder="Origin Location"
                        className="bill-inputfield"
                        value={formData.origin_place}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="bill-input">
                    <label>Destination</label>
                    <input
                        type="text"
                        name="destination"
                        placeholder="destination"
                        className="bill-inputfield"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                    />
                </div>

                    <div className="bill-input">
                    <label>Items</label>
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th>Container Number</th>
                                <th>Cargo Description</th>
                                <th>Quantity</th>
                                <th>Weight</th>
                                <th>Measurement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.container_number}</td>
                                    <td>{item.cargo_description}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.weight}</td>
                                    <td>{item.measurement}</td>
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
                                        name="container_number"
                                        placeholder="Container Number"
                                        className="bill-inputfield"
                                        value={newItem.container_number}
                                        onChange={handleNewItemChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="cargo_description"
                                        placeholder="Cargo Description"
                                        className="bill-inputfield"
                                        value={newItem.cargo_description}
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
                                        name="weight"
                                        placeholder="Weight"
                                        className="bill-inputfield"
                                        value={newItem.weight}
                                        onChange={handleNewItemChange}
                                    />
                                </td>
                                <td>
                                        <select 
                                               type="text"
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
                                        </select>
                                    </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    
                    <button type="button" className="button" onClick={addItem}>Add Item</button>
                    <button type="submit" className="button">Save Delivery Note</button>
                </form>
            </div>
        </div>
    
        <Box m="20px">
            <Typography 
                fontSize='30px'
                fontWeight='bold'
                textAlign='center'
            >
                DELIVERY NOTES
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
                rows={deliveryNote || []}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => row.id}
                />
            </Box>
        </Box>


    </div>

     );
}
 
export default DeliveryNote;