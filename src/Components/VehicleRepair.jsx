import { Box,Button,Card,CardContent,FormControl,IconButton, MenuItem, Pagination, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close'; 

function VehicleRepair(){

    const [spareSubCategories, setSpareSubCategories] = useState([]);
    const [trucks, setTrucks] = useState([]);
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

    const [newItem, setNewItem] = useState({
        spare_subcategory_name : "", 
        spare_category_name : "",
        price: "",
        job_name : "",
        position : "",
        quantity : "",
        mechanic : "",
    })


    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/trucks',{
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
        fetch('https://db-demo-u07o.onrender.com/sparesubcategories', {
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
        fetch("https://db-demo-u07o.onrender.com/vehiclemantainances", {
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

    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
    }

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

    function handleSelectSpare(event){
        const selectedValue = event.target.value

        const selectedSpare = spareSubCategories.find(item => item.spare_subcategory_name === selectedValue)

        if (selectedSpare) {
            setNewItem(prevNewItem => ({
                ...prevNewItem,
                spare_subcategory_name: selectedSpare.spare_subcategory_name,
                price: selectedSpare.price
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
    const selectedSpare = spareSubCategories.find(item => item.spare_subcategory_name === newItem.spare_subcategory_name)

    function addItem() {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, newItem]
        }));
        setNewItem({ job_name: "",position:"", spare_subcategory_name : "", spare_category_name : "", quantity : "", mechanic:"", });
    }

    function handleNewItemChange(event){
        const {name,value} = event.target

        setNewItem(prevNewItem => ({
            ...prevNewItem,
            [name]:value,
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
        fetch('https://db-demo-u07o.onrender.com/vehiclemantainances', {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
            credentials:'include',
            body:JSON.stringify({
                ...formData,
                repair_number: repairNumber,
                price: newItem.price
            })
        })
        .then(response => response.json())
        .then((data) => {

                fetch("https://db-demo-u07o.onrender.com/vehiclemantainances", {
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
            field: "vehicle_type",
            headerName: "VEHICLE TYPE",
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
            field: "job_name",
            headerName: "JOB DESCRIPTION",
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

    return ( 

        <Box margin={{md:'40px', xs:'10px'}}>
            <Box>
                <Typography fontWeight={'bold'} fontSize={'27px'} textAlign={'center'}>VEHICLE REPAIR OR SERVICE</Typography>

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

                    {newItem.spare_subcategory_name ? <h2 className="OWE">THIS SPARE HAS {new Intl.NumberFormat().format(selectedSpare.quantity)} {selectedSpare.measurement} LEFT.</h2> : ""}


                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ minWidth: 430  }}><Typography fontWeight="bold">Repair Description</Typography></TableCell>
                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Vehicle Axle(If Needed)</Typography></TableCell>
                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Spare Name</Typography></TableCell>
                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Quantity</Typography></TableCell>
                                    <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Mechanic</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formData.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.job_name}</TableCell>
                                        <TableCell>{item.position}</TableCell>
                                        <TableCell>{item.spare_subcategory_name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.mechanic}</TableCell>
                                        <TableCell>
                                            <IconButton 
                                                color="error"
                                                onClick={() => handleDeleteItem(index)}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>

                                    
                                    <TableCell>
                                        <TextField
                                            name="job_name"
                                            placeholder="Description"
                                            value={newItem.job_name}
                                            onChange={handleNewItemChange}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={4}  // Initial number of rows
                                            maxRows={20}   // Maximum number of rows
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Select value={newItem.position} onChange={handleNewItemChange} name="position" displayEmpty fullWidth>
                                            <MenuItem value=''>Select Axle</MenuItem>
                                            {axel.map((axelOption, index) => (
                                                <MenuItem key={index} value={axelOption.axels}>
                                                    {axelOption.axels}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    

                                    <TableCell>
                                        <Select 
                                            type="text"
                                            name="spare_subcategory_name"
                                            value={newItem.spare_subcategory_name}
                                            placeholder="Spare"
                                            className="bill-inputfield"
                                            onChange={handleSelectSpare}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="">Select Spare</MenuItem>
                                            {spareSubCategories.map((spare, index) => (
                                                    <MenuItem key={index} value={spare.spare_subcategory_name}>{spare.spare_subcategory_name}</MenuItem>
                                                ))}
                                        </Select>
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            type="number"
                                            name="quantity"
                                            value={newItem.quantity}
                                            placeholder="quantity"
                                            onChange={handleNewItemChange}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            type="text"
                                            name="mechanic"
                                            value={newItem.mechanic}
                                            placeholder="mechanic"
                                            onChange={handleNewItemChange}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                            <Button type="button" color="secondary" variant="contained" onClick={addItem} sx={{mt:'20px', mb:'20px'}}>Add Repair/Service</Button>
                    </TableContainer>

                    <Button type="submit" color="secondary" variant="contained" >REPAIR</Button>
                    
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