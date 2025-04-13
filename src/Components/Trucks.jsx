import { Alert, Box,Button,Card,CardContent,CircularProgress,Dialog,DialogContent,FormControl,MenuItem,Pagination,Select,Snackbar,TextField,ToggleButton,ToggleButtonGroup,Typography, useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";


function Trucks(){
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('access_token')
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [openSnackBar, setOpenSnackbar] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [trucks, setTrucks] = useState([]);
  const [formData,setFormData] = useState({
    truck_number:"",
    vehicle_type:"",
    manufacturer:"",
    driver:"",
    vehicle_id:"",
    contact:"",
  })

  const navigate = useNavigate();
  

  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/trucks',{
          method: 'GET',
          credentials: 'include',
          headers: {
              'Authorization': `Bearer ${token}`
          }
    })
      .then(response => response.json())
      .then((data) => setTrucks(data));
  }, [token]);

  function handleChange(event){
    const{name,value} = event.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  }

  function handleSubmit(event){
    event.preventDefault()

    setLoading(true)
    setOpenDialog(true)

    const vehicleId = trucks.length + 1

    fetch('https://demo-server-757m.onrender.com/trucks', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
      body:JSON.stringify({...formData, vehicle_id:vehicleId})
    })
    .then(response => response.json())
    .then(data => {

      fetch('https://demo-server-757m.onrender.com/trucks',{
          method: 'GET',
          credentials: 'include',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => response.json())
      .then((data) => setTrucks(data));

      console.log(data)
      setFormData({
        truck_number:"",
        vehicle_type:"",
        manufacturer:"",
        driver:"",
        vehicle_id:"",
        trailer:"",
        contact:"",
      })

      setOpenDialog(false)
      setLoading(false)
    })
    .catch((error) => {
      console.error("Failed to save vehicle", error)
      setOpenSnackbar(true)
      setErrorMessage("Failed to create new vehicle. Please try again!")
    })
  }

  const handleViewDetails = (truckId) => {
    navigate(`/truck/${truckId}`);
  };

  const handleRepair = () => {
    navigate(`/vehicle-repair`);
  };

  const handleFueling = () => {
    navigate(`/fuelings`);
  };

  const handleFitNewTyre = () => {
    navigate(`/fit-new-tyre`);
  };

  function handleCloseSnackbar(event, reason){
    if(reason === 'clickaway') return;
    setOpenDialog(false)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const columns = [
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      flex: 0.5,
      align: "left",
      mt: "12px",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
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
      headerName: "Truck Number",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
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
      field: "trailer",
      headerName: "Trailer Number",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
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
      field: "driver",
      headerName: "Driver",
      headerAlign: "left",
      flex: 0.5,
      align: "left",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
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
      field: "contact",
      headerName: "Contact",
      headerAlign: "left",
      flex: 0.5,
      align: "left",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
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
      field: "vehicle_type",
      headerName: "Vehicle Type",
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.id)}
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

  const totalPages = Math.ceil(trucks.length / itemsPerPage)
  const displayedItems = trucks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

  return (
    <Box display={'flex'} flexDirection={'column'}>

              <ToggleButtonGroup exclusive sx={{ml:'50px', mt:'20px', mb:{xs:'10px', md:'0px'}}} size={isMobile ? "small" : "medium"}>
                <ToggleButton onClick={handleRepair} sx={{fontSize:{xs:"11px", md:'14px'}}}>Repair</ToggleButton>
                <ToggleButton onClick={handleFueling} sx={{fontSize:{xs:"11px", md:'14px'}}}>Fuel</ToggleButton>
                <ToggleButton onClick={handleFitNewTyre} sx={{fontSize:{xs:"11px", md:'14px'}}}>Fit New Tyre</ToggleButton>
                <ToggleButton onClick={() => handleRepair()} sx={{fontSize:{xs:"11px", md:'14px'}}}>Repair</ToggleButton>
              </ToggleButtonGroup>

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogContent sx={{display:'flex', alignItems:'center', gap:'20px'}}>
                      <CircularProgress sx={{fontSize:'10px'}}/>
                      <Typography fontFamily={'GT Bold'}>Saving...</Typography>
                  </DialogContent>
              </Dialog>


               <Snackbar
                  open={openSnackBar} 
                  autoHideDuration={6000} 
                  onClose={handleCloseSnackbar} 
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                  <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes('Please') ? "error" : "success"} sx={{ width: '100%' }}>{errorMessage}</Alert>
              </Snackbar>

              <Box>
              <Typography
                  textAlign='center'
                  fontSize='30px'
                  fontFamily={"GT Bold"}
                >
                    ADD VEHICLE
              </Typography>  
                
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

                          <Typography fontWeight={'bold'}>VEHICLE TYPE</Typography>
                          <Select 
                              type="number"
                              name="vehicle_type"
                              value={formData.vehicle_type}
                              placeholder="Vehicle Type"
                              onChange={handleChange}
                              sx={{mb:'20px'}}
                          >
                            <MenuItem value="">Select Vehicle Type</MenuItem>
                            <MenuItem value="Heavy Commercial Vehicle">Heavy Commercial Vehicle</MenuItem>
                            <MenuItem value="Light Commercial Vehicle">Light Commercial Vehicle</MenuItem>
                          </Select>

                          <TextField
                              type="text"
                              name="truck_number"
                              value={formData.truck_number}
                              label="Vehicle number plate"
                              onChange={handleChange}
                              variant="outlined"
                              sx={{mb:'20px'}}
                              
                          />

                          <TextField
                              type="text"
                              name="trailer"
                              value={formData.trailer}
                              label="Trailer number plate"
                              onChange={handleChange}
                              variant="outlined"
                              sx={{mb:'20px'}}
                          />

                          <TextField
                              type="text"
                              name="driver"
                              value={formData.driver}
                              label="Driver"
                              onChange={handleChange}
                              variant="outlined"
                              sx={{mb:'20px'}}
                          />

                          <TextField
                              type="text"
                              name="contact"
                              value={formData.contact}
                              label="Contact"
                              onChange={handleChange}
                              variant="outlined"
                              sx={{mb:'20px'}}
                          />

                          <TextField
                              type="text"
                              name="manufacturer"
                              value={formData.manufacturer}
                              label="Manufacturer"
                              onChange={handleChange}
                              variant="outlined"
                              sx={{mb:'20px'}}
                          />

                      <Button type="submit" variant="contained" color="secondary" disabled={loading} sx={{fontFamily:"GT Bold", width:'150px', mt:'30px'}}>{loading ? "Saving..." : "Add Vehicle"}</Button>
                      </FormControl>
                  </form>
                </Box>
                
            </Box>

            {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"25px"}>VEHICLES</Typography>
                <Box
                    display={'grid'}
                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                    gap="10px"
                    margin="0 10px"
                >

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleViewDetails(item.id)}
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
                                  <Box display={'flex'} gap={'7px'}>
                                    <Typography>Manufacturer:</Typography>
                                    <Typography fontWeight={'bold'}>{item.manufacturer}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'7px'}>
                                    <Typography>Truck Number:</Typography>
                                    <Typography  fontWeight={'bold'}>{item.truck_number}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'7px'}>
                                    <Typography>Trailer:</Typography>
                                    <Typography fontWeight={'bold'}>{item.trailer}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'7px'}>
                                    <Typography>Driver:</Typography>
                                    <Typography fontWeight={'bold'}>{item.driver}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'7px'}>
                                    <Typography>Contact:</Typography>
                                    <Typography fontWeight={'bold'}>{item.contact}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'7px'}>
                                    <Typography>Vehicle Type:</Typography>
                                    <Typography fontWeight={'bold'}>{item.vehicle_type}</Typography>
                                  </Box>

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
                  textAlign='center'
                  fontSize='30px'
                  fontWeight='bold'
                >
                    ALL VEHICLES
              </Typography>  
                    
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={trucks}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      />
                  </Box>
                </Box>
              )}
    </Box>
  );
};

export default Trucks;
