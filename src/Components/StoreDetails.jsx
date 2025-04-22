import { Box, Card, CardContent, Divider, Pagination, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function StoreDetails (){

    const{storeId} = useParams();
    const token = localStorage.getItem('access_token');
    const [StoreDetails, setStoreDetails] = useState("");
    const [stockItems, setStockItems] = useState([])
    const [stockCurrentPage, setStockCurrentPage] = useState(1)
    const [billCurrentPage, setBillCurrentPage] = useState(1)
    const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1)
    const [soldMost, setSoldMost] = useState([])
    const [invoices, setInvoices] = useState([])
    const [bills, setBills] = useState([]);
    const isMobile = useMediaQuery("(max-width:768px)")
    const navigate = useNavigate();
    const itemsPerPage = 14;

    useEffect(() => {
        fetch(`https://maingi-demo-server.onrender.com/store/${storeId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {
            setStoreDetails(data)
            setStockItems(data.stock_items);

            const invoiceItems = data.invoices.flatMap(invoice => 
                invoice.items.map(item => ({
                    ...item,
                    ...invoice
                }))
            );

            const mostSold = data.stock_items.map((stockItem) => {

                const itemInvoices = invoiceItems.filter(item => item.item_details === stockItem.item_details)

                const itemQuantity = itemInvoices.reduce((total,item) => total + Number(item.quantity || 0),0)

                return {
                  item: stockItem,
                  totalSold: itemQuantity
                };

            })

            setSoldMost(mostSold)
            setInvoices(invoiceItems)
        })
    },[token, storeId])

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
                    status: bill.status,
                    // Add other bill fields if needed
                }))
            );

            const filtered = billItems.filter(item => item.item_store_id === Number(storeId))
            
            console.log(filtered)
            setBills(filtered)
        })
    },[token, storeId])

    const stockItemPages = Math.ceil(stockItems.length /itemsPerPage)
    const InvoiceItemPages = Math.ceil(invoices.length /itemsPerPage)
    const billItemPages = Math.ceil(bills.length /itemsPerPage)

    const stockItemDisplayed = stockItems.slice((stockCurrentPage - 1) * itemsPerPage, stockCurrentPage * itemsPerPage)
    const billItemDisplayed = bills.slice((billCurrentPage - 1) * itemsPerPage, billCurrentPage * itemsPerPage)
    const invoiceItemDisplayed = invoices.slice((invoiceCurrentPage - 1) * itemsPerPage, invoiceCurrentPage * itemsPerPage)

    const handleStockPageChange = (event, value) => {
      setStockCurrentPage(value);
    };

    const handleBillPageChange = (event, value) => {
      setBillCurrentPage(value);
    };

    const handleInvoicePageChange = (event, value) => {
      setInvoiceCurrentPage(value);
    };


    const billTotal = bills.reduce((total,item) => total + Number(item.amount || 0),0)
    const invoiceTotal = invoices.reduce((total,item) => total + Number(item.amount || 0),0)
    
    const profit = invoiceTotal - billTotal
    const loss = billTotal - invoiceTotal

    const sorted = soldMost.slice().sort((a,b) => b.totalSold - a.totalSold); // clone before sort to avoid mutating state
    const bottomFive = sorted.slice(-5)
    const top5 = sorted.slice(0, 5);


    const handleViewDetails = (billId) => {
        navigate(`/newbills/${billId}`);
    };

    const handleViewInvoices = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`)
    }

    function handleViewStockDetails (stockId){
        navigate(`/stock-details/${stockId}`)
    }

    const stockitems = [
        {
            field:'item_details',
            headerName:"Stock Name",
            headerAlign:'left',
            flex:0.5,
            renderCell:((params) => (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer', 
                    }}
                    onClick={() => handleViewStockDetails(params.row.id)}
                >
                <Typography
                    variant="h7"
                >
                    {params.value}
                </Typography>
                </Box>
            ))
        },
        {
            field: "quantity",
            headerName: "Quantity",
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
    ]

    const billcolumns = [
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
            onClick={() => handleViewDetails(params.row.bill_id)}
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
          headerName: "Bill Number",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_id)}
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
          flex: 0.4,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_id)}
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
          headerName: "Stock Name",
          flex: 0.5,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_id)}
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
            flex: 0.5,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.bill_id)}
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
            headerName: "Rate",
            flex: 0.5,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.bill_id)}
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
            flex: 0.5,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.bill_id)}
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

    const invoiceColumns = [
        { field: "customer_name", headerName: "Customer Name", flex: 0.3,
        renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ),
       },
        { field: "invoice_number", headerName: "Invoice Number", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), 
        },
        { field: "invoice_date", headerName: "Invoice Date", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), 
        },
        { field: "item_details", headerName: "ITEM", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), 
        },

        { field: "quantity", headerName: "TRIPS", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
        { field: "rate", headerName: "RATE", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
        { field: "vat", headerName: "VAT", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), 
        },
        { field: "amount", headerName: "AMOUNT", flex: 0.2, renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handleViewInvoices(params.row.invoice_id)}
        >
          <Typography
              variant="h7"
          >
            {params.value}
          </Typography>
        </Box>
        ), },
    ];

    return ( 
        <Box padding={{md:'30px', xs:'15px'}}>
            <Typography fontFamily={"GT Bold"} fontSize={{md:"40px", xs:"30px"}} mb={'20px'} textAlign={{md:'right', xs:'center'}} padding={{md:'20px', xs:'2px'}}>{StoreDetails.store_name}</Typography>

            <Box display={'flex'} flexDirection={{xs:'column', md:'row'}} gap={'20px'} mb={'30px'}>
                <Box sx={{backgroundColor:'purple', padding:'30px', borderRadius:'15px'}}>
                    <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>STORE SALES</Typography>
                    <Typography textAlign={'center'} fontFamily={"GT Bold"} color={'white'} fontSize={'25px'}>{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(invoiceTotal)}</Typography>
                </Box>

                <Box sx={{backgroundColor:'purple', padding:'30px', borderRadius:'15px'}}>
                    <Typography fontFamily={"GT Bold"} color={'white'}  textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>STORE PURCHASES</Typography>
                    <Typography textAlign={'center'} fontFamily={"GT Bold"} color={'white'} fontSize={'25px'}>{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(billTotal)}</Typography>
                </Box>

                {profit > 0 ? (
                    <Box sx={{backgroundColor:'green', padding:'30px', borderRadius:'15px'}}>
                        <Typography fontFamily={"GT Bold"} color={'white'}  textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>PROFIT</Typography>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={'25px'}>+{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(profit)}</Typography>
                    </Box>
                ):(
                    <Box sx={{backgroundColor:'red', padding:'30px', borderRadius:'15px'}} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Typography fontFamily={"GT Bold"} color={'white'}  textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>LOSS</Typography>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={'25px'}>-{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(loss)}</Typography>
                    </Box>
                )}
                
            </Box>

            <Box display={'flex'} flexDirection={{xs:'column', md:'row'}} gap={'20px'} mb={'20px'}>
              <Box sx={{padding:{md:'30px', xs:'0px'}, backgroundColor:"#fff", boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:{md:'400px', xs:"100%"}}}>
                <Typography fontFamily={'GT BOLD'} fontSize={{md:'25px', xs:'20px'}} padding={{xs:'15px', md:'0px'}}>TOP 5 MOST SOLD ITEMS</Typography>
                <Divider sx={{ml:{xs:'10px', md:'0'}, mr:{xs:'10px', md:'0'}, mt:{xs:'0px', md:'10px'}, mb:{xs:'0px', md:'10px'}}}/>
                  {top5.map((item,index) => (
                    <Box display={'flex'} gap={'10px'} key={index} padding={{xs:'15px', md:'0px'}}>
                      <Typography fontFamily={'GT Medium'}>{item.item.item_details}:</Typography>
                      <Typography fontFamily={"GT Light"}>{item.totalSold}</Typography>
                    </Box>
                  ))}
              </Box>

              <Box sx={{padding:{md:'30px', xs:'0px'}, backgroundColor:"#fff", boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:{md:'400px', xs:"100%"}}}>
                <Typography fontFamily={'GT BOLD'} fontSize={{md:'25px', xs:'20px'}}  padding={{xs:'15px', md:'0px'}}>TOP 5 LEAST SOLD ITEMS</Typography>
                <Divider sx={{ml:{xs:'10px', md:'0'}, mr:{xs:'10px', md:'0'}, mt:{xs:'0px', md:'10px'}, mb:{xs:'0px', md:'10px'}}}/>
                  {bottomFive.map((item,index) => (
                    <Box display={'flex'} gap={'10px'} key={index} padding={{xs:'15px', md:'0px'}}>
                      <Typography fontFamily={'GT Medium'}>{item.item.item_details}:</Typography>
                      <Typography fontFamily={"GT Light"}>{item.totalSold}</Typography>
                    </Box>
                  ))}
              </Box>
            </Box>

            <Box mb={'20px'}>
              {isMobile ? (
                  <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>STOCK ITEMS</Typography>
                    <Box
                        display={'grid'}
                        gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                        gap="10px"
                        // margin="0 10px"
                    >

                        {stockItemDisplayed && stockItemDisplayed.map((item) => (
                            <Card
                            key={item.id}
                            onClick={() => handleViewStockDetails(item.id)}
                            sx={{
                                borderRadius: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'auto', // Adjust height for better flexibility
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                // padding: '10px',
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
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Item:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.item_details}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Quantity:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.quantity}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Measurement:</Typography>
                                    <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.measurement}</Typography>
                                  </Box>
                      
                                </CardContent>

                            </Card>
                        ))}

                    </Box>

                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={stockItemPages} page={stockCurrentPage} onChange={handleStockPageChange} color="primary" />
                    </Box>
                  </Box>
              ):(
                <Box>
                    <Typography fontFamily={'GT Regular'} fontSize={'30px'}>Stock Items</Typography>
                    {StoreDetails ? (
                      <DataGrid 
                        rows={StoreDetails.stock_items}
                        columns={stockitems}
                        getRowId={(row) => row.id}
                        components={{toolbar:GridToolbar}}
                     />
                    ):(
                      <Typography fontFamily={"GT Medium"} textAlign={'center'}>No stock items</Typography>
                    )}
                    
                </Box>
              )}
            </Box>

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
                {bills.length > 0 ? (
                    <Box mb={'20px'}>
                        <Typography fontFamily={'GT Regular'} fontSize={'30px'}>Bills</Typography>
                        {bills ? (
                          <DataGrid 
                            rows={bills}
                            columns={billcolumns}
                            getRowId={(row) => row.id}
                            components={{toolbar:GridToolbar}}
                        />
                        ):(
                          <Typography fontFamily={"GT Medium"} textAlign={'center'}>No Bills</Typography>
                        )}
                        
                    </Box>
                ):(
                    <Typography fontFamily={"GT Regular"} textAlign={'center'} padding={'30px'}>There are no bills for this item</Typography>
                )}
              </Box>
            )}

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
                {invoices && (
                    <Box mb={'20px'}>
                        <Typography fontFamily={'GT Regular'} fontSize={'30px'}>Invoices</Typography>
                        {invoices && 
                          <DataGrid 
                              rows={invoices}
                              columns={invoiceColumns}
                              getRowId={(row) => row.id}
                              components={{toolbar:GridToolbar}}
                          />
                        }
                    </Box>
                )}
              </Box>
            )}
        </Box>
     );
}
 
export default StoreDetails;