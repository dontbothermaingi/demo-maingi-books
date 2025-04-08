import { Box, Card, CardContent, Pagination, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatBox from "./StatBox";
import PointOfSale from "@mui/icons-material/PointOfSale";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

function SalesReport (){

  const [sales, setSales] = useState([])
  const [all, setAll] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')

  const filterByDateRange = (items, startDate, endDate) => {
    if (!startDate || !endDate) return items; // No filter if dates are not set

    return items.filter(item => {
        const itemDate = new Date(item.bill_date); // Converts the string to a Date object
        return itemDate >= startDate && itemDate <= endDate;
    });
  };

  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/newbills',{
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
        .then(response => response.json())
        .then((data) => {
            const sort = data.sort((a,b) => b.id - a.id)
            const datefilter = filterByDateRange(sort, startDate, endDate)
            const invoiceTotal = datefilter.map((invoice) => {
                const totalAmount = (invoice.items.reduce((total, item) => total + item.amount, 0));
                return { ...invoice, totalAmount };

            })

            const all = data.flatMap(bill => 
                bill.items.map((item) => ({
                    ...bill,
                    ...item
                })))
            setSales(invoiceTotal);
            setAll(all)
        });
}, [startDate,endDate,token]);

  const total = all.reduce((total,item) => total + item.amount, 0)

  const handleViewDetails = (billId) => {
    navigate(`/newbills/${billId}`);
  };

const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
      field: "bill_date",
      headerName: "Bill Date",
      flex: 0.2,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
      field: "payment_terms",
      headerName: "Payment Terms",
      flex: 0.2,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
        flex: 0.2,
        renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
            onClick={() => handleViewDetails(params.row.bill_number)}
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
        field: "due_date",
        headerName: "Due Date",
        flex: 0.2,
        renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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


      const filter = new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(total)
      const totalPages = Math.ceil(sales.length / itemsPerPage)
      const displayedItems = sales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

      const handlePageChange = (event, value) => {
        setCurrentPage(value);
      };

  return ( 
    <Box margin={{md:'40px', xs:'15px'}}>

          <Box mb='20px'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography
                    fontSize='23px'
                    fontWeight='Bold'
                >
                  FILTER BY DATE
                </Typography>

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

            <Box
              display="grid"
              gridTemplateColumns={{ xs:"repeat(1, 1fr)", md:"repeat(12, 1fr)"}}
              gap="20px"
              margin={'0 10px'}
            >
              {/* ROW 1 */}
              <Box
                gridColumn="span 3"
                backgroundColor="#f2f0f0"
                borderRadius='10px'
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatBox
                  title= {filter}
                  subtitle="TOTAL EXPENSES"
                  // progress="0.75"
                  // increase="+14%"
                  icon={
                    <PointOfSale
                      sx={{ color: "#70d8bd", fontSize: "26px" }}
                    />
                  }
                />
              </Box>
            
            </Box>

            {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"25px"}>EXPENSES</Typography>
                <Box
                    display={'grid'}
                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                    gap="10px"
                    margin="0 10px"
                >

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleViewDetails(item.bill_number)}
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
                                      <Typography>Name:</Typography>
                                      <Typography fontWeight={'bold'}>{item.vendor_name}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography>Bill Number:</Typography>
                                      <Typography fontWeight={'bold'}>{item.bill_number}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography>Bill Date:</Typography>
                                      <Typography fontWeight={'bold'}>{item.bill_date}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography>Payment Terms:</Typography>
                                      <Typography fontWeight={'bold'}>{item.payment_terms}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography>Amount:</Typography>
                                      <Typography fontWeight={'bold'}>{new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.totalAmount)}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography>Status:</Typography>
                                      <Typography fontWeight={'bold'}>{item.status}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography>Due Date:</Typography>
                                      <Typography fontWeight={'bold'}>{item.due_date}</Typography>
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
                      EXPENSES
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                        rows={sales}
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
 
export default SalesReport;