import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function EditSpare (){

    const access_token = localStorage.getItem('access_token')
    const {spareId} = useParams()
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [formData, setFormData] = useState({
        spare_subcategory_name :"",
        measurement : "",
        price : "",
        quantity : "",
    })

    useEffect(()=>{
        fetch(`https://demo-server-757m.onrender.com/sparesubcategories/${spareId}`, {
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
                spare_subcategory_name : data.spare_subcategory_name,
                measurement : data.measurement,
                price : data.price,
                quantity : data.quantity,
            })
        })
    },[access_token, spareId])

    function handleChange(event){
        const {name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`https://demo-server-757m.onrender.com/sparesubcategories/${spareId}`, {
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
                    name="spare_subcategory_name"
                    value={formData.spare_subcategory_name}
                    onChange={handleChange}
                    label="Spare Name"
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
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    label="Price"
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
 
export default EditSpare;