import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./Fitretreadtyre.css"
import { useNavigate } from "react-router-dom";


function FitUsedTyre(){
    const [trucks,setTrucks] = useState([])
    const [retreadTyres, setRetreadTyres] = useState([]);
    const [availableRetreadTyres, setAvailableRetreadTyres] = useState([]);
    const token = localStorage.getItem('access_token')
    const [formData,setFormData] = useState({
        item_details : "",
        size : "",
        serial_number : "",
        truck_number : "",
        starting_mileage : "",
        status : "",
        position : "",
        date : "",
    })

    useEffect(() => {
        fetch('https://maingi-demo-server.onrender.com/usedtyres',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {
                const filteredData = data.filter(item => item.retread_status === 'NOT AVAILABLE' && item.condition === 'Good' && item.status === 'Store');
                setRetreadTyres(data);
                setAvailableRetreadTyres(filteredData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [token]);
    

    useEffect(()=>{
        fetch('https://maingi-demo-server.onrender.com/trucks', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setTrucks(data)
        })
    },[token])

    function handleChange(event){
        const {name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    function handleSubmit(event){
        event.preventDefault()
        fetch('https://maingi-demo-server.onrender.com/fitusedtyres', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials:'include',
            body:JSON.stringify({
                ...formData,
                status: "FITTED",
            })
        })
        .then(response => response.json())
        .then((data) => {

            fetch('https://maingi-demo-server.onrender.com/usedtyres', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
            .then(response => response.json())
            .then((data) => {
                const filteredData = data.filter(item => item.retread_status === 'NOT AVAILABLE' && item.condition === 'Good' && item.status === 'Store');
                setRetreadTyres(data)
                setAvailableRetreadTyres(filteredData)
            })

            setFormData({
                item_details : "",
                size : "",
                serial_number : "",
                truck_number : "",
                starting_mileage : "",
                status : "",
                position : "",
                date : "",
            })
        })
    }

    function handleSelectTyre(event){

        const selectedValue = event.target.value

        const selectedTyre = retreadTyres.find(tyre => tyre.serial_number === selectedValue)

        setFormData(prevFormData => ({
            ...prevFormData,
            serial_number : selectedTyre.serial_number,
            size : selectedTyre.size,
            item_details : selectedTyre.item_details,
        }))
    }

    const axel = [
        { axels: "Steering Axle Left" },
        { axels: "Steering Axle Right" },
        { axels: "Lift Axle Left" },
        { axels: "Lift Axle Right" },
        { axels: "First Drive Axle Left" },
        { axels: "First Drive Axle Right" },
        { axels: "Second Drive Axle Left" },
        { axels: "Second Drive Axle Right" },
        { axels: "Tag Axle Left" },
        { axels: "Tag Axle Right" },
        { axels: "Trailer First Axle Left" },
        { axels: "Trailer First Axle Right" },
        { axels: "Trailer Second Axle Left" },
        { axels: "Trailer Second Axle Right" },
        { axels: "Trailer Third Axle Left" },
        { axels: "Trailer Third Axle Right" },
    ];
    
    const navigate = useNavigate()

    const handleRetreadControl = () => {
        navigate('/used-tyres-control');
    };

    const columns = [
        {
            field: "item_details",
            headerName: "ITEM DETAILS",
            flex: 0.2,
            cellClassName: "name-column--cell",
        },
        {
            field: "size",
            headerName: "SIZE",
            headerAlign: "left",
            flex: 0.2,
            align: "left",
        },
        {
            field: "serial_number",
            headerName: "SERIAL NUMBER",
            flex: 0.25,
        },
        {
            field: "tyre_mileage",
            headerName: "MILEAGE",
            flex: 0.2,
        },
        {
            field: "condition",
            headerName: "CONDITION",
            flex: 0.25,
        },
        {
            field: "status",
            headerName: "STATUS",
            flex: 0.25,
        },

        
    ];

    return ( 
        <div>
            <button
               type="button"
               className="button"
               onClick={()=> handleRetreadControl()}
            >
                BACK
            </button>
                
                <div className="bill-content">

                    <div>
                        <h2 className="h2">FIT USED TYRE</h2>
                        <form className="bill-form" onSubmit={handleSubmit}>

                                <div className="bill-input">
                                    <label>Serial Number</label>
                                        <select
                                            type="text"
                                            name="serial_number"
                                            placeholder="Serial Number"
                                            className="bill-inputfield"
                                            value={formData.serial_number}
                                            onChange={handleSelectTyre}
                                        >
                                            <option value="">Select Serial Number</option>
                                            {availableRetreadTyres.map((tyre,index)=>(
                                                <option key={index} value={tyre.serial_number}>{tyre.serial_number}</option>
                                            ))}
                                        </select>
                                    </div>
                                
                            <div className="bill-input">
                                    <label>Tyre Brand</label>
                                    <input
                                        type="text"
                                        name="item_details"
                                        placeholder="Name"
                                        className="bill-inputfield"
                                        value={formData.item_details}
                                        onChange={handleChange}
                                        readOnly
                                    />
                            </div>

                            <div className="bill-input">
                                    <label>Tyre Size</label>
                                    <input
                                        type="text"
                                        name="size"
                                        placeholder="Tyre Size"
                                        className="bill-inputfield"
                                        value={formData.size}
                                        onChange={handleChange}
                                        readOnly
                                    />
                            </div>

                            <div className="bill-input">
                                    <label>Truck Number</label>
                                        <select
                                            type="text"
                                            name="truck_number"
                                            placeholder="Truck Number"
                                            className="bill-inputfield"
                                            value={formData.truck_number}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Truck Number</option>
                                            {trucks.map((truck,index)=>(
                                                <option key={index} value={truck.truck_number}>{truck.truck_number}</option>
                                            ))}
                                        </select>
                            </div>

                            <div className="bill-input">
                                    <label>Starting Mileage</label>
                            <input
                                type="number"
                                name="starting_mileage"
                                placeholder="Starting Mileage"
                                className="bill-inputfield"
                                value={formData.starting_mileage}
                                onChange={handleChange}
                                required
                            />
                            </div>

                            <div className="bill-input">
                            <label>Position</label>
                            <select value={formData.position} onChange={handleChange} name="position" className="bill-inputfield">
                                <option value=''>Select Axle</option>
                                {axel.map((axelOption, index) => (
                                    <option key={index} value={axelOption.axels}>
                                        {axelOption.axels}
                                    </option>
                                ))}
                            </select>
                        </div>

                            <div className="bill-input">
                                    <label>Fitment Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        placeholder="Date"
                                        className="bill-inputfield"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                            </div>

                            <button type="submit" className="button">FIT</button>
                        </form>
                    </div>

                        <Box m="20px">
                            <Typography
                            textAlign='center'
                            fontSize='30px'
                            fontWeight='bold'
                            >
                                AVAILABLE USED TYRES IN GOOD CONDITION
                            </Typography>
                                <Box
                                    m="40px 0 0 0"
                                    height="75vh"
                                    sx={{
                                    "& .MuiDataGrid-root": {
                                        border: "none",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        borderBottom: "none",
                                        // fontSize: "16px",  // Increase the font size of the data
                                    },
                                    "& .name-column--cell": {
                                        // color: colors.greenAccent[300],
                                    },
                                    "& .MuiDataGrid-columnHeaders": {
                                        // backgroundColor: colors.blueAccent[700],
                                        borderBottom: "none",
                                        // fontSize: "16px",  // Increase the font size of the header
                                    },
                                    "& .MuiDataGrid-virtualScroller": {
                                        // backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiDataGrid-footerContainer": {
                                        borderTop: "none",
                                        // backgroundColor: colors.blueAccent[700],
                                    },
                                    "& .MuiCheckbox-root": {
                                        // color: `${colors.greenAccent[200]} !important`,
                                    },
                                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                        // color: `${colors.grey[100]} !important`,
                                    },
                                    }}
                                >
                                    <DataGrid
                                    rows={availableRetreadTyres}
                                    columns={columns}
                                    components={{ Toolbar: GridToolbar }}
                                    getRowId={(row) => `${row.truck_number}-${row.size}-${row.item_details}-${row.position}-${row.date}-${row.serial_number}-${row.starting_mileage}`}
                                    />
                                </Box>
                        </Box>

                    </div>

        </div>
     );
}
 
export default FitUsedTyre;