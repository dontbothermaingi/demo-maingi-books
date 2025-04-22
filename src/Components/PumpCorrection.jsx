import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField, Typography} from "@mui/material";


function PumpCorrections (){
    const {pumpId} = useParams()
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        pump_name: "",
        litres: "",
        reading:"",
      });

    useEffect(()=>{
        fetch(`https://maingi-demo-server.onrender.com/pumpnames/${pumpId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then((response) => {
            if(!response.ok){
                throw new Error('Failed to fetch pump details')
            }
            return response.json()
        })
        .then((data) => {
            setFormData({
                pump_name: data.pump_name || "",
                litres: data.litres || "",
                reading: data.reading || "",
            })
        })
    },[pumpId,token])

    function handleChange(event) {
        const { name, value } = event.target; // Correct destructuring
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`https://maingi-demo-server.onrender.com/pumpnames/${pumpId}`, {
            method:'PATCH',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            credentials:'include',
            body:JSON.stringify(formData)
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data,"Updated Successfully")
            navigate('/pump-reports')
        })
    }

    return ( 
        <Box>

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
                <Typography fontSize={'25px'} fontWeight={'bold'} textAlign={'center'}>PUMP CORRECTION</Typography>
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', margin:'30px'}}>
                    <TextField
                        type="text"
                        name="pump_name"
                        value={formData.pump_name}
                        label="Pump Name"
                        onChange={handleChange}
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <TextField
                        type="number"
                        label="Litres"
                        value={formData.litres}
                        placeholder="Litres"
                        onChange={handleChange}
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <TextField
                        type="number"
                        name="reading"
                        value={formData.reading}
                        label="Reading"
                        onChange={handleChange}
                        variant="outlined"
                        sx={{mb:'20px'}}
                    />

                    <Button type="submit" variant="contained" color="secondary">
                        UPDATE PUMP
                    </Button>
            </form>
            </Box>
        </Box>
     );
}
 
export default PumpCorrections;
