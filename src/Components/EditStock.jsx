import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function EditStock (){

    const access_token = localStorage.getItem('access_token')
    const {stockId} = useParams()
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [formData, setFormData] = useState({
        item_details:"",
        quantity:"",
        price:"",
        measurement:"",
        store:"",
    })

    useEffect(()=>{
        fetch(`https://demo-server-757m.onrender.com/stockitems/${stockId}`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${access_token}`
            },
            credentials:"include"
        })
        .then(response => {
            if (!response.ok){
                throw new Error('Failed to fetch')
            }else{
                return response.json()
            }
        })
        .then((data)=>{
            setFormData({
                item_details: data.item_details,
                quantity: data.quantity,
                price: data.price,
                measurement: data.measurement,
                store:data.store,
            })
        })
    },[access_token, stockId])

    function handleChange(event){
        const {name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`https://demo-server-757m.onrender.com/stockitems/${stockId}`, {
            method:"PATCH",
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(!response.ok){
                throw new Error ('Failed to update stock item')
            }else{
                return response.json()
            }
        })
        .then((data) => {
            console.log(data)

            setSuccessMessage('Updated Successfully')
            setOpenSnackbar(true)
        })
        .catch(error => {
            console.error('Failed Request', error)
            setSuccessMessage('Failed to update')
            setOpenSnackbar(true)
        })
    }

    function handleCloseSnackbar (event, reason){
        if (reason === 'clickaway') return;
        setOpenSnackbar(false)
    }

    return ( 
        <Box>
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', margin:'20px'}}>
                <TextField 
                    type="text"
                    name="item_details"
                    value={formData.item_details}
                    onChange={handleChange}
                    label="Item Details"
                    variant="outlined"
                    sx={{mb:'20px'}}
                />

                <TextField 
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    label="Quantity"
                    variant="outlined"
                    sx={{mb:'20px'}}
                />

                <TextField 
                    type="text"
                    name="measurement"
                    value={formData.measurement}
                    onChange={handleChange}
                    label="Measurement"
                    variant="outlined"
                    sx={{mb:'20px'}}
                />

                <TextField 
                    type="text"
                    name="store"
                    value={formData.store}
                    onChange={handleChange}
                    label="Store"
                    variant="outlined"
                    sx={{mb:'20px'}}
                />

                <TextField 
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    label="Price"
                    variant="outlined"
                    sx={{mb:'20px'}}
                />

                <Button color="secondary" variant="contained" type="submit">UPDATE</Button>
            </form>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical:'top', horizontal:'center'}}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={successMessage.startsWith('Failed') ? "error" : "success"} 
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>

        </Box>
     );
}
 
export default EditStock;