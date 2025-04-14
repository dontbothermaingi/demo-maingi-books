import { Box, Button, Card, CardContent, Pagination, Typography, useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const FittedRetreadTyres = () => {
  const [tyres, setTyres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/retreadtyresremove', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const formattedTyres = data.map((tyre) => ({
          ...tyre,
          starting_mileage: new Intl.NumberFormat().format(tyre.starting_mileage),
          tyre_mileage: new Intl.NumberFormat().format(tyre.tyre_mileage),
          final_mileage: new Intl.NumberFormat().format(tyre.final_mileage)
        }));
  
        const availableTyres = formattedTyres.filter((tyre) => tyre.status === 'FITTED');
        setTyres(availableTyres);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, [token]);

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
      field: "date",
      headerName: "FITMENT DATE",
      flex: 0.2,
    },
  ];

  const totalPages = Math.ceil(tyres.length / itemsPerPage)
  const displayedItems = tyres.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

  return (
    <Box margin={{md:'40px', xs:'20px'}}>
            <Button
               type="button"
               variant="contained"
               color="secondary"
               onClick={()=> handleRetreadControl()}
               sx={{margin:'20px'}}
            >
                BACK
            </Button>

            <Box>

                      {isMobile ? (
                                <Box>
                                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>FITTED RETREAD TYRES</Typography>
                                <Box
                                    display={'grid'}
                                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                                    gap="20px"
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
                                                        <Typography  fontFamily={"GT Medium"} fontSize={'15px'}>Tyre Name:</Typography>
                                                        <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.name}</Typography>
                                                    </Box>

                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography  fontFamily={"GT Medium"} fontSize={'15px'}>Size:</Typography>
                                                        <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.size}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography  fontFamily={"GT Medium"} fontSize={'15px'}>Truck Number:</Typography>
                                                        <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.truck_number}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography  fontFamily={"GT Medium"} fontSize={'15px'}>Serial Number:</Typography>
                                                        <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.serial_number}</Typography>
                                                    </Box>
                                                        
                                                    
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography  fontFamily={"GT Medium"} fontSize={'15px'}>Position:</Typography>
                                                        <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.position}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography  fontFamily={"GT Medium"} fontSize={'15px'}>Status:</Typography>
                                                        <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.status}</Typography>
                                                    </Box>
                                                    

                                                    <Box display={'flex'} gap={'4px'}>
                                                        <Typography  fontFamily={"GT Medium"} fontSize={'15px'}>Date:</Typography>
                                                        <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.date}</Typography>
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
                                        rows={tyres}
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
};

export default FittedRetreadTyres;
