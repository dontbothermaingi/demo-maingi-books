import { Box,Typography} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";


function Trucks(){
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
    fetch('https://db-demo-u07o.onrender.com/trucks')
      .then(response => response.json())
      .then((data) => setTrucks(data));
  }, []);

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
        'Content-Type':'application/json'
      },
      body:JSON.stringify({...formData, vehicle_id:vehicleId})
    })
    .then(response => response.json())
    .then(data => {

      fetch('https://db-demo-u07o.onrender.com/trucks')
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

  return (
    <Box>

        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
            mb="20px"
            mt="20px"
            width="100%"
            maxWidth="1630px"
            px={2}  // Adds padding on left and right
        >
            <Box
                gridColumn="span 2"
                backgroundColor={'grey' }
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
                backgroundColor={'grey' }
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
                backgroundColor={'grey' }
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
                backgroundColor={'grey' }
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
              <div>
              <Typography
                  textAlign='center'
                  fontSize='30px'
                  fontWeight='bold'
                >
                    ADD VEHICLE
              </Typography>  
                
                <form className="bill-form" onSubmit={handleSubmit}>
                    <div className="bill-input">
                        <label>VEHICLE TYPE</label>
                        <select 
                            type="number"
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            placeholder="Vehicle Type"
                            className="bill-inputfield"
                            onChange={handleChange}
                        >
                          <option value="">Select Vehicle Type</option>
                          <option value="Heavy Commercial Vehicle">Heavy Commercial Vehicle</option>
                          <option value="Light Commercial Vehicle">Light Commercial Vehicle</option>
                        </select>
                    </div>

                    <div className="bill-input">
                        <label>VEHICLE NUMBER PLATE</label>
                        <input
                            type="text"
                            name="truck_number"
                            value={formData.truck_number}
                            placeholder="Vehicle number plate"
                            className="bill-inputfield"
                            onChange={handleChange}
                            
                        />
                    </div>
                    <div className="bill-input">
                        <label>TRAILER NUMBER PLATE</label>
                        <input
                            type="text"
                            name="trailer"
                            value={formData.trailer}
                            placeholder="Trailer number plate"
                            className="bill-inputfield"
                            onChange={handleChange}
                            
                        />
                    </div>
                    <div className="bill-input">
                        <label>DRIVER</label>
                        <input
                            type="text"
                            name="driver"
                            value={formData.driver}
                            placeholder="Driver"
                            className="bill-inputfield"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="bill-input">
                        <label>MANUFACTURER</label>
                        <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            placeholder="Manufacturer"
                            className="bill-inputfield"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="button">ADD VEHICLE</button>
                </form>
            </div>

          <Box m="20px">
           <Typography
                  textAlign='center'
                  fontSize='30px'
                  fontWeight='bold'
                >
                    ALL VEHICLES
            </Typography>          

            <Box
              m="40px 0 0 0"
              width='auto'
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
                rows={trucks}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => row.id}
              />
            </Box>
          </Box>
    </Box>
  );
};

export default Trucks;
