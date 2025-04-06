import { Box,Card,CardContent,Typography,} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Dashboard = () => {
  const [billTotal, setBillTotal] = useState([]);
  const [tyres, setTyres] = useState([]);
  const [spare, setSpare] = useState([]);
  const [invoiceTotal, setInvoiceTotal] = useState([]);
  const [diesel,setDiesel] = useState([])
  const [invoicesNumber, setInvoicesNumber] = useState([]);
  const [customer,setCustomer] = useState([]);
  const [vendor, setVendor] = useState([])
  const token = localStorage.getItem('access_token')


  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/sparesubcategories',{
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {setSpare(data)})
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/tyres',{
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {setTyres(data)})
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/invoices', {
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {
          const invoiceItems = data.flatMap(invoice =>
            invoice.items.map(item => ({
              ...invoice,
              ...item,
            }))
          );

          setInvoiceTotal(invoiceItems)
        setInvoicesNumber(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/newbills',{
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {
        const receiptItems = data.flatMap(receipt =>
            receipt.items.map(item => ({
              ...receipt,
              ...item,
            }))
          );

          setBillTotal(receiptItems)
        setInvoicesNumber(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);
 
  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/pumpnames', {
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {

        const total = data.reduce((total,pump) => total + pump.litres,0)
        setDiesel(total);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  const totalDiesel = new Intl.NumberFormat().format(diesel);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/invoices', {
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {
        setInvoicesNumber(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/customers', {
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {
        setCustomer(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/vendors',{
      method:'GET',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {
        setVendor(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);  

  const calculateTotal = (items) => items.reduce((total, item) => total + item.amount, 0);

  const TotalRevenue =  new Intl.NumberFormat('en-KE',{style:'currency', currency:'KES'}).format(calculateTotal(invoiceTotal))
  const TotalExpenses = new Intl.NumberFormat('en-KE',{style:'currency', currency:'KES'}).format(calculateTotal(billTotal))


  const navigate = useNavigate()

  const handleViewInvoices = (customerId) => {
    navigate(`/invoice`);
  }

  const handleViewDiesel = (customerId) => {
    navigate(`/fuelings`);
  }

  const handleViewExpenses = () => {
    navigate('/expenses-reports')
  }

  const handleViewSales = () => {
    navigate('/sales-report')
  }

  const handleViewCustomers = (customerId) => {
        navigate(`/customers`);
    };
  const handleViewVendors = (customerId) => {
        navigate(`/vendors`);
    };

    const columns = [
        {
          field: "spare_subcategory_name",
          headerName: "SPARE NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.3,
          align: "left",
        },
        {
          field: "quantity",
          headerName: "QUANTITY", 
          flex: 0.2,
        },
        {
          field: "measurement",
          headerName: "Measurement",
          flex: 0.2,
        },
    ];

    const tyre = [
        {
          field: "item_details",
          headerName: "ITEM",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
        },
        {
          field: "size",
          headerName: "TYRE SIZE",
          flex: 0.2,
        },
        {
          field: "quantity",
          headerName: "QUANTITY",
          flex: 0.1,
        },
        
    ];
  
  return (
    <Box height={'100vh'} overflow={'auto'} marginLeft={{md:'30px'}}>
      {/* HEADER */}
      <Box display="flex" flexDirection="column" >
        {/* <Header title="DASHBOARD" subtitle="Welcome to your dashboard" /> */}
        <Typography fontFamily={"GT Ultrabold"} fontSize={{xs:'30px', md:'40px'}} ml={'20px'} textAlign={{xs:'center', md:'left'}}>DASHBOARD</Typography>
        <Typography fontFamily={"GT Medium"} fontSize={{xs:'20px', md:'25px'}} ml={'20px'} mb={{xs:'10px', md:'20px'}} textAlign={{xs:'center', md:'left'}}>Welcome to your dashboard</Typography>
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={'30px'}>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gap="20px"
          margin="0 10px"
        >
        {/* Diesel Card */}
        <Card
          onClick={handleViewDiesel}
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            backgroundColor: 'black',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '@media (max-width:600px)': {
              height: '150px',
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography fontSize={'27px'} fontFamily={"GT Medium"} color={'white'} fontWeight="bold">
              DIESEL
            </Typography>
            <Typography fontSize={'20px'} color={'grey'} fontFamily={"GT Regular"}>
              {totalDiesel} Litres
            </Typography>
          </CardContent>
        </Card>

        {/* Petrol Card */}
        <Card
          onClick={handleViewCustomers}
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            backgroundColor: 'purple',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '@media (max-width:600px)': {
              height: '150px',
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography fontSize={'27px'} color={'white'} fontFamily={"GT Medium"} fontWeight="bold">
              CUSTOMERS
            </Typography>
            <Typography fontSize={'20px'} fontFamily={"GT Regular"} color={'grey'}>
              {customer}
            </Typography>
          </CardContent>
        </Card>

        {/* Oil Card */}
        <Card
          onClick={handleViewInvoices}
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            backgroundColor: 'black',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '@media (max-width:600px)': {
              height: '150px',
            },
          }}
        >
            <CardContent sx={{ textAlign: 'center'}}>
            <Typography fontSize={'27px'} fontFamily={"GT Medium"} color={'white'} fontWeight="bold">
              INVOICES
            </Typography>
            <Typography fontSize={'20px'} fontFamily={"GT Regular"} color={'grey'}>
              {invoicesNumber}
            </Typography>
          </CardContent>
        </Card>

        {/* Lubricants Card */}
        <Card
          onClick={handleViewVendors}
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            backgroundColor: 'black',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '@media (max-width:600px)': {
              height: '150px',

            },
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography fontSize={'27px'} color={'white'} fontFamily={"GT Medium"} fontWeight="bold">
              VENDORS
            </Typography>
            <Typography fontSize={'20px'} fontFamily={"GT Regular"} color={'grey'}>
              {vendor}
            </Typography>
          </CardContent>
        </Card>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          gap="20px"
          margin="0 10px"
        >
        {/* Diesel Card */}
        <Card
          onClick={handleViewSales}
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '200px',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            backgroundColor: 'purple',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '@media (max-width:1600px)': {
              height: '150px',
            },
            '@media (max-width:600px)': {
              height: '200px',
              padding: '15px',
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography fontSize={'27px'} fontWeight="bold" color={'white'} fontFamily={"GT Medium"}>
              REVENUE
            </Typography>

            <Typography fontSize={'20px'} fontFamily={"GT Regular"} color={'white'} paragraph>
              {TotalRevenue}
            </Typography>
          </CardContent>
        </Card>


        {/* Petrol Card */}
        <Card
          onClick={handleViewExpenses}
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            backgroundColor: 'purple',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '@media (max-width:600px)': {
              height: '150px',
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography fontSize={'27px'} color={'white'} fontFamily={"GT Medium"} fontWeight="bold" gutterBottom>
              EXPENSES
            </Typography>
            <Typography fontSize={'20px'} color={'white'} fontFamily={"GT Regular"} paragraph>
              {TotalExpenses}
            </Typography>
          </CardContent>
        </Card>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          gap="20px"
          margin="0 10px"
          mb={'30px'}
        >
        {/* Tyres Card */}
        <Card
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            overflow:'auto',
            height:'800px',
            backgroundColor: '#fff',
            '@media (max-width:1600px)': {
              // height: '550px',
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              TYRES
            </Typography>
                  <Box
                      height="auto"
                      sx={{
                      "& .MuiDataGrid-root": {
                          border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                          borderBottom: "none",
                          // fontSize: "16px",  // Increase the font size of the data
                      },
                      "& .name-column--cell": {
                          // color: colors.greenAccent[300],
                      },
                      "& .MuiDataGrid-columnHeaders": {
                          // backgroundColor: colors.blueAccent[700],
                          borderBottom: "none",
                          // fontSize: "16px",  // Increase the font size of the header
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
                        rows={tyres}
                        columns={tyre}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 30,
                            },
                          },
                        }}
                        pageSizeOptions={[30]}
                      />
                  </Box>
          </CardContent>
        </Card>


        {/* Spare Card */}
        <Card
          sx={{
            borderRadius: '15px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '10px',
            height:'800px',
            backgroundColor: '#fff',
            '@media (max-width:600px)': {
              // height: '550px',
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              SPARES
            </Typography>
              <Box m="20px">
                  <Box
                      height="auto"
                      sx={{
                      "& .MuiDataGrid-root": {
                          border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                          borderBottom: "none",
                          // fontSize: "16px",  // Increase the font size of the data
                      },
                      "& .name-column--cell": {
                          // color: colors.greenAccent[300],
                      },
                      "& .MuiDataGrid-columnHeaders": {
                          // backgroundColor: colors.blueAccent[700],
                          borderBottom: "none",
                          // fontSize: "16px",  // Increase the font size of the header
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
                        rows={spare}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 30,
                            },
                          },
                        }}
                        pageSizeOptions={[30]}
                      />
                  </Box>
              </Box>
          </CardContent>
        </Card>
        </Box>

      </Box>

    </Box>
  );
};

export default Dashboard;
