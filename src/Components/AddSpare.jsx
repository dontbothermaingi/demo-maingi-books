import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

function AddSpare(){
    const [spareCategories,setSpareCategories] = useState([])
    const [formData,setFormData] = useState({
        spare_category_name:"",
    })

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/sparecategories')
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            setSpareCategories(data)
        })
    },[])

    function handleFormDataChange(event){
        const{name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    function handleFormDataSubmit(event){
        event.preventDefault()

        fetch('https://db-demo-u07o.onrender.com/sparecategories', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {

            fetch('https://db-demo-u07o.onrender.com/sparecategories')
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                setSpareCategories(data)
            })

            
            console.log(data)
            setFormData({
                spare_category_name:"",
            })
        })
    }

    const columns = [
        {
            field:'id',
            headerName:'ID',
            flex: 0.2,
        },
        {
            field:'spare_category_name',
            headerName:'CATEGORY NAME',
            flex: 0.2,
        }
    ]


    return ( 
        <div>
                <div className="bill_content">
                <h2 className="h2">NEW SPARE CATEGORY</h2>    
                <form className="bill-form" onSubmit={handleFormDataSubmit}>

                <div className="bill-input">
                        <label>SPARE CATEGORY NAME</label>
                        <input
                            type="text"
                            name="spare_category_name"
                            value={formData.spare_category_name}
                            placeholder="Spare Name"
                            className="bill-inputfield"
                            onChange={handleFormDataChange}
                        />
                    </div>

                    <button type="submit" className="button">CREATE CATEGORY</button>
                </form>
                </div>

                <Box m="20px">
                    <Typography fontWeight='bold' variant="h5" textAlign='center'>
                        SPARE CATEGORIES
                    </Typography>
                    <Box
                        width='1000px'
                        ml='300px'
                        height="75vh"
                        sx={{
                            "& .MuiDataGrid-root": { border: "none" },
                            "& .MuiDataGrid-cell": { borderBottom: "none" },
                            "& .name-column--cell": {},
                            "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
                            "& .MuiDataGrid-virtualScroller": {},
                            "& .MuiDataGrid-footerContainer": { borderTop: "none" },
                            "& .MuiCheckbox-root": {},
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {}
                        }}
                    >
                        <DataGrid
                            rows={spareCategories}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Box>

        </div>
     );
}
 
export default AddSpare;