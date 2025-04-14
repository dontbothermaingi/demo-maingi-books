import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogContent, FormControl, List, ListItem, ListItemText, MenuItem, Pagination, Select, Snackbar, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function OldTyres() {
    const [fittedTyres, setFittedTyres] = useState([]);
    const [serialNumberInput, setSerialNumberInput] = useState("");
    const [loading, setIsLoading] = useState(false)
    const [openDialog, setOpenDialog] =useState(false)
    const [openSnackBar, setOpenSnackbar] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const [suggestions, setSuggestions] = useState([]);
    const [formData, setFormData] = useState({
        item_details: "",
        serial_number: "",
        starting_mileage: "",
        size: "",
        truck_number: "",
        retread_counter: 0,
        reason: "",
        final_mileage: "",
        position: "",
        tyre_mileage:"",
        condition:"",
        status:"",
        date: "",
        retread_status:"",
    });

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/removetyres',{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const fitted = data.filter((tyre) => tyre.status === 'FITTED' )
                setFittedTyres(fitted);
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
        const filteredTyres = fittedTyres.filter(tyre => tyre.serial_number.toLowerCase().includes(input.toLowerCase()));
        setSuggestions(filteredTyres);
    }

    function handleSelectTyre(tyre) {
        setSerialNumberInput(tyre.serial_number);
        setSuggestions([]);
        setFormData(prevFormData => ({
            ...prevFormData,
            serial_number: tyre.serial_number,
            truck_number: tyre.truck_number,
            size: tyre.size,
            item_details: tyre.item_details,
            starting_mileage: tyre.starting_mileage,
            position: tyre.position,
        }));
    }

    function handleOldSubmit(event) {
        event.preventDefault();

        setIsLoading(true);
        setOpenDialog(true);

        const { starting_mileage, final_mileage } = formData;
        const starting = parseFloat(starting_mileage);
        const final = parseFloat(final_mileage);
        if (!isNaN(starting) && !isNaN(final)) {
            let tyreMileage = final - starting;
            if (tyreMileage < 0) {
                tyreMileage = Math.abs(tyreMileage);
            }
            const newFormData = { ...formData, tyre_mileage: tyreMileage };

            fetch('https://demo-server-757m.onrender.com/usedtyres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials:'include',
                body: JSON.stringify({
                    ...newFormData,
                    retread_counter: 0,
                    status:'Store',
                    retread_status:'NOT AVAILABLE'
                })
            })
                .then(response => {
                    if (response.ok) {
                        alert("Inventory updated successfully.");
                        return response.json();
                    }
                    throw new Error('Failed to add inventory');
                })
                .then(data => {

                    // Second PATCH request to update the status of the tyre in removetyres
                    console.log('Updating tyre status for serial number:', formData.serial_number);
                    
                    fetch(`https://demo-server-757m.onrender.com/removetyres/${formData.serial_number}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        credentials:'include',
                        body: JSON.stringify({
                            status: "UNFITTED"
                        })
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

                        setIsLoading(true);
                        setOpenDialog(true);

                        fetch('https://demo-server-757m.onrender.com/removetyres',{
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            const fitted = data.filter((tyre) => tyre.status === 'FITTED' )
                            setFittedTyres(fitted);
                        });

                        console.log(data); // Handle successful update if needed
                        event.target.reset();
                        setFormData({
                            item_details: "",
                            serial_number: "",
                            starting_mileage: "",
                            size: "",
                            reason: "",
                            truck_id: "",
                            final_mileage: "",
                            tyre_mileage: "",
                            condition:"",
                            position: "",
                            date: "",
                        });
                    })
                    .catch(error => {
                        console.error('Error updating tyre status:', error);
                        setIsLoading(false);
                        setOpenDialog(false);
                        setOpenSnackbar(true);
                        setErrorMessage("Failed to remove tyre. Please try again!")
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    setIsLoading(false);
                    setOpenDialog(false);
                    setOpenSnackbar(true);
                    setErrorMessage("Failed to remove tyre. Please try again!")
                });
        } else {
            alert("Please enter valid starting and final mileage values.");
        }
    }

    // Navigate to tyre control page
    const handleTyreContol = () => {
        navigate('/tyre-control');
    };

    const navigate = useNavigate()

    function handleCloseDialog(){
        setOpenDialog(!openDialog)
    }

    function handleCloseSnackbar(event, reason){
        if(reason === 'clickaway') return;
        setOpenDialog(false)
    }

    const columns = [
        // { field: "id", headerName: "ID", flex: 0.5 },
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
          field: "truck_number",
          headerName: "TRUCK NUMBER",
          flex: 0.3,
        },
        {
            field: "serial_number",
            headerName: "SERIAL NUMBER",
            flex: 0.3,
        },
        {
            field: "starting_mileage",
            headerName: "STARTING MILEAGE",
            flex: 0.3,
        },
        {
            field: "position",
            headerName: "POSITION",
            flex: 0.3,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.2,
        },
        {
            field: "date",
            headerName: "FITMENT DATE",
            flex: 0.2,
        },
        
      ];

      const totalPages = Math.ceil(fittedTyres.length / itemsPerPage)
      const displayedItems = fittedTyres.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    
        const handlePageChange = (event, value) => {
            setCurrentPage(value);
        };

    return (
        <Box margin={{ md:'40px', xs:'20px'}}>
            <Box>
                <Button type="button" variant="contained" color="secondary" onClick={handleTyreContol} sx={{margin:'30px'}}>
                    BACK
                </Button>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogContent sx={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <CircularProgress sx={{fontSize:'10px'}}/>
                        <Typography fontFamily={"GT Bold"}>Saving...</Typography>
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

                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>REMOVE TYRE FROM TRUCK</Typography>
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
                    <form style={{display:'flex', flexDirection:'column', margin:'30px'}} onSubmit={handleOldSubmit}>

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
                                    ))}
                            </List>

                            <TextField
                                type="text"
                                name="item_details"
                                label="Name"
                                value={formData.item_details}
                                inputProps={{readOnly:true}}
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <TextField
                                type="text"
                                name="truck_number"
                                label="Truck Number"
                                value={formData.truck_number}
                                inputProps={{readOnly:true}}
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            
                            <TextField
                                type="text"
                                name="size"
                                label="Tyre Size"
                                value={formData.size}
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
                                inputProps={{readOnly:true}}
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
                                value={formData.date}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />


                        <Button disabled={loading} type="submit" color="secondary" variant="contained" sx={{fontFamily:'GT Bold'}}>{loading ? "Unfitting..." : "UNFIT"}</Button>
                    </form>
                </Box>
            </Box>

            {isMobile ? (
                                <Box>
                                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mb={'30px'} mt={'30px'}>FITTED NEW TYRES</Typography>
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
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography>Tyre Name:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.item_details}</Typography>
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
                                                        
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
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
                                        FITTED NEW TYRES
                                    </Typography>
                                    <Box
                                        height="75vh"
                                    >
                                        <DataGrid
                                        rows={fittedTyres}
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

export default OldTyres;
