import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography,IconButton, FormControl, Select, MenuItem, TextField, TableContainer, Table, TableHead, TableCell, TableBody, Card, CardContent, Pagination, Paper, TableRow, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function DeliveryNote(){
    const navigate = useNavigate();
    const [deliveryNote, setDeliveryNote] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [customers,setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const token = localStorage.getItem('access_token')
    const itemsPerPage = 16;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        fetch('https://maingi-demo-server.onrender.com/deliverynotes', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setDeliveryNote(data)
        })
    },[token])

    useEffect(()=>{
        fetch('https://maingi-demo-server.onrender.com/trucks',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setTrucks(data)
        })
    },[token])

    useEffect(()=>{
        fetch('https://maingi-demo-server.onrender.com/customers', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setCustomers(data)
        })
    },[token])

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
        fetch('https://maingi-demo-server.onrender.com/deliverynotes', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials:'include',
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
            fetch('https://maingi-demo-server.onrender.com/deliverynotes', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
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

    const totalPages = Math.ceil(deliveryNote.length / itemsPerPage)
    const displayedItems = deliveryNote.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };



    return ( 
        <div>
        <Box>

                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>NEW DELIVERY NOTE</Typography>
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
                      margin: '30px', // Keep margin for medium screens and above
                      padding: '10px', // Keep padding for medium screens and above
                    },
                  }}
                
                >
                    <form onSubmit={handleSubmit}>
                        <FormControl sx={{display:'flex', margin:'30px'}}>
                                <Typography fontWeight={'bold'}>Customer Name</Typography>
                                <Select name="customer_name" className="bill-inputfield" value={formData.customer_name} onChange={handleSelectCustomer} sx={{mb:'20px'}}>
                                    <MenuItem value="">Select Customer</MenuItem>
                                    {customers.map((customer, index) => (
                                        <MenuItem key={index} value={customer.customer_name}>{customer.customer_name}</MenuItem>
                                    ))}
                                    <MenuItem value="new_customer">Create New Customer</MenuItem>
                                </Select>

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


                                        <Typography fontWeight={'bold'}>Date</Typography>
                                        <TextField
                                            type="date"
                                            name="delivery_date"
                                            value={formData.delivery_date}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{mb:'20px'}}
                                        />

                                            <Typography>Vehicle Number</Typography>
                                            <Select name="truck_number" className="bill-inputfield" value={formData.truck_number} onChange={handleTrucks} sx={{mb:'20px'}}>
                                                    <MenuItem value="">Select Truck</MenuItem>
                                                    {trucks.map((truck, index) => (
                                                        <MenuItem key={index} value={truck.truck_number}>
                                                            {truck.truck_number}
                                                        </ MenuItem>
                                                    ))}
                                            </Select>

                                            <TextField
                                                type="text"
                                                name="driver"
                                                label="Driver"
                                                value={formData.driver}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                                sx={{mb:'20px'}}
                                            />

                                            <TextField
                                                type="text"
                                                name="driver_contact"
                                                label="Driver Phone NUmber"
                                                value={formData.driver_contact}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                                sx={{mb:'20px'}}
                                            />

                                            <TextField
                                                type="text"
                                                name="origin_place"
                                                label="Origin Location"
                                                value={formData.origin_place}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                                sx={{mb:'20px'}}
                                            />

                                            <TextField
                                                type="text"
                                                name="destination"
                                                label="destination"
                                                className="bill-inputfield"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                                sx={{mb:'20px'}}
                                            />

                                <Box>
                                    <Typography fontSize={'25px'} fontWeight={'bold'}>Items</Typography>
                                    <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', marginTop: 2 }}>
                                        <Table aria-label="Invoice Table" sx={{ minWidth: isMobile ? 900 : 'auto' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Container NUmber</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 430 }}><Typography fontWeight="bold">Cargo Description</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Quantity</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Weight</Typography></TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Measurement</Typography></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {formData.items.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.container_number}</TableCell>
                                                        <TableCell>{item.cargo_description}</TableCell>
                                                        <TableCell>{item.quantity}</TableCell>
                                                        <TableCell>{item.weight}</TableCell>
                                                        <TableCell>{item.measurement}</TableCell>
                                                        <TableCell>
                                                            <IconButton 
                                                                color="error"
                                                                onClick={() => handleDeleteItem(index)}
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell>
                                                        <TextField
                                                            type="text"
                                                            name="container_number"
                                                            lable="Container Number"
                                                            className="bill-inputfield"
                                                            value={newItem.container_number}
                                                            onChange={handleNewItemChange}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="text"
                                                            name="cargo_description"
                                                            placeholder="Cargo Description"
                                                            className="bill-inputfield"
                                                            value={newItem.cargo_description}
                                                            onChange={handleNewItemChange}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            multiline
                                                            minRows={4}  // Initial number of rows
                                                            maxRows={50}   // Maximum number of rows
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            name="quantity"
                                                            placeholder="Quantity"
                                                            className="bill-inputfield"
                                                            value={newItem.quantity}
                                                            onChange={handleNewItemChange}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            name="weight"
                                                            placeholder="Weight"
                                                            className="bill-inputfield"
                                                            value={newItem.weight}
                                                            onChange={handleNewItemChange}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                            <Select 
                                                                type="text"
                                                                name="measurement"
                                                                placeholder="Quantity"
                                                                className="bill-inputfield"
                                                                value={newItem.measurement}
                                                                onChange={handleNewItemChange}
                                                                fullWidth 
                                                                displayEmpty
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                {units.map((unit) => (
                                                                <MenuItem key={unit.value} value={unit.value}>
                                                                    {unit.label}
                                                                </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                        
                    
                        </FormControl>
                        <Box display={'flex'} flexDirection={'column'} gap={'30px'} width={{xs:'50%', md:'20%'}} ml={'30px'} mb={'30px'}>
                            <Button type="button" variant="contained" color="secondary" onClick={addItem}>Add Item</Button>
                            <Button type="submit" variant="contained" color="secondary">Save Delivery Note</Button>
                        </Box>
                    </form>
                </Box>

        </Box>
    
        {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>DELIVERY NOTES</Typography>
                <Box
                    display={'grid'}
                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                    gap="10px"
                    margin="0 10px"
                >

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleViewDetails(item.invoice_number)}
                            sx={{
                                borderRadius: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'auto', // Adjust height for better flexibility
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                padding: '10px',
                                margin: '30px',
                                backgroundColor: '#fff',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            <CardContent>
                                    <Typography>Customer Name: {item.customer_name}</Typography>
                                    <Typography>Customer Phone: {item.customer_name}</Typography>
                                    <Typography>Truck Number: {item.truck_number}</Typography>
                                    <Typography>Weight: {item.weight}</Typography>
                                    <Typography>Container Number: {item.container_number}</Typography>
                                    <Typography>Invoice Number: {item.invoice_number}</Typography>
                                    <Typography>Cargo Description: {item.cargo_description}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
                    </Box>
                </Box>
            </Box>
              ) : (
                <Box m="20px">
                  <Typography 
                      fontSize='30px'
                      fontWeight='bold'
                      textAlign='center'
                  >
                      DELIVERY NOTES
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={deliveryNote}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      />
                  </Box>
                </Box>
              )}


    </div>

     );
}
 
export default DeliveryNote;