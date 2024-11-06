import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, FormControl, MenuItem, Pagination, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function RetreadTyre(){
    const [trucks,setTrucks] = useState([])
    const [retreadTyres, setRetreadTyres] = useState([]);
    const [availableRetreadTyres, setAvailableRetreadTyres] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const [formData,setFormData] = useState({
        name : "",
        size : "",
        serial_number : "",
        truck_number : "",
        starting_mileage : "",
        status : "",
        position : "",
        date : "",
    })

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/retreadtyres', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            const filter = data.filter(item => item.status === 'AVAILABLE')
            setRetreadTyres(data)
            setAvailableRetreadTyres(filter)
        })
    },[token])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/trucks', {
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
        fetch('https://db-demo-u07o.onrender.com/retreadtyresremove', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            credentials:'include',
            body:JSON.stringify({
                ...formData,
                status: "FITTED",
            })
        })
        .then(response => response.json())
        .then((data) => {

            fetch('https://db-demo-u07o.onrender.com/retreadtyres', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
            .then(response => response.json())
            .then((data) => {
                const filter = data.filter(item => item.status === 'AVAILABLE')
                setRetreadTyres(data)
                setAvailableRetreadTyres(filter)
            })

            setFormData({
                name : "",
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
            name : selectedTyre.name,
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
        navigate('/retread-tyres-control');
    };

    const columns = [
        {
          field: "name",
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
          flex: 0.3,
        },
        {
          field: "tyre_mileage",
          headerName: "TYRE MILEAGE",
          flex: 0.2,
        },
        {
          field: "date",
          headerName: "FITMENT DATE",
          flex: 0.2,
        },
        {
          field: "status",
          headerName: "STATUS",
          flex: 0.15,
          display:"flex",
          justifyContent:"center",
        },
      ];

    const totalPages = Math.ceil(availableRetreadTyres.length / itemsPerPage)
    const displayedItems = availableRetreadTyres.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return ( 
        <Box margin={{md:'40px', xs:'20px'}}>
            <Button
               type="button"
               color="secondary"
               variant="contained"
               onClick={()=> handleRetreadControl()}
               sx={{margin:'20px'}}
            >
                BACK
            </Button>
                
                <Box>

                    <Box>
                        <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={'20px'} mb={'20px'}>FIT RETREAD TYRE</Typography>

                        <Box
                                sx={{
                                    borderRadius: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 'auto', // Adjust height for better flexibility
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    padding: '10px',
                                    backgroundColor: '#fff',
                                    // Media queries for responsive design
                                    '@media (max-width: 600px)': {
                                    padding: '5px', // Adjust padding for smaller screens
                                    },
                                    '@media (min-width: 600px)': {
                                    padding: '10px', // Keep padding for medium screens and above
                                    },
                                }}
                        >
                        <form style={{display:"flex", flexDirection:'column', margin:'30px'}} onSubmit={handleSubmit}>

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
                                        name="name"
                                        label="Name"
                                        value={formData.name}
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

                                    <Typography fontWeight={'bold'}>Date</Typography>
                                    <TextField
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                            <Button type="submit" color="secondary" variant="contained">FIT</Button>
                        </form>
                        </Box>
                    </Box>

                    {isMobile ? (
                        <Box>
                        <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>RETREAD TYRES AVAILABLE</Typography>
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
                                        // Media queries for responsive design
                                        '@media (max-width: 600px)': {
                                        padding: '5px', // Adjust padding for smaller screens
                                        },
                                        '@media (min-width: 600px)': {
                                        padding: '10px', // Keep padding for medium screens and above
                                        },
                                    }}
                                >
                                    <CardContent>
                                            <Box display={'flex'} gap={'4px'}>
                                                <Typography>Tyre Name:</Typography>
                                                <Typography fontWeight={'bold'}>{item.name}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'4px'}>
                                                <Typography>Size:</Typography>
                                                <Typography fontWeight={'bold'}>{item.size}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'4px'}>
                                                <Typography>Serial Number:</Typography>
                                                <Typography fontWeight={'bold'}>{item.serial_number}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'4px'}>
                                                <Typography>Tyre Mileage:</Typography>
                                                <Typography fontWeight={'bold'}>{item.tyre_mileage}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={'4px'}>
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
                                AVAILABLE RETREAD TYRES
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

        </Box>
     );
}
 
export default RetreadTyre;