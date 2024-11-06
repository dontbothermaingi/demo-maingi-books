import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, FormControl, List, ListItem, ListItemText, MenuItem, Pagination, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function UnfitRetreadTyres() {
    const [fittedTyres, setFittedTyres] = useState([]);
    const [items, setItems] = useState([]);
    const [serialNumberInput, setSerialNumberInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [suggestions, setSuggestions] = useState([]);
    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        name: "",
        serial_number: "",
        starting_mileage: "",
        size: "",
        truck_number: "",
        reason: "",
        final_mileage: "",
        tyre_mileage: "",
        condition:"",
        position: "",
        date: "",
    });

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/retreadtyresremove',{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const fittedTyre = data.filter((tyre) => tyre.status === 'FITTED');
                setFittedTyres(data);
                setItems(fittedTyre);
            });
    }, [token]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSerialNumberInput(event) {
        const input = event.target.value;
        setSerialNumberInput(input);
        const fitted = fittedTyres.filter(
            tyre => tyre.status === 'FITTED' && tyre.serial_number.toLowerCase().includes(input.toLowerCase())
        );
        setSuggestions(fitted);
    }

    function handleSelectTyre(tyre) {
        setSerialNumberInput(tyre.serial_number);
        setSuggestions([]);
        setFormData(prevFormData => ({
            ...prevFormData,
            serial_number: tyre.serial_number,
            truck_number: tyre.truck_number,
            size: tyre.size,
            name: tyre.name,
            starting_mileage: tyre.starting_mileage,
            position: tyre.position,
        }));
    }

    function resetForm() {
        setFormData({
            name: "",
            serial_number: "",
            starting_mileage: "",
            size: "",
            truck_number: "",
            reason: "",
            final_mileage: "",
            tyre_mileage: "",
            condition:"",
            position: "",
            date: "",
        });
    }

    function handleOldSubmit(event) {
        event.preventDefault();
    
        const { starting_mileage, final_mileage } = formData;
        const starting = parseFloat(starting_mileage);
        const final = parseFloat(final_mileage);
        if (!isNaN(starting) && !isNaN(final)) {
            let tyreMileage = final - starting;
            if (tyreMileage < 0) {
                tyreMileage = Math.abs(tyreMileage);
            }
            const newFormData = { ...formData, tyre_mileage: tyreMileage };
    
            fetch('https://db-demo-u07o.onrender.com/unfitretreadtyres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials:'include',
                body: JSON.stringify(newFormData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to add inventory');
            })
            .then(data => {
                
                return fetch(`/retreadtyresremove/${formData.serial_number}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token},`
                    },
                    credentials:'include',
                    body: JSON.stringify({ status: "UNFITTED" })
                });
            })
            .then(response => {
                if (response.ok) {
                    alert("Inventory updated successfully.");
                    return response.json();
                } else {
                    throw new Error('Failed to update tyre status');
                }
            })
            .then(data => {
                event.target.reset();
                fetch('https://db-demo-u07o.onrender.com/retreadtyresremove',{
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const fittedTyre = data.filter((tyre) => tyre.status === 'FITTED');
                    setItems(fittedTyre);
                });
                resetForm();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert("Please enter valid starting and final mileage values.");
        }
    }

    const navigate = useNavigate()

    const handleRetreadControl = () => {
        navigate('/retread-tyres-control');
    };

    const columns = [
        { field: "name", headerName: "ITEM DETAILS", flex: 0.2, cellClassName: "name-column--cell" },
        { field: "size", headerName: "SIZE", headerAlign: "left", flex: 0.2, align: "left" },
        { field: "truck_number", headerName: "TRUCK NUMBER", flex: 0.3 },
        { field: "serial_number", headerName: "SERIAL NUMBER", flex: 0.3 },
        { field: "starting_mileage", headerName: "STARTING MILEAGE", flex: 0.3 },
        { field: "position", headerName: "POSITION", flex: 0.3 },
        { field: "date", headerName: "FITMENT DATE", flex: 0.2 },
    ];

      const totalPages = Math.ceil(items.length / itemsPerPage)
      const displayedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    
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
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>UNFIT RETREAD TYRE</Typography>

                <Box
                    sx={{
                        borderRadius: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'auto', // Adjust height for better flexibility
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        padding: '10px',
                        backgroundColor: '#fff',
                    }}
                >
                    <form style={{display:"flex", flexDirection:'column', margin:'30px'}} onSubmit={handleOldSubmit}>
                        
                            <TextField
                                type="text"
                                name="serial_number"
                                label="Serial Number"
                                value={serialNumberInput}
                                onChange={handleSerialNumberInput}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />
                        
                        <List>
                            {suggestions.map((tyre, index) => (
                                <div className="results" key={index}>
                                    <ListItem
                                        key={index}
                                        button
                                        onClick={() => handleSelectTyre(tyre)}
                                        sx={{ 
                                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" } // Hover effect
                                        }}
                                    >
                                       <ListItemText primary={tyre.serial_number} />
                                    </ListItem>
                                </div>
                            ))}
                        </List>

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
                                        name="truck_number"
                                        label="Truck Number"
                                        value={formData.truck_number}
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

                                    <TextField
                                        type="number"
                                        label="Starting Mileage"
                                        name="starting_mileage"
                                        value={formData.starting_mileage}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                                    <FormControl>
                                        <Typography fontWeight={'bold'}>Reason</Typography>
                                        <Select
                                            type="text"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            required
                                            sx={{mb:'20px'}}
                                        >
                                            <MenuItem value="">Select Reason</MenuItem>
                                            <MenuItem value="Tire Wear and Tread Depth">Tire Wear and Tread Depth</MenuItem>
                                            <MenuItem value="Damage or Punctures">Damage or Punctures</MenuItem>
                                            <MenuItem value="Tread Mismatch">Tread Mismatch</MenuItem>
                                            <MenuItem value="Burst">Burst</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <Typography fontWeight={'bold'}>Condition</Typography>
                                        <Select
                                            type="text"
                                            name="condition"
                                            value={formData.condition}
                                            onChange={handleChange}
                                            required
                                            sx={{mb:'20px'}}

                                        >

                                            <MenuItem value="">Select Condition</MenuItem>
                                            <MenuItem value="Good">Good</MenuItem>
                                            <MenuItem value="Bad">Bad</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        type="number"
                                        name="final_mileage"
                                        label="Final Mileage"
                                        value={formData.final_mileage}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        sx={{mb:'20px'}}
                                    />

                                    <Typography fontWeight={'bold'}>Date</Typography>
                                    <TextField
                                        type="date"
                                        name="date"
                                        className="bill-inputfield"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        sx={{mb:'20px'}}
                                    />

                        <Button type="submit" variant="contained" color="secondary">UNFIT</Button>
                    </form>
                </Box>
            </Box>

            {isMobile ? (
                                <Box>
                                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>FITTED RETREAD TYRES</Typography>
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
                                                        <Typography>Truck Number:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.truck_number}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography>Serial Number:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.serial_number}</Typography>
                                                    </Box>
                                                        
                                                    
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography>Position:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.position}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography>Status:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.status}</Typography>
                                                    </Box>
                                                    

                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography>Date:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.date}</Typography>
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
                                        FITTED RETREAD TYRES
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
    );
}

export default UnfitRetreadTyres;
