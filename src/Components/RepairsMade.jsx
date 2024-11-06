import { Box,Card,CardContent,Pagination,Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RepairMade(){
    const [repairs, setRepairs] = useState([]);
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')


    useEffect(()=>{
        fetch("https://db-demo-u07o.onrender.com/vehiclemantainances",{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
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
    },[token])

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
            field: "manufacturer",
            headerName: "MANUFACTURER",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.25,
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
            flex: 0.15,
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
            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>REPAIRS MADE</Typography>
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
                                    <Typography>Vehicle Number:</Typography>
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
                                    <Typography>Job Description:</Typography>
                                    <Typography fontWeight={'bold'}>{item.job_name}</Typography>
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
                       REPAIRS MADE
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
                     rows={repairs}
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
        </Box>
     );
}
 
export default RepairMade;