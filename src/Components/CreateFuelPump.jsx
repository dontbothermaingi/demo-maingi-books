import { Box, Button, Card, CardContent, FormControl, MenuItem, Pagination, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateFuelPump(){
    const [pumps, setPumps] = useState([]);
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        pump_name: "",
        litres: "",
        pump_location:"",
        fuel_type: "",
        initial_reading: "",
        reading:"",
        date: "",
    });

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/pumpnames', {
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
            setPumps(filtered);
        })
        .catch(error => {
            console.error("Error fetching pumps:", error);
        });
    }, [token]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch('https://db-demo-u07o.onrender.com/pumpnames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify({
                ...formData,
                reading: formData.initial_reading,
                litres: 0,
            })
        })
        .then(response => response.json())
        .then((data) => {

            fetch('https://db-demo-u07o.onrender.com/pumpnames', {
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
                setPumps(filtered);
            })

            
            console.log(data);
            setFormData({
                pump_name: "",
                pump_location:"",
                litres: "",
                initial_reading: "",
                fuel_type:"",
                reading:"",
                date: "",
            });
        })
        .catch(error => {
            console.error("Error submitting form:", error);
        });
    }

    const handleCustomBill = () => {
        navigate(`/fuel-control`);
      };

    const handlePumpReport = (pumpId) => {
        navigate(`/pumps/${pumpId}`);
      };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "PUMP",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            field: "litres",
            headerName: "Litres",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            field: "fuel_type",
            headerName: "Fuel Type",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            field: "reading",
            headerName: "Pump Reading",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            field: "date",
            headerName: "Date",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
    ];

    const totalPages = Math.ceil(pumps.length / itemsPerPage)
    const displayedItems = pumps.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    
    return ( 
        <Box margin={'40px'}>
            <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                        onClick={()=> handleCustomBill()}
                        sx={{margin:'20px'}}
                    >
                        BACK
            </Button>
            <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>CREATE NEW PUMP</Typography>
                <form style={{display:'flex', flexDirection:'column', margin:'30px'}} onSubmit={handleSubmit}>

                        <TextField
                            type="text"
                            name="pump_name"
                            placeholder="Pump Name"
                            value={formData.pump_name}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="number"
                            name="initial_reading"
                            label="Pump Reading"
                            value={formData.initial_reading}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                    <FormControl>
                        <Typography fontWeight={'bold'}>FUEL TYPE</Typography>
                        <Select
                          type="number"
                          name="fuel_type"
                          placeholder="Fuel Type"
                          value={formData.fuel_type}
                          onChange={handleChange}
                          sx={{mb:'20px'}}
                        >
                            <MenuItem value="">Select Fuel</MenuItem>
                            <MenuItem value="PETROL">PETROL</MenuItem>
                            <MenuItem value="DIESEL">DIESEL</MenuItem>

                        </Select>
                    </FormControl>

                        <TextField
                            type="text"
                            name="pump_location"
                            label="Pump Location"
                            value={formData.pump_location}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <Typography fontWeight={'bold'}>DATE</Typography>
                        <TextField
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />
                    
                    <Button type="submit" color="secondary" variant="contained">Save</Button>
                </form>
            </Box>
            
            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>PUMPS</Typography>
                    <Box
                        display={'grid'}
                        gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                        gap="10px"
                        margin="0 10px"
                    >
                        {displayedItems.map((item) => (
                            <Card
                            key={item.id}
                            onClick={() => handlePumpReport(item.id)}
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
                                    <Typography>Litres:</Typography>
                                    <Typography fontWeight={'bold'}>{item.litres}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Reading:</Typography>
                                    <Typography fontWeight={'bold'}>{item.reading}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Fuel Type:</Typography>
                                    <Typography fontWeight={'bold'}>{item.fuel_type}</Typography>
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
                       PUMPS
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
                     rows={pumps}
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
        </Box>
    );
}

export default CreateFuelPump;
