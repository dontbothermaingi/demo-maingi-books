import { Box, Card, CardContent, Pagination, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function StockItemDetails (){

    const [stockItem, setStockItem] = useState("");
    const [invoices, setInvoices] = useState([]);
    const [stockSold, setStockSold] = useState([]);
    const [bills, setBills] = useState([]);
    const navigate = useNavigate();
    const {stockId} = useParams();
    const token = localStorage.getItem("access_token");
    const isMobile = useMediaQuery("(max-width:768px)");
    const [billCurrentPage, setBillCurrentPage] = useState(1)
    const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1)
    const itemsPerPage = 14;


    useEffect(() => {
            fetch(`https://maingi-demo-server.onrender.com/stockitems/${stockId}`,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
            })
            .then(response => response.json())
            .then((data) => {
                setStockItem(data)
            })
            
    },[token, stockId])

    useEffect(() => {
      fetch(`https://maingi-demo-server.onrender.com/newbills`,{
          method:'GET',
          headers:{
              'Authorization':`Bearer ${token}`
          },
          credentials:'include'
      })
      .then(response => response.json())
      .then((data) => {

          const billItems = data.flatMap(bill =>
              bill.items.map(item => ({
                  ...item,
                  item_store_id: item.store_id,
                  bill_store_id: bill.store_id,
                  bill_id: bill.id,
                  vendor_name: bill.vendor_name,
                  bill_number: bill.bill_number,
                  bill_date: bill.bill_date,
                  status:bill.status
                  // Add other bill fields if needed
              }))
          );

          const filtered = billItems.filter(item => item.item_details === stockItem.item_details)
          
          setBills(filtered)
      })
    },[token, stockItem])

    const InvoiceItemPages = Math.ceil(invoices.length /itemsPerPage)
    const billItemPages = Math.ceil(bills.length /itemsPerPage)

    const billItemDisplayed = bills.slice((billCurrentPage - 1) * itemsPerPage, billCurrentPage * itemsPerPage)
    const invoiceItemDisplayed = invoices.slice((invoiceCurrentPage - 1) * itemsPerPage, invoiceCurrentPage * itemsPerPage)

    const handleBillPageChange = (event, value) => {
      setBillCurrentPage(value);
    };

    const handleInvoicePageChange = (event, value) => {
      setInvoiceCurrentPage(value);
    };

    useEffect(() => {
      fetch(`https://maingi-demo-server.onrender.com/invoices`,{
          method:'GET',
          headers:{
              'Authorization':`Bearer ${token}`
          },
          credentials:'include'
      })
      .then(response => response.json())
      .then((data) => {

          const billItems = data.flatMap(invoice =>
              invoice.items.map(item => ({
                  ...item,
                  ...invoice,
              }))
          );

          const filtered = billItems.filter(item => item.item_details === stockItem.item_details)
          const stocksold = filtered.reduce((total,item) => total + Number(item.quantity || 0), 0)
          setInvoices(filtered)
          setStockSold(stocksold)
      })
    },[token, stockItem])



    console.log(stockItem)

    const invoiceTotal = invoices.reduce((total, item) => total + Number(item.amount || 0), 0);
    const billTotal = bills.reduce((total, item) => total + Number(item.amount || 0), 0);

    const profit = invoiceTotal - billTotal
    const loss = billTotal - invoiceTotal


    const handleViewInvoices = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`)
    }

    const handleViewDetails = (billId) => {
        navigate(`/newbills/${billId}`);
    };

    const invoiceColumns = [
        {
          field: "customer_name",
          headerName: "CUSTOMER NAME",
          flex: 0.5,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewInvoices(params.row.id)}
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
          field: "invoice_number",
          headerName: "INVOICE NUMBER",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewInvoices(params.row.id)}
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
          field: "invoice_date",
          headerName: "DATE",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewInvoices(params.row.id)}
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
          headerName: "STATUS",
          flex: 0.4,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewInvoices(params.row.id)}
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
          field: "item_details",
          headerName: "ITEM DETAILS",
          flex: 0.5,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewInvoices(params.row.id)}
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
          headerName: "Quantity",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
          field: "rate",
          headerName: "RATE",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
          field: "amount",
          headerName: "Amount",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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

      const billColumns = [
        {
          field: "vendor_name",
          headerName: "VENDOR NAME",
          flex: 0.5,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
          field: "bill_number",
          headerName: "BILL NUMBER",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
          headerName: "DATE",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
          headerName: "STATUS",
          flex: 0.4,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
            field: "item_details",
            headerName: "ITEM DETAILS",
            flex: 0.5,
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewInvoices(params.row.id)}
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
          headerName: "Quantity",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
          field: "rate",
          headerName: "RATE",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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
          field: "amount",
          headerName: "Amount",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.id)}
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


    return ( 
        <Box padding={'20px'}>
            <Typography fontFamily={"GT Medium"} textAlign={'center'} fontSize={{xs:'25px', md:"40px"}} mb={'30px'}>STOCK ITEM DETAILED REPORT</Typography>
            <Box mb={'40px'}>
                <Typography fontFamily={"GT Bold"} textAlign={'right'} fontSize={{md:'40px', xs:'20px'}}>{stockItem.item_details}</Typography>
                <Typography fontFamily={"GT Light"} textAlign={'right'} fontSize={{md:'20px', xs:'16px'}}>Quantity: {stockItem.quantity}</Typography>
                <Typography fontFamily={"GT Light"} textAlign={'right'} fontSize={{md:'20px', xs:'16px'}}>Buying Price: {new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(stockItem.price)}</Typography>
                <Typography fontFamily={"GT Light"} textAlign={'right'} fontSize={{md:'20px', xs:'16px'}}>Stock Sold: {stockSold}</Typography>
            </Box>

            <Box display={'flex'} flexDirection={{xs:'column', md:'row'}} gap={'20px'} mb={'30px'}>
                <Box sx={{backgroundColor:'purple', padding:{md:'30px', xs:"20px"}, borderRadius:'15px'}}>
                    <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>STOCK ITEM SALES</Typography>
                    <Typography textAlign={'center'} fontFamily={"GT Bold"} color={'white'} fontSize={{md:'25px', xs:'20px'}}>{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(invoiceTotal)}</Typography>
                </Box>

                <Box sx={{backgroundColor:'purple', padding:{md:'30px', xs:"20px"}, borderRadius:'15px'}}>
                    <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>STOCK ITEM EXPENSES</Typography>
                    <Typography textAlign={'center'} fontFamily={"GT Bold"} color={'white'} fontSize={{md:'25px', xs:'20px'}}>{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(billTotal)}</Typography>
                </Box>

                {profit > 0 ? (
                    <Box sx={{backgroundColor:'green', padding:'30px', borderRadius:'15px'}}>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>PROFIT</Typography>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>+{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(profit)}</Typography>
                    </Box>
                ):(
                    <Box sx={{backgroundColor:'red', padding:'30px', borderRadius:'15px'}} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>LOSS</Typography>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>-{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(loss)}</Typography>
                    </Box>
                )}
                
            </Box>

            <Box sx={{mb:'20px'}}>
              {isMobile ? (
                <Box>
                  <Typography fontSize={'30px'} fontFamily={"GT Medium"} mb={'10px'} textAlign={'center'}>INVOICES</Typography>
                  <Box
                      display={'grid'}
                      gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                      gap="20px"
                      margin="0 10px"
                  >

                      {invoiceItemDisplayed && invoiceItemDisplayed.map((item) => (
                          <Card
                              key={item.id}
                              onClick={() => handleViewInvoices(item.id)}
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
                                          <Box display={'flex'} gap={'5px'}>
                                              <Typography fontFamily={"GT Medium"} fontSize={'14px'}>Customer:</Typography>
                                              <Typography ffontFamily={"GT Light"} fontSize={'15px'}>{item.customer_name}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'7px'}>
                                              <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Invoice Number:</Typography>
                                              <Typography  fontFamily={"GT Light"} fontSize={'15px'}>{item.invoice_number}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'7px'}>
                                              <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Amount:</Typography>
                                              <Typography fontFamily={"GT Light"} fontSize={'15px'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:item.currency}).format(item.amount)}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'7px'}>
                                              <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Currency:</Typography>
                                              <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.currency}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'7px'}>
                                              <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Date:</Typography>
                                              <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.invoice_date}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'7px'}>
                                              <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Status:</Typography>
                                              <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.status}</Typography>
                                          </Box>

                                          <Box display={'flex'} gap={'7px'}>
                                              <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Sales Person:</Typography>
                                              <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.sales_person}</Typography>
                                          </Box>

                              </CardContent>
                          </Card>
                      ))}
                      <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={InvoiceItemPages} page={invoiceCurrentPage} onChange={handleInvoicePageChange} color="secondary" />
                      </Box>
                  </Box>
                </Box>
              ):(
                <Box>
                  <Typography fontFamily={"GT Medium"} fontSize={'30px'}>Invoices</Typography>
                  <DataGrid
                      columns={invoiceColumns}
                      rows={invoices}
                      components={{toolbar:GridToolbar}}
                      getRowId={(row) => row.invoice_id}
                  />
                </Box>
              )}
                
            </Box>

            <Box>

              {isMobile ? (
                <Box>
                  <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>BILLS</Typography>
                  <Box
                      display={'grid'}
                      gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                      gap="20px"
                      margin="0 10px"
                  >

                      {billItemDisplayed && billItemDisplayed.map((item) => (
                          <Card
                              key={item.id}
                              onClick={() => handleViewDetails(item.bill_id)}
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
                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Name:</Typography>
                                      <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.vendor_name}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Bill Number:</Typography>
                                      <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.bill_number}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Bill Date:</Typography>
                                      <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.bill_date}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Amount:</Typography>
                                      <Typography fontFamily={"GT Light"} fontSize={'15px'}>{new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.amount)}</Typography>
                                    </Box>

                                    <Box display={'flex'} gap={'5px'}>
                                      <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Status:</Typography>
                                      <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.status}</Typography>
                                    </Box>

                              </CardContent>
                          </Card>
                      ))}
                      <Box display="flex" justifyContent="center" mt="20px">
                              <Pagination count={billItemPages} page={billCurrentPage} onChange={handleBillPageChange} color="secondary" />
                      </Box>
                  </Box>
                </Box>
              ):(
                <Box>
                  <Typography fontFamily={"GT Medium"} fontSize={'30px'}>Bills</Typography>
                  <DataGrid
                      columns={billColumns}
                      rows={bills}
                      components={{toolbar:GridToolbar}}
                      getRowId={(row) => row.bill_id}
                  />
                </Box>
              )}

            </Box>
        </Box>
     );
}
 
export default StockItemDetails;