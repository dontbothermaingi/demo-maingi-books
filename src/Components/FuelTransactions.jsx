import { Box, Button, Card, CardContent, Pagination, Typography, useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

function FuelTransactions(){
    const [fuelings,setFuelings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')

    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/pumpfuelings', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {

            const filtered = data.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
                price: new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(pump.price),
            }))
            setFuelings(filtered)
        })
    },[token])

    function handleDelete(event) {
      event.preventDefault();
  
      // Loop through the range of IDs from 129 to 138
      for (let id = 450; id <= 451; id++) {
          fetch(`https://demo-server-757m.onrender.com/pumpfuelings/${id}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              credentials:'include'
          })
          .then(response => {
              if (response.ok) {
                  console.log(`Deleted transaction with ID ${id}`);
              } else {
                  console.log(`Failed to delete transaction with ID ${id}`);
              }
              return response.json();
          })
          .then(() => {
              // Refetch the data after each delete
              fetch('https://demo-server-757m.onrender.com/pumpfuelings', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
              })
                  .then(response => response.json())
                  .then((data) => {
                      const filtered = data.map(pump => ({
                          ...pump,
                          reading: new Intl.NumberFormat().format(pump.reading),
                          litres: new Intl.NumberFormat().format(pump.litres),
                          price: new Intl.NumberFormat().format(pump.price),
                      }));
                      setFuelings(filtered);
                  });
          })
          .catch((error) => {
              console.error(`Error deleting transaction with ID ${id}:`, error);
          });
      }
  }
  
    const columns = [
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
        field: "price",
        headerName: "Price",
        flex: 1,
      },
      {
            field: "date",
            headerName: "Date",
            flex: 1,
      },
    ];

    const totalPages = Math.ceil(fuelings.length / itemsPerPage)
    const displayedItems = fuelings.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return ( 
        <Box margin={{md:'40px', xs:'20px'}}>

          <Button
             onClick={handleDelete}
             sx={{display:'none'}}
          >
            DELETE
          </Button>
          
          {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={{xs:'23px', md:'30px'}} fontWeight={'bold'}>FUEL TRANSACTIONS</Typography>
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
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
        </Box>
     );
}
 
export default FuelTransactions;
