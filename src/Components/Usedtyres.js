import { useEffect, useState } from "react";
import { Box, Card, CardContent, Pagination, Typography, useMediaQuery } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function CheckUsedTyre() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        // Fetch used tyres
        fetch('https://maingi-demo-server.onrender.com/usedtyres', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const formatted = data.map(item => {
                    const date = new Date(item.date);
                    const formattedDate = 
                        ('0' + date.getDate()).slice(-2) + '/' + 
                        ('0' + (date.getMonth() + 1)).slice(-2) + '/' + 
                        date.getFullYear(); // Format to dd/mm/yyyy
    
                    return {
                        ...item,
                        tyre_mileage: new Intl.NumberFormat().format(item.tyre_mileage), // Format tyre mileage
                        date: formattedDate // Set formatted date
                    };
                });

                const filter = formatted.filter(item => item.retread_status === 'NOT AVAILABLE')
                setItems(filter); // Set formatted data to state
            })
            .catch(error => console.error('Error fetching tyres:', error));
    }, [token]);    


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
            field: "truck_number",
            headerName: "TRUCK NUMBER",
            flex: 0.25,
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
            field: "retread_counter",
            headerName: "RETREAD COUNTER",
            flex: 0.23,
        },
        {
            field: "position",
            headerName: "POSITION",
            flex: 0.2,
        },
        {
            field: "status",
            headerName: "STATUS",
            flex: 0.25,
        },
        {
            field: "date",
            headerName: "FITMENT DATE",
            flex: 0.2,
        },
        
    ];

    const totalPages = Math.ceil(items.length / itemsPerPage)
    const displayedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  
      const handlePageChange = (event, value) => {
          setCurrentPage(value);
      };

    return (
        <Box margin={{md:'40px', xs:'20px'}}>
            
            {isMobile ? (
                                <Box>
                                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>USED TYRES</Typography>
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
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Tyre Name:</Typography>
                                                        <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.item_details}</Typography>
                                                    </Box>

                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Size:</Typography>
                                                        <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.size}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Truck Number:</Typography>
                                                        <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.truck_number}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Serial Number:</Typography>
                                                        <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.serial_number}</Typography>
                                                    </Box>
                                                        
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Retread Counter:</Typography>
                                                        <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.retread_counter}</Typography>
                                                    </Box>

                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Position:</Typography>
                                                        <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.position}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Status:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.status}</Typography>
                                                    </Box>
                                                    

                                                    <Box display={'flex'} gap={'7px'}>
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
                                        USED TYRES
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

export default CheckUsedTyre;
