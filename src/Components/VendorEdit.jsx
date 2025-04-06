import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function VendorEdit (){

    const token = localStorage.getItem('access_token')
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
        fetch(`https://db-demo-u07o.onrender.com/vendors/${vendorId}`, {
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

        event.preventDefault()
        
        fetch(`https://db-demo-u07o.onrender.com/vendors/${vendorId}`, {
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
        .then((data)=>{
            console.log(data)
        })
    }
    return ( 
        <Box>

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

                <Button type="submit" variant="contained" color="secondary">UPDATE</Button>
            </form>

        </Box>
     );
}
 
export default VendorEdit;