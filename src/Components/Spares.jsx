import { Box, Card, CardContent, Pagination, Typography} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from "./Header";

const Spares = () => {
  const [subSpares,setSubSpares] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('access_token')

  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/sparesubcategories',{
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
      .then(data => {
        console.log(data); // Check the data
        setSubSpares(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/sparesubcategories', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
    })
      .then(response =>  response.json())
      .then(data => {
        console.log(data);
        setSubSpares(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  const totalPages = Math.ceil(subSpares.length / itemsPerPage)
  const displayedItems = subSpares.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

  const columns = [
    {
      field: "spare_subcategory_name",
      headerName: "SPARE NAME",
      flex: 0.3,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.3,
    },
    {
      field: "measurement",
      headerName: "Unit of Measurements",
      flex: 0.3,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
    },
  ];

  return (
    
    <Box margin={'30px'}>
      {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>SPARES</Typography>
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
                                    <Typography>Spare Name:</Typography>
                                    <Typography fontWeight={'bold'}>{item.spare_subcategory_name}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Quantity:</Typography>
                                    <Typography fontWeight={'bold'}>{item.quantity}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Measurement:</Typography>
                                    <Typography fontWeight={'bold'}>{item.measurement}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
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
                   <Header
                      title="SPARES"
                      subtitle="List of all spares"
                    />

                    
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={subSpares}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      />
                  </Box>
                </Box>
              )}
    </Box>
  );
};

export default Spares;
