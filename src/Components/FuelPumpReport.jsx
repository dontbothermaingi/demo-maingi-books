import { Box,Button,Card,CardContent,Pagination,Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FuelPumpReport(){
    const { pumpId } = useParams();
    const navigate = useNavigate()
    const [updates, setUpdates] = useState([])
    const [fuelings, setFuelings] = useState([])
    const [pumps,setPumps]=useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [currentFuelPage, setCurrentFuelPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')


    useEffect(() => {
        fetch(`https://demo-server-757m.onrender.com/pumpnames/${pumpId}`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            const filteredFuelings = data.fuelings.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
                price: new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(pump.price),

            }))
            const filteredUpdates = data.updates.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))

            const sort = filteredFuelings.sort((a,b) => b.id - a.id)
            setFuelings(sort)
            setUpdates(filteredUpdates);
            setPumps(data)
        })
        .catch(error => {
            console.error("Error fetching pumps:", error);
        });
    }, [pumpId,token]);

    const handleCustomBill = () => {
        navigate(`/fuel-control`);
      };
    
    const fuelupdates = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "Pump Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "litres",
            headerName: "Litres",
            flex: 1,
        },
        {
            field: "reading",
            headerName: "Reading",
            flex: 1,
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];

    const feultransactions = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "Pump Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "truck_number",
            headerName: "Truck Number",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "litres",
            headerName: "Litres",
            flex: 1,
        },
        {
            field: "reading",
            headerName: "Reading",
            flex: 1,
        },
        {
          field: "order",
          headerName: "Order",
          flex: 1,
      },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];

    const totalFuelPages = Math.ceil(fuelings.length / itemsPerPage)
    const displayedFuelItems = fuelings.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

    const totalPages = Math.ceil(updates.length / itemsPerPage)
    const displayedItems = updates.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleFuelPageChange = (event, value) => {
      setCurrentFuelPage(value);
  };
    return ( 
        <Box margin={{xs:'15px', md:'40px'}}>

          <Box display='flex' justifyContent='space-between' margin='10px'>
              <Button
                          type="button"
                          color="secondary"
                          variant="contained"
                          onClick={()=> handleCustomBill()}
                      >
                          BACK
              </Button>

            </Box>
            <Typography textAlign="center" mb={2} sx={{textDecoration:'underline'}}>
                    <Typography fontSize={'29px'} fontWeight={'bold'} textAlign={'center'}>{pumps.pump_name}</Typography>
            </Typography>
            <Typography textAlign="center" mb={2} >
                    <Typography className="OWE">The Pump Has { new Intl.NumberFormat().format(pumps.litres)} Litres of Fuel</Typography>
            </Typography>

            <Typography fontSize={'20px'} textAlign={'center'}>The Initial Reading of this Pump was {new Intl.NumberFormat().format(pumps.initial_reading)} </Typography>

            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>FUEL TRANSACTIONS</Typography>
                    <Box
                        display={'grid'}
                        gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                        gap="10px"
                        margin="0 10px"
                    >
                        {displayedFuelItems.map((item) => (
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
                                        <Typography>Pump:</Typography>
                                        <Typography fontWeight={'bold'}>{item.pump_name}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Truck:</Typography>
                                        <Typography fontWeight={'bold'}>{item.truck_number}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Litres:</Typography>
                                        <Typography fontWeight={'bold'}>{item.litres}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Reading:</Typography>
                                        <Typography fontWeight={'bold'}>{item.reading}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Fuel Attendant:</Typography>
                                        <Typography fontWeight={'bold'}>{item.order}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Price:</Typography>
                                        <Typography fontWeight={'bold'}>{item.price}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                        <Typography>Date:</Typography>
                                        <Typography fontWeight={'bold'}>{item.date}</Typography>
                                    </Box>
                                    
                                </CardContent>

                            </Card>
                        ))}

                    </Box>

                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={totalFuelPages} page={currentFuelPage} onChange={handleFuelPageChange} color="primary" />
                    </Box>
                </Box>
            ):(
                 <Box m="20px" mt='50px'>
                 <Typography fontWeight="bold" variant="h5" textAlign="center">
                       NUMBER OF FUEL TRANSACTIONS
                 </Typography>
                 <Box
                   margin='auto'
                   mt='20px'
                   height="75vh"
                   // width="1000px"
                   sx={{
                     "& .MuiDataGrid-root": {
                       border: "none",
                     },
                     "& .MuiDataGrid-cell": {
                       borderBottom: "none",
                     },
                     "& .name-column--cell": {},
                     "& .MuiDataGrid-columnHeaders": {
                       borderBottom: "none",
                     },
                     "& .MuiDataGrid-virtualScroller": {},
                     "& .MuiDataGrid-footerContainer": {
                       borderTop: "none",
                     },
                     "& .MuiCheckbox-root": {},
                     "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
                   }}
                 >
                   <DataGrid
                     rows={fuelings}
                     columns={feultransactions}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}

            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'} mt={'30px'}>PUMP UPDATES</Typography>
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
                                      <Typography>Pump:</Typography>
                                      <Typography fontWeight={'bold'}>{item.pump_name}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'4px'}>
                                      <Typography>Litres:</Typography>
                                      <Typography fontWeight={'bold'}>{item.litres}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'4px'}>
                                      <Typography>Reading:</Typography>
                                      <Typography fontWeight={'bold'}>{item.reading}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'4px'}>
                                      <Typography>Date:</Typography>
                                      <Typography fontWeight={'bold'}>{item.date}</Typography>
                                    </Box>

                                </CardContent>

                            </Card>
                        ))}

                    </Box>

                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
                    </Box>
                </Box>
            ):(
                 <Box m="20px" mt='50px'>
                 <Typography fontWeight="bold" variant="h5" textAlign="center">
                       PUMP UPDATES
                 </Typography>
                 <Box
                   margin='auto'
                   mt='20px'
                   height="75vh"
                   // width="1000px"
                   sx={{
                     "& .MuiDataGrid-root": {
                       border: "none",
                     },
                     "& .MuiDataGrid-cell": {
                       borderBottom: "none",
                     },
                     "& .name-column--cell": {},
                     "& .MuiDataGrid-columnHeaders": {
                       borderBottom: "none",
                     },
                     "& .MuiDataGrid-virtualScroller": {},
                     "& .MuiDataGrid-footerContainer": {
                       borderTop: "none",
                     },
                     "& .MuiCheckbox-root": {},
                     "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
                   }}
                 >
                   <DataGrid
                     rows={updates}
                     columns={fuelupdates}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}

        </Box>
     );
}
 
export default FuelPumpReport;
