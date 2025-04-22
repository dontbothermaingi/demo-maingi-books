import { Box, Button, Card, CardContent, Pagination, Typography, useMediaQuery, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert, Dialog, DialogContent} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import '../Components/Invoicepdf/Invoicepage.css'; // Import your CSS file
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router";



const Items = () => {
  const [diesel, setDiesel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 29;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const token = localStorage.getItem('access_token')
  const componentRef = useRef();
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'STOCK ITEMS',
  });

  useEffect(() => {
    fetch('https://maingi-demo-server.onrender.com/stockitems', {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Authorization': `Bearer ${token}`
          }
    })
      .then(response => response.json())
      .then((data) => {

          const sorted = data.sort((a,b) => a.item_details.localeCompare(b.item_details))
          setDiesel(sorted); // Assuming you want the first item from the data array

      });
  }, [token]);

  function handleReload(){
    fetch('https://maingi-demo-server.onrender.com/stockitems', {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then((data) => {

          const sorted = data.sort((a,b) => a.item_details.localeCompare(b.item_details))
          setDiesel(sorted); // Assuming you want the first item from the data array

      });
  }

  function setPageItems (items,itemsPerPage){
    let Pages = []
    for(let i = 0; i < items.length; i += itemsPerPage){
      Pages.push(items.slice(i, i + itemsPerPage))
    }
    return Pages
  }

  const pages = setPageItems(diesel,itemsPerPage)

  function handleEdit(stockId){
    navigate(`/edit-stock/${stockId}`)
  }

  function handleDelete(id){

    setOpenDialog(true)
    setLoading(true)

    fetch(`https://maingi-demo-server.onrender.com/stockitems/${id}`,{
      method:"DELETE",
      headers:{
        "Authorization":`Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(()=> {

      handleReload()
      setLoading(false)
      setOpenDialog(false)
      setOpenSnackbar(true)
      setErrorMessage("Item deleted successfully!")
    })
    .catch((error) => {
      console.error('Failed Request', error)
      setOpenSnackbar(true)
      setErrorMessage("Delete failed. Please try again!")
    })
  }

  function handleCloseDialog(){
    setOpenDialog(!openDialog)
  }

  function handleCloseSnackBar(event, reason){
    if(reason === 'clickaway') return;
    setOpenSnackbar(false)
  }

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
    {
      field: "measurement",
      headerName: "MEASUREMENT",
      flex: 0.3,
    },
    {
      field: "store",
      headerName: "STORE",
      flex: 0.3,
    },
    {
      field: "Action",
      headerName: "EDIT",
      flex: 0.3,
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.id)}
          variant="contained"
        >
          EDIT
        </Button>
      )
    },
    {
      field: "Delete",
      headerName: "DELETE",
      flex: 0.3,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.id)}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      )
    },
    
  ];

      const totalPages = Math.ceil(diesel.length / itemsPerPage)
      const displayedItems = diesel.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

      const handlePageChange = (event, value) => {
          setCurrentPage(value);
      };

  return (
    <Box margin={{xs:'10px', md:'40px'}}>

        <Button variant="contained" color="secondary" onClick={handlePrint}>Print Stock Items</Button>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogContent>
                  <Typography fontFamily={"GT Bold"}>Deleting...</Typography>
              </DialogContent>
        </Dialog>

        <Snackbar
            open={openSnackbar} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackBar} 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={handleCloseSnackBar} severity={errorMessage.includes('Please') ? "error" : "success"} sx={{ width: '100%' }}>{errorMessage}</Alert>
        </Snackbar>
        
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
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Item Details:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.item_details}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Quantity:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.quantity}</Typography>
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

        <Box ref={componentRef} className="a4-print-mobile" padding='5mm'>
        
            <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>STOCK ITEMS FOR KOROGA HOTEL AND B&G CLUB</Typography>

            {pages.map((pageItems,pageIndex) => (
              <Box key={pageIndex} className="invoice-page" display='flex' flexDirection='column' height='92vh' justifyContent='space-between'>                  
                  {/* {Content Area} */}
                  <Box marginBottom='20px' mt={'30px'} className="table-container">
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize:'10px' }}>{column.headerName}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pageItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.item_details}</TableCell>
                              <TableCell>{item.measurement}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.store}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                  </Box>

            </Box>
            ))}
        </Box>

    </Box>
  );
};

export default Items;
