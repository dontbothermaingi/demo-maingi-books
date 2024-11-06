import { Box, Button, Card, CardContent, FormControl, MenuItem, Pagination, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Fuel(){
    const [pumps,setPumps] = useState([]);
    const navigate = useNavigate()
    const [fuelings,setFuelings] = useState([]);
    const [trucks,setTrucks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const token = localStorage.getItem('access_token')
    const itemsPerPage = 16;
    const [formData,setFormData] = useState({
        pump_name: "",
        pump_location:"",
        truck_number: "",
        litres: "",
        reading: "",
        price:"",
        order:"",
        date: "",
    })

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/pumpnames', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setPumps(data)
        })
    },[token])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/pumpfuelings', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {

            const filter = data.sort((a,b) => b.id - a.id)

            const filtered = filter.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))
            
            setFuelings(filtered)
        })
    },[token])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/trucks', {
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

    function handleSelectPump(event) {
        const selectedValue = event.target.value;

        if (selectedValue === "new_vehicle") {
            navigate("/trucks");
            return;
        }

        const selectedPump = pumps.find(pump => pump.pump_name === selectedValue);

        if (selectedPump) {
            setFormData(prevFormData => ({
                ...prevFormData,
                pump_name: selectedPump.pump_name,
                initial_reading: selectedPump.initial_reading,
                pump_location: selectedPump.pump_location,
            }));
        }
    }

    function handleChange(event){
        const{name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    const selectedPump = pumps.find(pump => pump.pump_name === formData.pump_name)

    function handleSubmit(event){
        event.preventDefault();
    
        // Find the selected pump from the state
        const selectedPump = pumps.find(pump => pump.pump_name === formData.pump_name);
        if (!selectedPump) {
            console.error("Pump not selected");
            return;
        }
    
        const calculatedReading = selectedPump.reading + parseFloat(formData.litres);

        // Prepare formData with calculated reading
        const updatedFormData = {
            ...formData,
            reading: calculatedReading,
            price: (formData.price * formData.litres)
        };
    
        fetch('https://db-demo-u07o.onrender.com/pumpfuelings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify(updatedFormData)
        })
        .then(response => response.json())
        .then((data) => {

            fetch('https://db-demo-u07o.onrender.com/pumpfuelings', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
            .then(response => response.json())
            .then((data) => {

                const filtered = data.map(pump=> ({
                    ...pump,
                    reading: new Intl.NumberFormat().format(pump.reading),
                    litres: new Intl.NumberFormat().format(pump.litres),
                }))
                setFuelings(filtered)
            })


            fetch('https://db-demo-u07o.onrender.com/pumpnames', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
                .then(response => response.json())
                .then((data) => {
                    setPumps(data)
                })
            
            console.log(data);
            // Reset form data
            setFormData({
                pump_name: "",
                truck_number: "",
                litres: "",
                reading: "",
                price: "",
                order: "",
                date: "",
                pump_location:"",
            });
        })
        .catch(error => {
            console.error("Error submitting form:", error);
        });
    }

    const handleCustomBill = () => {
        navigate(`/fuel-control`);
      };
    

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "Pump Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "truck_number",
            headerName: "Truck Number",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "litres",
            headerName: "Litres",
            flex: 1,
        },
        {
            field: "reading",
            headerName: "Reading",
            flex: 1,
        },
        {
          field: "order",
          headerName: "Order",
          flex: 1,
      },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];

    const isMobile = useMediaQuery('(max-width: 768px)');

    const totalPages = Math.ceil(fuelings.length / itemsPerPage)
    const displayedItems = fuelings.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    
    return ( 
        <Box margin={{md:'40px'}}>
            <Button
                        type="button"
                        color="secondary"
                        variant="contained"
                        onClick={()=> handleCustomBill()}
                        sx={{margin:'20px'}}
                    >
                        BACK
            </Button>

            <Box 
            display={'flex'} 
            sx={{
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                height: 'auto', // Adjust height for better flexibility
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '10px',
                margin: '30px',
                backgroundColor: '#fff'
                }}>

                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={'20px'}>FUEL</Typography>
                <form style={{display:'flex', flexDirection:'column', margin:'20px'}} onSubmit={handleSubmit}>
                            <FormControl>
                                <Typography fontWeight={'bold'}>PUMP NAME</Typography>
                                <Select
                                    type="text"
                                    name="pump_name"
                                    value={formData.pump_name}
                                    placeholder="Pump Name"
                                    className="bill-inputfield"
                                    onChange={handleSelectPump}
                                    sx={{mb:'20px'}}
                                >
                                <MenuItem value="">Select Pump</MenuItem>
                                {pumps.map((pump, index) => (
                                        <MenuItem key={index} value={pump.pump_name}>{pump.pump_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            

                            <TextField
                                type="text"
                                name="pump_location"
                                label="Pump Location"
                                className="bill-inputfield"
                                value={formData.pump_location}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mb:'20px'}}
                                readOnly
                            />

                            <FormControl>
                                <Typography fontWeight={'bold'}>VEHICLE NUMBER</Typography>
                                <Select
                                    type="text"
                                    name="truck_number"
                                    value={formData.truck_number}
                                    placeholder="Vehicle Number"
                                    className="bill-inputfield"
                                    onChange={handleChange}
                                    sx={{mb:'20px'}}
                                >
                                <MenuItem value="">Select Vehicle</MenuItem>
                                {trucks.map((truck, index) => (
                                        <MenuItem key={index} value={truck.truck_number}>{truck.truck_number}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        {formData.pump_name ? <h2 className="OWE">THIS PUMP HAS {new Intl.NumberFormat().format(selectedPump.litres)} LITRES OF FUEL.</h2> : ""}

                                <TextField
                                    type="text"
                                    name="litres"
                                    label="Litres"
                                    className="bill-inputfield"
                                    value={formData.litres}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{mb:'20px'}}
                                />

                                <TextField
                                    type="text"
                                    name="order"
                                    label="Fuel Attendant"
                                    className="bill-inputfield"
                                    value={formData.order}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{mb:'20px'}}
                                
                                />

                                <TextField
                                    type="text"
                                    name="price"
                                    label="Price"
                                    className="bill-inputfield"
                                    value={formData.price}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{mb:'20px'}}
                                />

                                <TextField
                                    type="date"
                                    name="date"
                                    className="bill-inputfield"
                                    value={formData.date}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{mb:'20px'}}

                                />
                            <Button type="submit" color="secondary" variant="contained">FUEL</Button>
                </form>
            </Box>
            
            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>FUEL TRANSACTIONS</Typography>
                    <Box
                        display={'grid'}
                        gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                        gap="10px"
                        margin="0 10px"
                    >
                        {displayedItems.map((item) => (
                            <Card
                            key={item.id}
                            sx={{
                                borderRadius: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'auto', // Adjust height for better flexibility
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                padding: '10px',
                                backgroundColor: '#fff',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                },
                            }}
                            >

                                <CardContent>
                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Pump:</Typography>
                                        <Typography fontWeight={'bold'}>{item.pump_name}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Truck:</Typography>
                                        <Typography fontWeight={'bold'}>{item.truck_number}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Litres:</Typography>
                                        <Typography fontWeight={'bold'}>{item.litres}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Reading:</Typography>
                                        <Typography fontWeight={'bold'}>{item.reading}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Fuel Attendant:</Typography>
                                        <Typography fontWeight={'bold'}>{item.order}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Date:</Typography>
                                        <Typography fontWeight={'bold'}>{item.date}</Typography>
                                    </Box>

                                </CardContent>

                            </Card>
                        ))}

                    </Box>

                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
                    </Box>
                </Box>
            ):(
                 <Box m="20px" mt='50px'>
                 <Typography fontWeight="bold" variant="h5" textAlign="center">
                       NUMBER OF FUEL TRANSACTIONS
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
                     rows={fuelings}
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
           
        </Box>
     );
}
 
export default Fuel;