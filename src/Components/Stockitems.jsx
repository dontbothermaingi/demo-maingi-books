import { Box, Card, CardContent, Pagination, Typography, useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";


const Items = () => {
  const [diesel, setDiesel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const token = localStorage.getItem('access_token')

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/stockitems',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
    })
      .then(response => response.json())
      .then((data) => {
          setDiesel(data); // Assuming you want the first item from the data array
      });
  }, [token]);

  const columns = [
    {
      field: "item_details",
      headerName: "ITEM DETAILS",
      headerAlign: "left",
      cellClassName: "name-column--cell",
      flex: 0.2,
      align: "left",
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      flex: 0.3,
    },
  ];

      const totalPages = Math.ceil(diesel.length / itemsPerPage)
      const displayedItems = diesel.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

      const handlePageChange = (event, value) => {
          setCurrentPage(value);
      };

  return (
    <Box margin={{xs:'10px', md:'40px'}}>
      <Box>
            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>STOCK ITEMS</Typography>
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
                                    <Typography>Item Details:</Typography>
                                    <Typography fontWeight={'bold'}>{item.item_details}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Quantity:</Typography>
                                    <Typography fontWeight={'bold'}>{item.quantity}</Typography>
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
                       STOCK ITEMS
                 </Typography>
                 <Box
                   margin='auto'
                   mt='20px'
                   height="75vh"
                 >
                   <DataGrid
                     rows={diesel}
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
        </Box>
    </Box>
  );
};

export default Items;
