import { useEffect, useState } from "react";
import { Box, Card, CardContent, Pagination, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function CreditNotesReport(){

    const [creditnotes,setCreditNote] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const navigate = useNavigate()

    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/creditnotes', {
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
        })
        .then(response=>response.json())
        .then(data => {
            const invoiceTotal = data.map((invoice) => {
                const totalAmount = new Intl.NumberFormat('en-KE',{style:'currency', currency:'KES'}).format(invoice.items.reduce((total, item) => total + item.amount, 0));
                return { ...invoice, totalAmount };

            })
            setCreditNote(invoiceTotal)
        })
    },[token])

    const handleViewDetails = (creditId) => {
        navigate(`/creditnotes/${creditId}`);
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "customer_name",
          headerName: "Customer Name",
          flex: 0.3,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "customer_email",
            headerName: "Customer Email",
            flex: 0.3,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "customer_phone",
            headerName: "Customer Phone",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "vendor_pin",
            headerName: "Customer Pin",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
          field: "credit_number",
          headerName: "Credit Note Number",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
          field: "credit_date",
          headerName: "Credit Note Date",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "totalAmount",
            headerName: "Total Amount",
            flex: 0.2,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.credit_number)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
    ]

      const totalPages = Math.ceil(creditnotes.length / itemsPerPage)
      const displayedItems = creditnotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

      const handlePageChange = (event, value) => {
        setCurrentPage(value);
      };

    return ( 
        <Box margin={{md:'40px', xs:'20px'}}>

            {isMobile ? (
                    <Box>
                        <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>CREDIT NOTES</Typography>
                        <Box
                            display={'grid'}
                            gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                            gap="10px"
                            margin="0 10px"
                        >

                            {displayedItems.map((item) => (
                                <Card
                                    key={item.id}
                                    onClick={() => handleViewDetails(item.credit_number)}
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
                                            <Typography>Customer Name:</Typography>
                                            <Typography fontWeight={'bold'}>{item.customer_name}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'4px'}>
                                            <Typography>Phone Number:</Typography>
                                            <Typography fontWeight={'bold'}>{item.customer_phone}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'4px'}>
                                            <Typography>Email:</Typography>
                                            <Typography fontWeight={'bold'}>{item.customer_email}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'4px'}>
                                            <Typography>KRA Pin:</Typography>
                                            <Typography fontWeight={'bold'}>{item.vendor_pin}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'4px'}>
                                            <Typography>Credit Note No:</Typography>
                                            <Typography fontWeight={'bold'}>#{item.credit_number}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'4px'}>
                                            <Typography>Date:</Typography>
                                            <Typography fontWeight={'bold'}>{item.credit_date}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'4px'}>
                                            <Typography>Amount:</Typography>
                                            <Typography fontWeight={'bold'}>{item.totalAmount}</Typography>
                                          </Box>
                                          
                                    </CardContent>

                                </Card>
                            ))}
                            <Box display="flex" justifyContent="center" mt="20px">
                                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
                            </Box>
                        </Box>
                    </Box>
                ):(
                    <Box m="20px">
                    <Typography 
                        fontSize='30px'
                        fontWeight='bold'
                        textAlign='center'
                    >
                        CREDIT NOTES
                    </Typography>
                    <Box
                        sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                            // fontSize: "16px",
                        },
                        "& .name-column--cell": {
                            // color: colors.greenAccent[300],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            // backgroundColor: colors.blueAccent[700],
                            borderBottom: "none",
                            // fontSize: "16px",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            // backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                            // backgroundColor: colors.blueAccent[700],
                        },
                        "& .MuiCheckbox-root": {
                            // color: `${colors.greenAccent[200]} !important`,
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            // color: `${colors.grey[100]} !important`,
                        },
                        }}
                    >
                        <DataGrid
                        rows={creditnotes}
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
 
export default CreditNotesReport;