import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function CustomerEdit (){

    const token = localStorage.getItem('access_token')
    const {customerId} = useParams()
    const [formData, setFormData] = useState({
        customer_type : "",
        customer_name : "",
        company_name : "",
        customer_email : "",
        customer_phone : "",
        currency : "",
        kra_pin : "",
        amount_paid : "",
        payment_terms : "",
        total_amount_owed : "",
    })

    useEffect(()=>{
        fetch(`https://db-demo-u07o.onrender.com/customers/${customerId}`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:"include"
        })
        .then(response => response.json())
        .then((data)=>{
            setFormData({
                customer_type : data.customer_type,
                customer_name : data.customer_name,
                company_name : data.company_name,
                customer_email : data.customer_email,
                customer_phone : data.customer_phone,
                currency : data.currency,
                kra_pin : data.kra_pin,
                amount_paid : data.amount_paid,
                payment_terms : data.payment_terms,
                total_amount_owed : data.total_amount_owed,
            })
        })
    },[customerId, token])

    function handleChange(event){
        const{name,value}= event.target

        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    function handleSubmit(event){

        event.preventDefault()

        fetch(`https://db-demo-u07o.onrender.com/customers/${customerId}`, {
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

            <Typography textAlign={'center'} fontSize={'27px'} fontWeight={'bold'}>EDIT CUSTOMER</Typography>
            <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", margin:"20px"}}>
                <TextField 
                     name="customer_type"
                     type="text"
                     value={formData.customer_type}
                     onChange={handleChange}
                     label='Customer Type'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="customer_name"
                     type="text"
                     value={formData.customer_name}
                     onChange={handleChange}
                     label='Customer Name'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="company_name"
                     type="text"
                     value={formData.company_name}
                     onChange={handleChange}
                     label='company_name'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="customer_email"
                     type="text"
                     value={formData.customer_email}
                     onChange={handleChange}
                     label='Customer Email'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="customer_phone"
                     type="text"
                     value={formData.customer_phone}
                     onChange={handleChange}
                     label='Customer Phone'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="currency"
                     type="text"
                     value={formData.currency}
                     onChange={handleChange}
                     label='currency'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="kra_pin"
                     type="text"
                     value={formData.kra_pin}
                     onChange={handleChange}
                     label='kra_pin'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="amount_paid"
                     type="text"
                     value={formData.amount_paid}
                     onChange={handleChange}
                     label='Amount Paid'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="payment_terms"
                     type="text"
                     value={formData.payment_terms}
                     onChange={handleChange}
                     label='Payment Terms'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <TextField 
                     name="total_amount_owed"
                     type="text"
                     value={formData.total_amount_owed}
                     onChange={handleChange}
                     label='Total Amount Owed'
                     variant="outlined"
                     sx={{mb:'20px'}}
                />

                <Button type="submit" variant="contained" color="secondary">UPDATE</Button>
            </form>

        </Box>
     );
}
 
export default CustomerEdit;