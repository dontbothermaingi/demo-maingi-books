import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, FormControl, MenuItem, Pagination, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";


function FitUsedTyre(){
    const [trucks,setTrucks] = useState([])
    const [retreadTyres, setRetreadTyres] = useState([]);
    const [availableRetreadTyres, setAvailableRetreadTyres] = useState([]);
    const token = localStorage.getItem('access_token')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
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
        .catch((error) => {
            console.error("Failed to post Tyre", error)
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

    const totalPages = Math.ceil(availableRetreadTyres.length / itemsPerPage)
    const displayedItems = availableRetreadTyres.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return ( 
        <Box>
            <Button
               variant="contained"
               color="secondary"
               onClick={()=> handleRetreadControl()}
               sx={{margin:'30px'}}
            >
                BACK
            </Button>
                
                    <Box>
                        <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>FIT USED TYRE</Typography>
                        <form style={{display:'flex', flexDirection:'column', margin:'30px'}} onSubmit={handleSubmit}>
                                    <FormControl>
                                        <Typography fontWeight={'bold'}>Serial Number</Typography>
                                        <Select
                                            type="text"
                                            name="serial_number"
                                            placeholder="Serial Number"
                                            className="bill-inputfield"
                                            value={formData.serial_number}
                                            onChange={handleSelectTyre}
                                            sx={{mb:'20px'}}
                                        >
                                            <MenuItem value="">Select Serial Number</MenuItem>
                                            {availableRetreadTyres.map((tyre,index)=>(
                                                <MenuItem key={index} value={tyre.serial_number}>{tyre.serial_number}</MenuItem>
                                            ))}
                                        </Select>
                                        </FormControl>
                                
                                    <TextField
                                        type="text"
                                        name="item_details"
                                        label="Name"
                                        value={formData.item_details}
                                        onChange={handleChange}
                                        inputProps={{readOnly:true}}
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                                    <TextField
                                        type="text"
                                        name="size"
                                        label="Tyre Size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        inputProps={{readOnly:true}}
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                                    <FormControl>
                                        <Typography fontWeight={'bold'}>Truck Number</Typography>
                                            <Select
                                                type="text"
                                                name="truck_number"
                                                placeholder="Truck Number"
                                                value={formData.truck_number}
                                                onChange={handleChange}
                                                sx={{mb:'20px'}}
                                            >
                                                <MenuItem value="">Select Truck Number</MenuItem>
                                                {trucks.map((truck,index)=>(
                                                    <MenuItem key={index} value={truck.truck_number}>{truck.truck_number}</MenuItem>
                                                ))}
                                            </Select>
                                    </FormControl>

                                    <TextField
                                        type="number"
                                        name="starting_mileage"
                                        label="Starting Mileage"
                                        value={formData.starting_mileage}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />
                                    <FormControl>
                                        <Typography fontWeight={'bold'}>Position</Typography>
                                        <Select value={formData.position} onChange={handleChange} name="position" sx={{mb:'20px'}}>
                                            <MenuItem value=''>Select Axle</MenuItem>
                                            {axel.map((axelOption, index) => (
                                                <MenuItem key={index} value={axelOption.axels}>
                                                    {axelOption.axels}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Typography fontWeight={'bold'}>DATE</Typography>
                                    <TextField
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                            <Button type="submit" variant="contained" color="secondary">FIT</Button>
                        </form>
                    </Box>

                    {isMobile ? (
                        <Box>
                        <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} marginTop={'30px'} marginBottom={'30px'}>AVAILABLE USED TYRES IN GOOD CONDITION</Typography>
                        <Box
                            display={'grid'}
                            gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                            gap="10px"
                            margin="0 10px"
                        >

                            {displayedItems.map((item) => (
                                <Card
                                    key={item.id}
                                    sx={{
                                        borderRadius: '15px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 'auto', // Adjust height for better flexibility
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        padding: '10px',
                                        backgroundColor: '#fff',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                            <Box display={'flex'} gap={'5px'}>
                                                <Typography>Tyre Name:</Typography>
                                                <Typography fontWeight={'bold'}>{item.item_details}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'5px'}>
                                                <Typography>Serial Number:</Typography>
                                                <Typography fontWeight={'bold'}>{item.serial_number}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'5px'}>
                                                <Typography>Size:</Typography>
                                                <Typography fontWeight={'bold'}>{item.size}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'5px'}>
                                                <Typography>Condition:</Typography>
                                                <Typography fontWeight={'bold'}>{item.condition}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'5px'}>
                                                <Typography>Status:</Typography>
                                                <Typography fontWeight={'bold'}>{item.status}</Typography>
                                            </Box>
                                    </CardContent>
                                </Card>
                            ))}
                            <Box display="flex" justifyContent="center" mt="20px">
                                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
                            </Box>
                        </Box>
                        </Box>
                        ) : (
                            <Box m="20px">
                            <Typography 
                                fontSize='30px'
                                fontWeight='bold'
                                textAlign='center'
                            >
                                AVAILABLE USED TYRES IN GOOD CONDITION
                            </Typography>
                            <Box
                                height="75vh"
                            >
                                <DataGrid
                                rows={availableRetreadTyres}
                                columns={columns}
                                components={{ Toolbar: GridToolbar }}
                                getRowId={(row) => row.id}
                                />
                            </Box>
                            </Box>
                        )}


        </Box>
     );
}
 
export default FitUsedTyre;