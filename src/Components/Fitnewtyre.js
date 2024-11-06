import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, FormControl, MenuItem, Pagination, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function Tyre() {
    const [trucks, setTrucks] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [tyreInventory, setTyreInventory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [selectedTyreItem, setSelectedTyreItem] = useState(null);
    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        item_details: "",
        size: "",
        truck_number: "",
        serial_number: "",
        starting_mileage: "",
        position: "",
        price: "",
        status: "FITTED",
        quantity: 1,
        date: ""
    });

    // Fetch tyre data and update state
    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/tyres',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then(data => {
                const sortedItems = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setItems(sortedItems);
                setTyreInventory(data);
            });
    }, [token]);

    // Fetch truck data and update state
    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/trucks', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then(data => setTrucks(data));
    }, [token]);

    // Update filtered tyres when size or inventory changes
    useEffect(() => {
        if (formData.size) {
            const filteredTyres = tyreInventory.filter(tyre => tyre.size === formData.size);
            setFilteredBanks(filteredTyres);
        } else {
            setFilteredBanks([]);
        }
    }, [formData.size, tyreInventory,token]);

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
    

    // Handle size selection
    function handleSelectSize(event) {
        const selectedSize = event.target.value;
        const selectedItem = tyreInventory.find(item => item.size === selectedSize);
        setSelectedTyreItem(selectedItem);
        setFormData(prevFormData => ({
            ...prevFormData,
            size: selectedSize,
            price: selectedItem ? selectedItem.price : ""
        }));
    }

    // Handle form data changes
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    // Handle form submission
    function handleSubmit(event) {
        
        event.preventDefault();

        fetch('https://db-demo-u07o.onrender.com/removetyres', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization':`Bearer ${token}` },
            credentials:'include',
            body: JSON.stringify({ ...formData, status: 'FITTED', price: formData.price})
        })
            .then(response => response.json())
            .then(() => {

                fetch('https://db-demo-u07o.onrender.com/tyres', {
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    },
                    credentials:'include',
                })
                .then(response => response.json())
                .then(data => {
                    const sortedItems = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setItems(sortedItems);
                    setTyreInventory(data);
                });
                
                event.target.reset();
                setFormData({
                    item_details: "",
                    size: "",
                    truck_number: "",
                    serial_number: "",
                    starting_mileage: "",
                    position: "",
                    price: "",
                    quantity: 1,
                    date: ""
                });
            })
            .catch(error => console.error('Error updating history:', error));
    }

    const navigate = useNavigate();

    // Navigate to tyre control page
    const handleTyreContol = () => {
        navigate('/tyre-control');
    };

    const columns = [
        { field: "item_details", headerName: "ITEM DETAILS", flex: 0.5 },
        { field: "quantity", headerName: "QUANTITY", flex: 0.5 },
        { field: "size", headerName: "SIZE", flex: 0.5 }
    ];

    const tyreSizes = [
        // Tyre sizes including motorcycle tyres
        "145/70R13", "155/65R14", "175/65R14", "185/60R15", "195/60R15",
        "205/55R16", "215/55R16", "225/50R17", "235/45R17", "245/40R18",
        "255/35R18", "265/30R19", "275/30R20", "205/70R15", "215/65R16",
        "225/60R17", "235/55R18", "245/55R19", "255/50R20", "275/45R20",
        "195/75R16", "215/75R16", "225/75R16", "235/75R16", "245/75R16",
        "265/75R16", "275/70R17", "285/70R17", "305/70R16", "315/70R17",
        "345/70R17", "385/65R22.5", "425/65R22.5", "295/80R22.5", "315/80R22.5",
        "345/80R22.5", "385/65R22.5", "425/65R22.5", "235/75R15", "245/75R16",
        "265/75R16", "275/70R17", "285/75R17", "315/75R16", "35x12.50R15",
        "37x12.50R17", "100/90-19", "110/80-19", "120/70-17", "130/70-17",
        "140/70-17", "150/60-17", "160/60-17", "180/55-17", "190/50-17",
        "200/50-17", "120/80-18", "140/80-18", "150/70-18", "160/70-17",
        "170/60-17"
    ];

    const totalPages = Math.ceil(items.length / itemsPerPage)
    const displayedItems = items.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box margin={{md:'40px', xs:'10px'}}>
            <Box>
                <Button type="button" variant="contained" color="secondary" onClick={handleTyreContol} sx={{margin:'30px'}}>
                    BACK
                </Button>
                <Box>
                    <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>FIT TYRE</Typography>
                
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
                        <form style={{display:'flex', flexDirection:'column', margin:'30px'}} onSubmit={handleSubmit}>
                            <FormControl>
                                <Typography fontWeight={'bold'}>Tyre Size</Typography>
                                <Select onChange={handleSelectSize} name="size" value={formData.size} sx={{mb:'20px'}}>
                                    <MenuItem value="">Select a Size</MenuItem>
                                    {tyreSizes.map(size => (
                                        <MenuItem key={size} value={size}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <Typography fontWeight={'bold'}>Tyre</Typography>
                                <Select onChange={handleChange} name="item_details" value={formData.item_details} sx={{mb:'20px'}}>
                                    <MenuItem value="">Select an item</MenuItem>
                                    {filteredBanks.map((item, index) => (
                                        <MenuItem key={index} value={item.item_details}>
                                            {item.item_details}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                                <TextField
                                    type="number"
                                    name="quantity"
                                    label="Quantity Removed"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    inputProps={{readOnly:true}}
                                    variant="outlined"
                                    sx={{mb:'20px'}}
                                />

                            <FormControl>
                                <Typography fontWeight={'bold'}>Truck Number</Typography>
                                <Select value={formData.truck_number} onChange={handleChange} name="truck_number" sx={{mb:'20px'}}>
                                    <MenuItem value="">Select a truck</MenuItem>
                                    {trucks.map(truck => (
                                        <MenuItem key={truck.id} value={truck.truck_number}>
                                            {truck.truck_number}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                                <TextField
                                    type="text"
                                    name="serial_number"
                                    label="Serial Number"
                                    value={formData.serial_number}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{mb:'20px'}}
                                />

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

                                <Typography fontWeight={'bold'}>Fitment Date</Typography>
                                <TextField
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{mb:'20px'}}
                                />

                            {selectedTyreItem && selectedTyreItem.quantity === 0 && <p>Tyre is out of stock.</p>}
                            <Button type="submit" variant="contained" color="secondary">FIT NEW TYRE</Button>
                        </form>
                    </Box>
                </Box>

                {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} marginTop={'30px'} marginBottom={'30px'}>NEW TYRES AVAILABLE</Typography>
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
                                        <Typography>Quantity:</Typography>
                                        <Typography fontWeight={'bold'}>{item.quantity}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Size:</Typography>
                                        <Typography fontWeight={'bold'}>{item.size}</Typography>
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
                      NEW TYRES AVAILABLE
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={items}
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

export default Tyre;
