import { Alert, Box, Button, Dialog, DialogActions, DialogTitle, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function EditStock (){

    const access_token = localStorage.getItem('access_token')
    const {stockId} = useParams()
    const [name, setName] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
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

            setName(data.item_details)
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

        setLoading(true)

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

            setOpenDialog(true)
            setLoading(false)
            setSuccessMessage('Updated Successfully')
            setOpenSnackbar(true)
            setFormData({
                item_details:"",
                quantity:"",
                price:"",
                measurement:"",
                store:"",
            })
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

    function handleCloseDialog(){
        setOpenDialog(false)
    }

    function handleBack(){
        setOpenDialog(false)
        navigate("/stock-items")
    }

    return ( 
        <Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle sx={{fontFamily:"GT Regular"}}>{name} has been updated successfully!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleBack} color="primary">OK</Button>
                </DialogActions>
            </Dialog>

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

                <Typography fontFamily={"GT Regular"}>Store</Typography>
                <Select 
                    type="text"
                    name="store"
                    placeholder="Select Store"
                    value={formData.store}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{mb:'20px'}}
                >
                    <MenuItem value="KOROGA HOTEL">KOROGA HOTEL</MenuItem>
                    <MenuItem value="B&G CLUB">B&G CLUB</MenuItem>

                </Select>

                <TextField 
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    label="Price"
                    variant="outlined"
                    sx={{mb:'20px'}}
                />

                <Button color="secondary" variant="contained" type="submit" disabled={loading} sx={{fontFamily:'GT Bold', width:'150px'}}>{loading ? "Updating..." : "UPDATE"}</Button>
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