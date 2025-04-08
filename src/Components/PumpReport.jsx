import { Box, Card, CardContent, Pagination, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PumpReport(){
    const [pumps, setPumps] = useState([]);
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')


    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/pumpnames', {
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
            }))
            setPumps(filtered);
        })
        .catch(error => {
            console.error("Error fetching pumps:", error);
        });
    }, [token]);

    const handlePumpReport = (pumpId) => {
        navigate(`/pumps/${pumpId}`);
      };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "PUMP",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            field: "litres",
            headerName: "Litres",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            field: "fuel_type",
            headerName: "Fuel Type",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            field: "reading",
            headerName: "Pump Reading",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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
            headerName: "Date",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.id)}
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

    const totalPages = Math.ceil(pumps.length / itemsPerPage)
    const displayedItems = pumps.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return ( 
        <Box margin={{md:'40px', xs:'20px'}}>
            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>PUMPS</Typography>
                    <Box
                        display={'grid'}
                        gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                        gap="10px"
                        margin="0 10px"
                    >
                        {displayedItems.map((item) => (
                            <Card
                            key={item.id}
                            onClick={() => handlePumpReport(item.id)}
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
                                    <Typography>Litres:</Typography>
                                    <Typography fontWeight={'bold'}>{item.litres}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Reading:</Typography>
                                    <Typography fontWeight={'bold'}>{item.reading}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Fuel Type:</Typography>
                                    <Typography fontWeight={'bold'}>{item.fuel_type}</Typography>
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
                       PUMPS
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
                     rows={pumps}
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
        </Box>
    );
}

export default PumpReport;
