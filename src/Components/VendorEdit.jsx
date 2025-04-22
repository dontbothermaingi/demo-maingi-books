import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function VendorEdit (){

    const token = localStorage.getItem('access_token')
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [openSnackBar, setOpenSnackbar] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const {vendorId} = useParams()
    const [formData, setFormData] = useState({
        vendor_name : "",
        vendor_email : "",
        vendor_phone : "",
        opening_balance : "",
        kra_pin : "",
        currency : "",
        amount_paid : "",
        total_amount_owed : "",
    })

    useEffect(()=>{
        fetch(`https://maingi-demo-server.onrender.com/vendors/${vendorId}`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:"include"
        })
        .then(response => response.json())
        .then((data)=>{
            setFormData({
                vendor_name : data.vendor_name,
                vendor_email : data.vendor_email,
                vendor_phone : data.vendor_phone,
                opening_balance : data.opening_balance,
                currency : data.currency,
                kra_pin : data.kra_pin,
                amount_paid : data.amount_paid,
                total_amount_owed : data.total_amount_owed,
            })
        })
    },[vendorId, token])

    function handleChange(event){
        const{name,value}= event.target

        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    function handleSubmit(event){

        event.preventDefault();

        setLoading(true);
        setOpenDialog(true);
        
        fetch(`https://maingi-demo-server.onrender.com/vendors/${vendorId}`, {
            method:'PATCH',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok){
                throw new Error ('Failed to Update')
            }else{
                return response.json()
            }
        })
        .then(()=>{

            setFormData({
                vendor_name : "",
                vendor_email : "",
                vendor_phone : "",
                opening_balance : "",
                kra_pin : "",
                currency : "",
                amount_paid : "",
                total_amount_owed : "",
            })

            setLoading(false);
            setOpenDialog(false);
            navigate(`/vendors/${vendorId}`)
            
        })
        .catch((error) => {
            console.error("Failed to update vendor", error)
            setOpenSnackbar(true)
            setErrorMessage("Update failed. Please try again!")
        })
    }

    function handleCloseDialog(){
        setOpenDialog(false);
    }

    function handleCloseSnackbar(event, reason){
        if( reason === 'clickaway') return;
        setOpenSnackbar(false)
    }
    return ( 
        <Box>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogContent sx={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <CircularProgress sx={{fontSize:'10px'}}/>
                        <Typography fontFamily={"GT Bold"}>Updating...</Typography>
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

            <Typography textAlign={'center'} fontSize={'27px'} fontWeight={'bold'}>EDIT VENDOR</Typography>
            <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", margin:"20px"}}>
                <TextField 
                     name="vendor_name"
                     type="text"
                     value={formData.vendor_name}
                     onChange={handleChange}
                     label='Vendor Name'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="vendor_phone"
                     type="text"
                     value={formData.vendor_phone}
                     onChange={handleChange}
                     label='Vendor Phone'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="vendor_email"
                     type="text"
                     value={formData.vendor_email}
                     onChange={handleChange}
                     label='Vendor Email'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="opening_balance"
                     type="text"
                     value={formData.opening_balance}
                     onChange={handleChange}
                     label='Opening Balance'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="currency"
                     type="text"
                     value={formData.currency}
                     onChange={handleChange}
                     label='Currency'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="kra_pin"
                     type="text"
                     value={formData.kra_pin}
                     onChange={handleChange}
                     label='kRA Pin'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="amount_paid"
                     type="number"
                     value={formData.amount_paid}
                     onChange={handleChange}
                     label='Amount Paid'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="total_amount_owed"
                     type="number"
                     value={formData.total_amount_owed}
                     onChange={handleChange}
                     label='Amount Owed'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <Button disabled={loading} type="submit" variant="contained" color="secondary" sx={{width:"150px", fontFamily:'GT Bold'}}>{loading ? "Updating..." : "Update"}</Button>
            </form>

        </Box>
     );
}
 
export default VendorEdit;