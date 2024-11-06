import { Box,Button,Card,CardContent,FormControl,MenuItem,Pagination,Select,TextField,Typography, useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";


function Trucks(){
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  const token = localStorage.getItem('access_token')
  

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/trucks',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
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

    const vehicleId = trucks.length + 1

    fetch('https://db-demo-u07o.onrender.com/trucks', {
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

      fetch('https://db-demo-u07o.onrender.com/trucks', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
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

            <Box
                display="grid"
                gridTemplateColumns= {{xs:"repeat(1, 1fr)", md:"repeat(8, 1fr)"}}
                gridAutoRows="140px"
                gap="20px"
                mb="20px"
                mt="20px"
                px={2}  // Adds padding on left and right
            >
                <Box
                    gridColumn="span 2"
                    backgroundColor={'purple' }
                    borderRadius="15px"  // Increased border radius for a softer look
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={3}  // Adds a shadow effect for depth
                    sx={{ transition: 'background-color 0.3s ease' }}  // Smooth color transition
                    onClick={handleRepair}
                    hover={{ backgroundColor: colors.primary[500] }}  // Darker color on hover
                >
                    <Typography
                        textAlign="center"
                        fontSize="24px"  // Slightly smaller font size for better balance
                        fontWeight="bold"
                        color="white"  // Ensures text is readable
                    >
                        SERVICE
                    </Typography>
                </Box>
                <Box
                    gridColumn="span 2"
                    backgroundColor={'purple' }
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={handleFueling}
                    cursor='mouse'
                    boxShadow={3}
                    sx={{ transition: 'background-color 0.3s ease' }}
                    hover={{ backgroundColor: colors.primary[500] }}
                >
                    <Typography
                        textAlign="center"
                        fontSize="24px"
                        fontWeight="bold"
                        color="white"
                    >
                        FUEL
                    </Typography>
                </Box>
                <Box
                    gridColumn="span 2"
                    backgroundColor={'purple' }
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={handleFitNewTyre}
                    boxShadow={3}
                    sx={{ transition: 'background-color 0.3s ease' }}
                    hover={{ backgroundColor: colors.primary[500] }}
                >
                    <Typography
                        textAlign="center"
                        fontSize="24px"
                        fontWeight="bold"
                        color="white"
                    >
                        FIT NEW TYRE
                    </Typography>   
                </Box>
                <Box
                    gridColumn="span 2"
                    backgroundColor={'purple' }
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={3}
                    sx={{ transition: 'background-color 0.3s ease' }}
                    hover={{ backgroundColor: 'black' }}
                    onClick={() => handleRepair()}
                >
                    <Typography
                        textAlign="center"
                        fontSize="24px"
                        fontWeight="bold"
                        color="white"
                    >
                        REPAIR VEHICLE
                    </Typography>    
                </Box>
            </Box>

              <Box>
              <Typography
                  textAlign='center'
                  fontSize='30px'
                  fontWeight='bold'
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

                      <Button type="submit" variant="contained" color="secondary">ADD VEHICLE</Button>
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
