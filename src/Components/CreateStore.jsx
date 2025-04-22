import { Alert, Box, Button, Dialog, DialogContent, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function CreateStore (){

    const token = localStorage.getItem('access_token')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [openDialog, setOpenDialog] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState("")
    const [stores, setStores] = useState([])
    const [formData, setFormData] = useState({
        store_name:""
    })

    useEffect(() => {
        fetch('https://maingi-demo-server.onrender.com/store',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setStores(data)
        })
    },[token])

    function handleChange(event){
        const {name,value} = event.target
        const uppercasedValue = (name === 'store_name') ? value.toUpperCase() : value;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:uppercasedValue
        }))
    }

    function handleSubmit(event){
        event.preventDefault();

        if(!formData.store_name){
            setOpenSnackbar(true)
            setErrorMessage("Please fill in all the fields")
            return;
        }

        setLoading(true);
        setOpenDialog(true);

        fetch("https://maingi-demo-server.onrender.com/store", {
            method:"POST",
            headers:{
                'Authorization':`Bearer ${token}`,
                "Content-Type":'application/json'
            },
            body: JSON.stringify(formData),
            credentials:'include'
        })
        .then(response => {
            if (!response.ok){
                throw new Error(`Failed to fetch invoices. Status: ${response.status}`)
            }
            return response.json()
        })
        .then(() => {

            setOpenDialog(false);
            setLoading(false);

            setFormData({
                store_name:""
            })
        })
        .catch((error) => {
            console.error("Failed to create store", error)
            setOpenSnackbar(true)
            setErrorMessage("Failed to create store. Please try again!")
            setOpenDialog(false);
            setLoading(false)
        })
    }

    function handleCloseDialog(){
        setOpenDialog(!openDialog)
    }

    function handleCloseSnackbar(event, reason){
        if(reason === 'clickaway') return;
        setOpenSnackbar(false);
    }

    function handleStoreDetails(storeId){
        navigate(`/store-details/${storeId}`)
    }

    return ( 
        <Box>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    <Typography fontFamily={"GT Bold"}>Saving...</Typography>
                </DialogContent>
            </Dialog>
            
            <Snackbar
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes('Please') ? "error" : "success"} sx={{ width: '100%' }}>{errorMessage}</Alert>
            </Snackbar>

            <Box sx={{padding:'30px', backgroundColor:"#fff", boxShadow:'0 4px 20px rgba(0,0,0,0.1)', margin:{xs:'20px', md:'70px'}}}>
                <Typography fontFamily={"GT Bold"} textAlign={'center'} fontSize={{xs:'20px', md:'27px'}} mb={'20px'}>CREATE NEW STORE</Typography>
                <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column'}}>
                    <TextField 
                        value={formData.store_name}
                        name="store_name"
                        onChange={handleChange}
                        variant="outlined"
                        type="text"
                        label="Store Name"
                        sx={{mb:'20px'}}
                    />

                    <Button type="submit" variant="contained" disabled={loading} color="secondary" sx={{width:'150px', fontFamily:"GT Bold"}}>{loading ? "Saving..." : "Save"}</Button>
                </form>
            </Box>

            <Typography fontFamily={"GT Bold"} mt={'30px'} mb={'20px'} textAlign={'center'} fontSize={'27px'}>STORES</Typography>
            {stores.length > 0 ? (
            <Box display={'grid'} gridTemplateColumns={{xs:'repeat(1, 1fr)', md:'repeat(4, 1fr)'}} margin={'30px'} gap={'20px'}>
                {stores.map((store,index) => (
                    <Box key={index} sx={{backgroundColor:"purple", borderRadius:'15px'}} padding={'20px'} onClick={() => handleStoreDetails(store.id)}>
                        <Typography fontFamily={'GT Bold'} fontSize={{md:'30px', xs:'20px'}} color={'white'} textAlign={'center'}>{store.store_name}</Typography>
                    </Box>
                ))}
            </Box>
            ):(
                <Typography fontFamily={"GT Regular"} textAlign={'center'} mt={'30px'}>No stores have been created yet.</Typography>
            )}
        </Box>
     );
}
 
export default CreateStore;