import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

function TradingEdit(){

    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        category_name:"",
        amount:"",
        type_name:"",
        date:"",
    })

    function handleChange(event){
        const {name,value} = event.target

        setFormData(prev => ({
            ...prev,
            [name]:value,
        }))
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch('https://maingi-demo-server.onrender.com/tradingprofitandlossaccounts', {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify(formData),
            credentials:'include'
        })
        .then(response => {
            if (!response.ok){
                throw new Error('Failed to create new entry')
            }else{
                return response.json()
            }
        })
        .then((data) => {
            console.log(data)
        })
        .catch(error => {
            console.error("Failed to post", error)
        })
    }
    return ( 
        <Box>
            <Typography textAlign={'center'} fontWeight={'bold'} fontSize={'27px'}>EDIT TRADING PROFIT AND LOSS ACCOUNT</Typography>
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:"column", margin:'30px'}}>
                <TextField 
                     name="category_name"
                     type="text"
                     value={formData.category_name}
                     onChange={handleChange}
                     variant="outlined"
                     sx={{mb:"20px"}}
                />
                <TextField 
                     name="amount"
                     type="number"
                     value={formData.amount}
                     onChange={handleChange}
                     variant="outlined"
                     sx={{mb:"20px"}}
                />
                <TextField 
                     name="type_name"
                     type="text"
                     value={formData.type_name}
                     onChange={handleChange}
                     variant="outlined"
                     sx={{mb:"20px"}}
                />
                <TextField 
                     name="date"
                     type="date"
                     value={formData.date}
                     onChange={handleChange}
                     variant="outlined"
                     sx={{mb:"20px"}}
                />
                <Button variant="contained" color="secondary" type="submit">SAVE</Button>
            </form>

        </Box>
     );
}
 
export default TradingEdit;