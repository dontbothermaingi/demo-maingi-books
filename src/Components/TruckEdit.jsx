import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography"; // Import Typography from Material-UI
import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, FormControl, MenuItem, Select, Snackbar, TextField } from "@mui/material";

function TruckEdit() {
  const { truckId } = useParams(); // Get truckId from URL parameters
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [openSnackBar, setOpenSnackbar] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    truck_number: "",
    vehicle_type: "",
    manufacturer: "",
    driver: "",
    trailer: "",
  });

  // State to track loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access_token')

  useEffect(() => {
    // Fetch truck details to prefill the form
    fetch(`https://maingi-demo-server.onrender.com/trucks/${truckId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch truck details");
        }
        return response.json();
      })
      .then((data) => {
        // Set the form data with the fetched truck details
        setFormData({
          truck_number: data.truck_number || "",
          vehicle_type: data.vehicle_type || "",
          manufacturer: data.manufacturer || "",
          driver: data.driver || "",
          contact: data.contact || "",
          trailer: data.trailer || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching truck details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [truckId, token]); // Dependency array: triggers the effect whenever truckId changes

  function handleChange(event) {
    const { name, value } = event.target; // Correct destructuring
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setPending(true)
    setOpenDialog(true)

    fetch(`https://maingi-demo-server.onrender.com/trucks/${truckId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Truck updated successfully:", data);
        // Navigate to the trucks page after successful update
        navigate(`/truck-edit/${truckId}`);

        setOpenDialog(false)
        setPending(false)
      })
      .catch((error) => {
        console.error("Error updating truck:", error);
        setOpenSnackbar(true)
        setErrorMessage("Failed to update vehicle. Please try again!")
      });
  }

  function handleCloseSnackbar(event, reason){
    if(reason === 'clickaway') return;
    setOpenDialog(false)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) return <p>Loading truck details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box>

      <Typography textAlign="center" fontSize="30px" fontWeight="bold" mt={'30px'}>
        EDIT VEHICLE
      </Typography>

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogContent sx={{display:'flex', alignItems:'center', gap:'20px'}}>
                      <CircularProgress sx={{fontSize:'10px'}}/>
                      <Typography fontFamily={'GT Bold'}>Updating...</Typography>
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
      <form style={{display:'flex', flexDirection:'column', margin:'30px'}} onSubmit={handleSubmit}>
        
        <FormControl>
          <Typography>VEHICLE TYPE</Typography>
          <Select
            name="vehicle_type"
            value={formData.vehicle_type}
            className="bill-inputfield"
            onChange={handleChange}
            sx={{mb:'20px'}}
          >
            <MenuItem value="">Select Vehicle Type</MenuItem>
            <MenuItem value="Heavy Commercial Vehicle">
              Heavy Commercial Vehicle
            </MenuItem>
            <MenuItem value="Light Commercial Vehicle">
              Light Commercial Vehicle
            </MenuItem>
          </Select>
        </FormControl>

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

        <Button sx={{width:'150px', fontFamily:"GT Bold"}} type="submit" disabled={pending} variant="contained" color="secondary">
            {pending ? "Updating...":"UPDATE VEHICLE"}
        </Button>
      </form>

      </Box>
    </Box>
  );
}

export default TruckEdit;
