import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogContent, Pagination, Typography} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from "./Header";
import { useNavigate } from "react-router";

const Spares = () => {
  const [subSpares,setSubSpares] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate()

  const fetchSubSpares = () => {
    fetch('https://demo-server-757m.onrender.com/sparesubcategories', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const filtered = data.sort((a, b) => a.spare_subcategory_name.localeCompare(b.spare_subcategory_name));
        setSubSpares(filtered);
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  

  useEffect(() => {
    fetchSubSpares();
  }, [token]);
  

  const totalPages = Math.ceil(subSpares.length / itemsPerPage)
  const displayedItems = subSpares.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
  
    function handleDelete(id){

      setOpenDialog(true);

      fetch(`https://demo-server-757m.onrender.com/sparesubcategories/${id}`, {
        method:'DELETE',
        headers:{
          'Authorization':`Bearer ${token}`
        },
        credentials:"include"
      })
      .then(response => response.json())
      .then((data) => {
        console.log(data, 'Deleted Successfully')
        setOpenDialog(false)
        fetchSubSpares()
      })
      .catch((error) => {
        console.error("Failed to delete", error)
      })
    }

    function handleEdit(spareId){
      navigate(`/edit-spare/${spareId}`)
    }

    function handleCloseDialog(){
      setOpenDialog(!openDialog)
    }

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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.row.id)} // Pass the row ID to the handler
          variant="contained"
          color="secondary"
        >
          DELETE
        </Button>
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row.id)} // Pass the row ID to the handler
          variant="contained"
          color="secondary"
        >
          EDIT
        </Button>
      ),
    },
  ];

  return (
    
    <Box margin={'30px'}>
                      <Dialog open={openDialog} onClose={handleCloseDialog}>
                          <DialogContent sx={{display:'flex', alignItems:'center', gap:'20px'}}>
                              <CircularProgress sx={{fontSize:'10px'}}/>
                              <Typography fontFamily={"GT Bold"}>Deleting...</Typography>
                          </DialogContent>
                      </Dialog>
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
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Spare Name:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.spare_subcategory_name}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Quantity:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.quantity}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Measurement:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.measurement}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Date:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.date}</Typography>
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
