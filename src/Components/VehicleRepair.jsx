import { Alert, Box,Button,Card,CardContent,CircularProgress,Dialog,DialogContent,Divider,FormControl,IconButton, List, ListItem, ListItemText, MenuItem, Pagination, Select, Snackbar, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddOutlined, DeleteForever } from "@mui/icons-material";

function VehicleRepair(){

    const [spareSubCategories, setSpareSubCategories] = useState([]);
    const [activeSpareIndex, setActiveSpareIndex] = useState(null);
    const [activeItem, setActiveItem] = useState(0)
    const [loading, setIsLoading] = useState(false)
    const [openDialog, setOpenDialog] =useState(false)
    const [openSnackBar, setOpenSnackbar] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [spareOptions, setSpareOptions] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [selectedSpare, setSelecetedSpare] = useState("");
    const [repairs, setRepairs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const token = localStorage.getItem('access_token')
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
            truck_number : "",
            vehicle_type : "",
            manufacturer: "",
            date : "",
            job_description : "",
            repair_number : "",
            items:[]
    })

    const [newItem, setNewItem] = useState([
        {
            spare_subcategory_name : "", 
            spare_category_name : "",
            price: "",
            job_name : "",
            position : "",
            quantity : "",
            mechanic : "",
        }
    ])

    function handleActiveItem(id){
        setActiveItem( activeItem === id ? null : id)
    }

    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/trucks',{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then((data) => {
            setTrucks(data)
        })
    },[token])


    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/sparesubcategories', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then((data) => {
            setSpareSubCategories(data)
        })
    },[token])

    useEffect(() => {
        fetch("https://demo-server-757m.onrender.com/vehiclemantainances", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
          .then((response) => response.json())
          .then((data) => {
            const combined = data.flatMap((vehicle) =>
              vehicle.items.map((item, index) => ({
                ...item,
                ...vehicle,
                id: `${vehicle.id}-${index}`, // Creating a unique id by combining vehicle id and item index
              }))
            );
    
            setRepairs(combined);
          });
      }, [token]);

    function handleSelectTruck(event) {
        const selectedValue = event.target.value;

        if (selectedValue === "new_vehicle") {
            navigate("/trucks");
            return;
        }

        const selectedTruck = trucks.find(truck => truck.truck_number === selectedValue);

        if (selectedTruck) {
            setFormData(prevFormData => ({
                ...prevFormData,
                truck_number: selectedTruck.truck_number,
                vehicle_type: selectedTruck.vehicle_type,
                manufacturer: selectedTruck.manufacturer,
            }));
        }
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
        { axels: "Trailer Axle Single Left" },
        { axels: "Trailer Axle Single Right" },
        { axels: "Trailer Axle Tandem Left" },
        { axels: "Trailer Axle Tandem Right" },
        { axels: "Trailer Axle Triple Left" },
        { axels: "Trailer Axle Triple Right" },
    ];


    function handleNewItemChange(event, index){
        const {name,value} = event.target
        const values = [...newItem]

        // Update the array based on index
        values[index] = {...values[index], [name]:value}

        // Assigning price a value
        if (name === "spare_subcategory_name"){
            const spareOptions = spareSubCategories.filter(spare => spare.spare_subcategory_name.toLowerCase().includes(value.toLowerCase()))
            setSpareOptions(spareOptions)
        }


        setNewItem(values);

        setFormData(prevformData => ({
            ...prevformData,
            items: values,
        }))
    }

    function handleSelectSpare(spare, index){
        const updatedItems = [...newItem]
        updatedItems[index].spare_subcategory_name = spare.spare_subcategory_name;
        updatedItems[index].price = spare.price;
        setNewItem(updatedItems)
        setSelecetedSpare(spare)

        setFormData(prevFormData => ({
            ...prevFormData,
            items: updatedItems
        }))

        setSpareOptions([])
        setActiveSpareIndex(null);
    }

    function handleNewInputField(){
        setNewItem([...newItem, {
            spare_subcategory_name : "", 
            spare_category_name : "",
            price: "",
            job_name : "",
            position : "",
            quantity : "",
            mechanic : "",
        }])

        setSelecetedSpare("")
        setSpareOptions([])
    }

    function handleDelete(index){
        const updatedItems = newItem.filter((_,i) => i !== index)

        setNewItem(updatedItems);

        setFormData(prevFormData => ({
            ...prevFormData,
            items: updatedItems
        }))
    }

    function handleChange(event){
        const{name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    const repairNumber = repairs.length + 1;

    function handleSubmit(event){
        event.preventDefault()

        setIsLoading(true);
        setOpenDialog(true);

        fetch('https://demo-server-757m.onrender.com/vehiclemantainances', {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
            credentials:'include',
            body:JSON.stringify({
                ...formData,
                repair_number: repairNumber,
            })
        })
        .then(response => response.json())
        .then((data) => {

                fetch("https://demo-server-757m.onrender.com/vehiclemantainances", {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                  .then((response) => response.json())
                  .then((data) => {
                    const combined = data.flatMap((vehicle) =>
                      vehicle.items.map((item, index) => ({
                        ...item,
                        ...vehicle,
                        id: `${vehicle.id}-${index}`, // Creating a unique id by combining vehicle id and item index
                      }))
                    );
            
                    setRepairs(combined);
                  });


            console.log(data)
            setFormData({
                truck_number : "",
                vehicle_type : "",
                manufatcurer:"",
                date : "",
                job_description : "",
                items:[],
            })

            setNewItem([
                {
                    spare_subcategory_name : "", 
                    spare_category_name : "",
                    price: "",
                    job_name : "",
                    position : "",
                    quantity : "",
                    mechanic : "",
                }
            ])

            setIsLoading(false);
            setOpenDialog(false);
        })
        .catch((error) => {
            console.error("Failed to Repair", error)
            setIsLoading(false);
            setOpenDialog(false);
            setOpenSnackbar(true);
            setErrorMessage("Failed to remove tyre. Please try again!")
        })
    }

    const handleRepairReport = (repairId) => {
        navigate(`/repair/${repairId}`);
      };

    const columns = [
        {
            field: "truck_number",
            headerName: "VEHICLE NUMBER",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.2,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
        {
            field: "job_description",
            headerName: "JOB TYPE", 
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.1,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
        {
          field: "spare_subcategory_name",
          headerName: "SPARE NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.3,
          align: "left",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleRepairReport(params.row.repair_number)}
          >
            <Typography
                variant="h7"
            >
              {params.value}
            </Typography>
          </Box>
          ),
        },
        {
            field: "mechanic",
            headerName: "MECHANIC",
            flex: 0.15,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
        {
          field: "quantity",
          headerName: "QUANTITY",
          flex: 0.15,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleRepairReport(params.row.repair_number)}
          >
            <Typography
                variant="h7"
            >
              {params.value}
            </Typography>
          </Box>
          ),
        },
        {
            field: "date",
            headerName: "DATE",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.4,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
    ];

      const totalPages = Math.ceil(repairs.length / itemsPerPage)
      const displayedItems = repairs.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

      const handlePageChange = (event, value) => {
          setCurrentPage(value);
      };


    function handleCloseDialog(){
        setOpenDialog(!openDialog)
    }

    function handleCloseSnackbar(event, reason){
        if(reason === 'clickaway') return;
        setOpenDialog(false)
    }

    return ( 

        <Box margin={{md:'40px', xs:'10px'}}>
            <Box>
                <Typography fontWeight={'bold'} fontSize={{xs:'20px', md:'30px'}} mb={'20px'} fontFamily={"GT Ultrabold"} textAlign={'center'}>VEHICLE REPAIR OR SERVICE</Typography>

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
                        <Typography fontWeight={'bold'}>TRUCK NUMBER</Typography>
                        <Select 
                            type="text"
                            name="truck_number"
                            value={formData.truck_number}
                            placeholder="Vehicle Number"
                            className="bill-inputfield"
                            onChange={handleSelectTruck}
                            sx={{mb:'20px'}}
                        >
                          <MenuItem value="">Select Vehicle</MenuItem>
                          {trucks.map((truck, index) => (
                                <MenuItem key={index} value={truck.truck_number}>{truck.truck_number}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                        <TextField
                            type="text"
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            label="Vehicle Type"
                            onChange={handleChange}
                            inputProps={{readOnly:true}}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />


                        <TextField
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            label="Manufacturer"
                            onChange={handleChange}
                            inputProps={{readOnly:true}}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                         <FormControl>
                            <Typography fontWeight={'bold'}>JOB</Typography>
                            <Select 
                                type="text"
                                name="job_description"
                                value={formData.job_description}
                                placeholder="Job Descrition"
                                onChange={handleChange}
                                sx={{mb:'20px'}}
                            >
                            <MenuItem value="">Select Job</MenuItem>
                            <MenuItem value="REPAIR">REPAIR</MenuItem>
                            <MenuItem value="SERVICE">SERVICE</MenuItem>

                            </Select>
                        
                        </FormControl>

                        <Typography fontWeight={'bold'}>DATE</Typography>
                        <TextField
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                    {selectedSpare ? <h2 className="OWE">THIS SPARE({selectedSpare.spare_subcategory_name}) HAS {new Intl.NumberFormat().format(selectedSpare.quantity)} {selectedSpare.measurement} LEFT.</h2> : ""}


                    {isMobile ? (
                        
                        <Box>
                             <Typography fontFamily={"GT Bold"} fontSize={'25px'} mt={'20px'}>SPECIFICS</Typography>
                             <Divider orientation="horizontal"/> 
                            <Box mt={'20px'}>
                                {newItem.map((item, index) => (
                                    <Box>
                                        <Box onClick={() => handleActiveItem(index)} sx={{backgroundColor:'purple', borderRadius:'5px', mb:'20px', cursor:'pointer',display:'flex', justifyContent:'center', padding:'5px'}}>
                                            <Typography sx={{cursor:'pointer'}} fontFamily={"GT Medium"} color={'white'}>Item {index}</Typography>
                                        </Box>
                                        {activeItem === index &&
                                            <Box key={index} display={'flex'} flexDirection={'column'} gap={'20px'} mb={'30px'}>

                                                <Box>
                                                    <Typography fontFamily={"GT Medium"}>JOB DESCRIPTION</Typography>
                                                    <TextField
                                                        name="job_name"
                                                        placeholder="Description"
                                                        value={item.job_name}
                                                        onChange={(e) => handleNewItemChange(e,index)}
                                                        variant="outlined"
                                                        sx={{minWidth:'300px'}}
                                                        multiline
                                                        minRows={4}  // Initial number of rows
                                                        maxRows={20}   // Maximum number of rows
                                                    />
                                                </Box>

                                                <Box>
                                                        <Typography fontFamily={"GT Medium"}>SELECT AXLE(If Needed)</Typography>
                                                        <Select value={item.position} onChange={(e) => handleNewItemChange(e,index)} name="position" sx={{minWidth:'280px'}} displayEmpty fullWidth>
                                                        <MenuItem value=''>Select Axle</MenuItem>
                                                        {axel.map((axelOption, index) => (
                                                            <MenuItem key={index} value={axelOption.axels}>
                                                                {axelOption.axels}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Box>


                                                <Box>
                                                    <Typography fontFamily={"GT Medium"}>SPARE NAME</Typography>
                                                    <Box sx={{position:'relative'}}>
                                                        <TextField 
                                                            type="text"
                                                            name="spare_subcategory_name"
                                                            value={item.spare_subcategory_name}
                                                            sx={{minWidth:'250px'}}
                                                            placeholder="Spare"
                                                            className="bill-inputfield"
                                                            onChange={(e) => handleNewItemChange(e,index)}
                                                            onFocus={() => setActiveSpareIndex(index)}
                                                            displayEmpty
                                                            fullWidth
                                                        />
                                                        
                                                        {activeSpareIndex === index && spareOptions.length > 0 && (
                                                            <List
                                                                sx={{
                                                                    // position:'absolute',
                                                                    height:'100px',
                                                                    overflow:'auto',
                                                                }}
                                                            >
                                                                {spareOptions.map((spare, spareIndex) => (
                                                                    <ListItem
                                                                        key={spareIndex}
                                                                        button
                                                                        onClick={() => handleSelectSpare(spare, index)}
                                                                    >
                                                                        <ListItemText primary={spare.spare_subcategory_name}/>
                                                                    </ListItem>
                                                                ))}
                                                            
                                                            </List>
                                                        )}
                                                        
                                                    </Box>
                                                </Box>

                                                <Box>
                                                    <Typography fontFamily={"GT Medium"}>QUANTITY</Typography>
                                                    <TextField
                                                        type="number"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        placeholder="quantity"
                                                        onChange={(e) => handleNewItemChange(e,index)}
                                                        variant="outlined"
                                                        sx={{minWidth:'150px'}}
                                                        inputProps={{
                                                            sx:{height: '35px'}
                                                        }}
                                                        size="small"
                                                        fullWidth
                                                    />
                                                </Box>

                                                <Box>
                                                    <Typography fontFamily={"GT Medium"}>MECHANIC</Typography>
                                                    <TextField
                                                        type="text"
                                                        name="mechanic"
                                                        value={item.mechanic}
                                                        placeholder="mechanic"
                                                        onChange={(e) => handleNewItemChange(e,index)}
                                                        variant="outlined"
                                                        inputProps={{
                                                            sx:{height: '35px'}
                                                        }}
                                                        sx={{minWidth:'150px'}}
                                                        size="small"
                                                        fullWidth
                                                    />
                                                </Box>

                                                <IconButton onClick={() => handleDelete(index)}>
                                                    <DeleteForever sx={{fontSize:'30px', color:'black', border:'2px solid red', padding:'10px', borderRadius:"8px", ":hover":{backgroundColor:'red', color:'white'}}}/>
                                                </IconButton>

                                            </Box>
                                        }
                                    </Box>

                                ))}

                                <Button onClick={handleNewInputField} variant="contained" style={{backgroundColor:'grey', color:'white', marginTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'20px'}}>
                                    <AddOutlined sx={{color:'white', fontSize:'19px'}}/>
                                    <Typography fontWeight={'bold'} fontSize={'12px'}>Add new row</Typography>
                                </Button>
                            </Box>
                        </Box>
                    ): (
                        <Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ minWidth: 350 }}><Typography fontWeight="bold">Repair Description</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Vehicle Axle(If Needed)</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Spare Name</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Quantity</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Mechanic</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>

                            <Box mt={'20px'}>
                                {newItem.map((item, index) => (
                                    <Box key={index} display={'flex'} alignItems={'center'} gap={'20px'} mb={'50px'}>

                                        <Box>
                                            <TextField
                                                name="job_name"
                                                placeholder="Description"
                                                value={item.job_name}
                                                onChange={(e) => handleNewItemChange(e,index)}
                                                variant="outlined"
                                                sx={{minWidth:'430px'}}
                                                multiline
                                                minRows={4}  // Initial number of rows
                                                maxRows={20}   // Maximum number of rows
                                            />
                                        </Box>

                                        <Box>
                                                <Select value={item.position} onChange={(e) => handleNewItemChange(e,index)} name="position" sx={{minWidth:'280px'}} displayEmpty fullWidth>
                                                <MenuItem value=''>Select Axle</MenuItem>
                                                {axel.map((axelOption, index) => (
                                                    <MenuItem key={index} value={axelOption.axels}>
                                                        {axelOption.axels}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>


                                            <Box sx={{ position: 'relative', minWidth: '250px' }}>
                                                <TextField 
                                                    type="text"
                                                    name="spare_subcategory_name"
                                                    value={item.spare_subcategory_name}
                                                    sx={{minWidth:'250px'}}
                                                    placeholder="Spare"
                                                    className="bill-inputfield"
                                                    onChange={(e) => handleNewItemChange(e,index)}
                                                    onFocus={() => setActiveSpareIndex(index)}
                                                    displayEmpty
                                                    fullWidth
                                                />
                                                    {activeSpareIndex === index && spareOptions.length > 0 && (
                                                        <List sx={{
                                                            position:'absolute',
                                                            height:'100px',
                                                            overflow:'auto'
                                                        }}>
                                                            {spareOptions.map((spare, spareIndex) => (
                                                                <ListItem
                                                                    key={spareIndex}
                                                                    button
                                                                    onClick={() => handleSelectSpare(spare, index)}
                                                                    sx={{ 
                                                                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" } // Hover effect
                                                                    }}
                                                                    value={spare.spare_subcategory_name}
                                                                >
                                                                    <ListItemText primary={spare.spare_subcategory_name} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    )}
                                                    
                                                
                                            </Box>

                                        <Box>
                                            <TextField
                                                type="number"
                                                name="quantity"
                                                value={item.quantity}
                                                placeholder="quantity"
                                                onChange={(e) => handleNewItemChange(e,index)}
                                                variant="outlined"
                                                sx={{minWidth:'150px'}}
                                                inputProps={{
                                                    sx:{height: '35px'}
                                                }}
                                                size="small"
                                                fullWidth
                                            />
                                        </Box>

                                        <Box>
                                            <TextField
                                                type="text"
                                                name="mechanic"
                                                value={item.mechanic}
                                                placeholder="mechanic"
                                                onChange={(e) => handleNewItemChange(e,index)}
                                                variant="outlined"
                                                sx={{minWidth:'150px'}}
                                                inputProps={{
                                                    sx:{height: '35px'}
                                                }}
                                                size="small"
                                                fullWidth
                                            />
                                        </Box>

                                        <IconButton onClick={() => handleDelete(index)}>
                                            <DeleteForever sx={{fontSize:'30px', color:'black', border:'2px solid red', padding:'10px', borderRadius:"8px", ":hover":{backgroundColor:'red', color:'white'}}}/>
                                        </IconButton>

                                    </Box>

                                ))}

                                <Button onClick={handleNewInputField} variant="contained" style={{backgroundColor:'grey', color:'white', marginTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'20px'}}>
                                    <AddOutlined sx={{color:'white', fontSize:'19px'}}/>
                                    <Typography fontWeight={'bold'} fontSize={'12px'}>Add new row</Typography>
                                </Button>
                            </Box>
                        </Box>
                    )}

                    <Button disabled={loading} type="submit" color="secondary" variant="contained" sx={{width:'200px', fontFamily:'GT Bold', mt:'40px'}}>{loading ? "Saving..." : "Save"}</Button>
                    
                </form>
                </Box>
            </Box>

            {isMobile ? (
                                <Box>
                                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} margin={'30px'}>ALL REPAIRS</Typography>
                                <Box
                                    display={'grid'}
                                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                                    gap="10px"
                                    margin="0 10px"
                                >

                                    {displayedItems.map((item) => (
                                        <Card
                                            key={item.id}
                                            onClick={() => handleRepairReport(item.repair_number)}
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
                                                <Box display={'flex'} gap={'3px'}>
                                                    <Typography>Vehicle:</Typography>
                                                    <Typography fontWeight={'bold'}>{item.truck_number}</Typography>
                                                </Box>

                                                <Box display={'flex'} gap={'3px'}>
                                                    <Typography>Manufacturer:</Typography>
                                                    <Typography fontWeight={'bold'}>{item.manufacturer}</Typography>
                                                </Box>
                                                
                                                <Box display={'flex'} gap={'3px'}>
                                                    <Typography>Job Type:</Typography>
                                                    <Typography fontWeight={'bold'}>{item.job_description}</Typography>
                                                </Box>
                                                
                                                <Box display={'flex'} gap={'3px'}>
                                                    <Typography>Spare:</Typography>
                                                    <Typography fontWeight={'bold'}>{item.spare_subcategory_name}</Typography>
                                                </Box>
                                                    
                                                
                                                <Box display={'flex'} gap={'3px'}>
                                                    <Typography>Mechanic:</Typography>
                                                    <Typography fontWeight={'bold'}>{item.mechanic}</Typography>
                                                </Box>
                                                
                                                <Box display={'flex'} gap={'3px'}>
                                                    <Typography>Quantity:</Typography>
                                                    <Typography fontWeight={'bold'}>{item.quantity}</Typography>
                                                </Box>
                                                

                                                <Box display={'flex'} gap={'3px'}>
                                                    <Typography>Job Description</Typography>
                                                    <Typography fontWeight={'bold'}>{item.job_name}</Typography>
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
                                        ALL REPAIRS
                                    </Typography>
                                    <Box
                                        height="75vh"
                                    >
                                        <DataGrid
                                        rows={repairs}
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
 
export default VehicleRepair;