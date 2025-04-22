import { Box, Button, Card, CardContent, Pagination, TextField,Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatBox from "./StatBox";
import PointOfSale from "@mui/icons-material/PointOfSale";
import ReactToPrint from "react-to-print";

function VatPayable (){
    const [vat, setVat] = useState([]);
    const componentRef = useRef();
    const [calculation, setCalculation] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [startDate,setStartDate] = useState(null)
    const [endDate,setEndDate] = useState(null)
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')

    function filterByDateRange(items,startDate,endDate){
        if (!startDate || !endDate) return items

        return items.filter((item)=>{
            const itemDate = new Date(item.invoice_date)
            return itemDate >= startDate && itemDate <= endDate;
        })
    }

    useEffect(() => {
      fetch('https://maingi-demo-server.onrender.com/invoices',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
      })
          .then(response => response.json())
          .then((data) => {

              const sort = data.sort((a,b) => b.id - a.id)
              // Assuming filterByDateRange is a function that filters data by date
              const filterDate = filterByDateRange(sort,startDate,endDate);
              
              // Flatten the structure so each item has its corresponding invoice data
              const all = filterDate.flatMap(invoice =>
                  invoice.items.map(item => ({
                      ...invoice,
                      ...item,
                      sub_total: new Intl.NumberFormat().format(item.sub_total.toFixed(2))
                  }))
              );

              const calculate = filterDate.flatMap(invoice =>
                invoice.items.map(item => ({
                    ...invoice,
                    ...item,
                }))
            );
              
              // Set the filtered and flattened data to state
              setVat(all);
              setCalculation(calculate);
          })
          .catch(error => console.error('Error fetching invoices:', error));
  }, [startDate, endDate, token]);
  

    function handleViewDetails(invoiceId){
        navigate(`/invoices/${invoiceId}`)
    }

    const calculateVat = calculation.reduce((total,item) => total + item.rate_vat,0)

    const invoices = [
        {
          field: "invoice_number",
          headerName: "Invoice Number",
          flex: 0.15,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.invoice_number)}
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
          field: "status",
          headerName: "Status",
          flex: 0.15,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.invoice_number)}
          >
            <Typography
              variant="h7"
            >
              {params.value}
            </Typography>
          </Box>
          ),
        },
        { field: "invoice_date", headerName: "Invoice Date", flex: 0.15 , renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ),},
        { field: "item_details", headerName: "ITEM", flex: 0.35, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
        { field: "quantity", headerName: "QUANTITY", flex: 0.15, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
        { field: "rate", headerName: "RATE", flex: 0.15, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ),},
        { field: "sub_total", headerName: "SUB TOTAL", flex: 0.15, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
        { field: "vat", headerName: "VAT", flex: 0.1, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
        { field: "rate_vat", headerName: "VAT AMOUNT", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
        { field: "amount", headerName: "AMOUNT", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewDetails(params.row.invoice_number)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
      ];

      const totalPages = Math.ceil(vat.length / itemsPerPage)
    const displayedItems = vat.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  
      const handlePageChange = (event, value) => {
          setCurrentPage(value);
      };

    return ( 
        <Box margin={{md:'40px', xs:'20px'}}>

          <Box margin={'20px'}>
            <Box>
              <Typography fontWeight='bold' fontSize='25px'>FILTER BY DATE</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                  <Box display={'flex'} gap={'20px'}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                  </Box>
                </LocalizationProvider>
            </Box>

          </Box>

          <Box>

                        <Box
                            display="grid"
                            gridTemplateColumns={{ xs:"repeat(1, 1fr)", md:"repeat(12, 1fr)"}}
                            gap="10px"
                            margin="0 10px"
                        >
                            <Box
                                gridColumn="span 3"
                                backgroundColor={ "#f2f0f0"}
                                borderRadius="10px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <StatBox
                                    title={`${new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(calculateVat)}`}
                                    subtitle="VAT PAYABLE"
                                    icon={
                                        <PointOfSale
                                            sx={{ color: "#4cceac", fontSize: "26px" }}
                                        />
                                    }
                                />
                            </Box>
                        </Box>

                        {isMobile ? (
                        <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>INVOICES</Typography>
                <Box
                    display={'grid'}
                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                    gap="10px"
                    margin="0 10px"
                >

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleViewDetails(item.invoice_number)}
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
                                            <Typography>Invoice Number:</Typography>
                                            <Typography  fontWeight={'bold'}>{item.invoice_number}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'4px'}>
                                            <Typography>Vat Amount:</Typography>
                                            <Typography fontWeight={'bold'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.rate_vat)}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'4px'}>
                                            <Typography>Currency:</Typography>
                                            <Typography fontWeight={'bold'}>{item.currency}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'4px'}>
                                            <Typography>Date:</Typography>
                                            <Typography fontWeight={'bold'}>{item.invoice_date}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'4px'}>
                                            <Typography>Status:</Typography>
                                            <Typography fontWeight={'bold'}>{item.status}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'4px'}>
                                            <Typography>Sales Person:</Typography>
                                            <Typography fontWeight={'bold'}>{item.sales_person}</Typography>
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

                            <Box>

                            <Box>
                                  <Box display="flex" justifyContent="center" mt="20px">
                                      <ReactToPrint
                                        trigger={() => (
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                              backgroundColor: "#a4a9fc",
                                              color: "#141414",
                                              '&:hover': {
                                                backgroundColor: "#6870fa",
                                              },
                                              padding: "10px 20px",
                                              fontSize: "16px",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Print
                                          </Button>
                                        )}
                                        content={() => componentRef.current}
                                      />
                                    </Box>
                            </Box>

                            <Box m="20px" ref={componentRef}>
                              <Typography 
                                  fontSize='30px'
                                  fontWeight='bold'
                                  textAlign='center'
                              >
                                  INVOICES
                              </Typography>
                              <Box
                                  height="75vh"
                              >
                                  <DataGrid
                                  rows={vat}
                                  columns={invoices}
                                  components={{ Toolbar: GridToolbar }}
                                  getRowId={(row) => row.id}
                                  />
                              </Box>
                            </Box>

                           

                            </Box>

                            
                          )}
          </Box>
                         
        </Box>
     );
}
 
export default VatPayable;