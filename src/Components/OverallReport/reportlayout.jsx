import { Box, Card, CardContent, Divider, Pagination, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function ReportLayout (){

    const [invoices, setInvoices] = useState([]);
    const [bills, setBills] = useState([]);
    const [invoiceSpecifics, setInvoiceSpecifics] = useState([])
    const [billls, setBillls] = useState([]);
    const [invoicesss, setInvoicesss] = useState([]);
    const [billSpecifics, setBillSpecifics] = useState([])
    const [categoryInvoices, setCategoryInvoices] = useState([])
    const [categoryBills, setCategoryBills] = useState([])
    const [categoryName , setCategoryName] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [viewType, setViewType] = useState("")
    const token = localStorage.getItem('access_token')
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:768px)")
    const [billCurrentPage, setBillCurrentPage] = useState(1)
    const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const itemsPerPage = 14;

    function filterByDateRange (items,startDate,endDate){
      if(!startDate || !endDate) return items;

      return items.filter(item => {
        const itemDate = new Date(item.bill_date || item.invoice_date)  // Converts the string intoa date object
        return itemDate >= startDate && itemDate <= endDate
      })
    }

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

              const filterByDate = filterByDateRange(data, startDate, endDate);

              const billItems = filterByDate.flatMap(bill =>
                  bill.items.map(item => ({
                      ...item,
                      ...bill,
                      // Add other bill fields if needed
                  }))
              );

              const billsWithTotals = filterByDate.map(bill => ({
                ...bill,
                total_amount: bill.items.reduce((total, item) => total + Number(item.amount || 0), 0)
              }));

              const specifics = billsWithTotals.reduce((acc,item) => {
                if(!acc[item.category_name]){
                    acc[item.category_name] = {...item, amount : 0, bills:[] }
                }

                acc[item.category_name].amount += parseFloat(item.total_amount);
                acc[item.category_name].bills.push(item)
                return acc;
              },{})
    
              setBills(billsWithTotals)
              setBillls(billItems)
              setBillSpecifics(Object.values(specifics))
          })
    },[token, startDate,endDate])

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

              const filterByDate = filterByDateRange(data, startDate, endDate);

              const filtered = filterByDate.filter(item => item.customer_name !== "EKATI FUELS")

              const invoiceItems = filtered.flatMap(invoice =>
                  invoice.items.map(item => ({
                      ...item,
                      ...invoice,
                  }))
              );

              const invoiceWithTotals = filtered.map(invoice => ({
                ...invoice,
                items: invoice.items,
                total_amount: invoice.items.reduce((total, item) => total + Number(item.amount || 0), 0)
              }));

              const specifics = invoiceWithTotals.reduce((acc,item) => {
                if(!acc[item.category_name]){
                    acc[item.category_name] = {...item, amount : 0, invoices:[] }
                }

                acc[item.category_name].amount += Number(item.total_amount);
                acc[item.category_name].invoices.push(item)
                return acc;
              },{})

              setInvoices(invoiceWithTotals)
              setInvoicesss(invoiceItems)
              setInvoiceSpecifics(Object.values(specifics))
          })
    },[token, startDate,endDate])

    // function handleActiveItem(id){
    //   setActiveCategory(activeCategory === id ? null : id)
    // }

    function handleInvoiceSpecific(cat_name){
      const specificInvoice = invoices.filter(item => item.category_name === cat_name)
    
      setCategoryInvoices(specificInvoice) // overwrite the current list
      setCategoryBills([]) // clear out any previously selected bills
    
      setActiveCategory(cat_name)
      setCategoryName(cat_name)
      setViewType("invoice")
    }

    function handleBillSpecific(cat_name){
      const specificBills = bills.filter(item => item.category_name === cat_name)
    
      setCategoryBills(specificBills) // overwrite the current list
      setCategoryInvoices([]) // clear out any previously selected invoices
    
      setActiveCategory(cat_name)
      setCategoryName(cat_name)
      setViewType("bill")
    }

    const invoiceTotal = invoicesss.reduce((total, item) => total + Number(item.amount || 0), 0).toFixed(2)
    const billTotal = billls.reduce((total, item) => total + Number(item.amount || 0), 0).toFixed(2)
    const profit = invoiceTotal - billTotal

    const handleViewInvoices = (invoiceId) => {
      navigate(`/invoices/${invoiceId}`)
    }

    const handleViewDetails = (billId) => {
        navigate(`/newbills/${billId}`);
    };


    const InvoiceItemPages = Math.ceil(categoryInvoices.length /itemsPerPage)
    const billItemPages = Math.ceil(categoryBills.length /itemsPerPage)

    const billItemDisplayed = categoryBills.slice((billCurrentPage - 1) * itemsPerPage, billCurrentPage * itemsPerPage)
    const invoiceItemDisplayed = categoryInvoices.slice((invoiceCurrentPage - 1) * itemsPerPage, invoiceCurrentPage * itemsPerPage)

    const handleBillPageChange = (event, value) => {
      setBillCurrentPage(value);
    };

    const handleInvoicePageChange = (event, value) => {
      setInvoiceCurrentPage(value);
    };

    const currencyLocaleMap = {
      AED: "en-AE", // United Arab Emirates Dirham
      AUD: "en-AU", // Australian Dollar
      CAD: "en-CA", // Canadian Dollar
      CHF: "de-CH", // Swiss Franc
      CNY: "zh-CN", // Chinese Yuan
      EUR: "de-DE", // Euro
      GBP: "en-GB", // British Pound
      HKD: "en-HK", // Hong Kong Dollar
      IDR: "id-ID", // Indonesian Rupiah
      ILS: "he-IL", // Israeli New Shekel
      INR: "en-IN", // Indian Rupee
      JPY: "ja-JP", // Japanese Yen
      KES: "en-KE", // Kenyan Shilling
      NZD: "en-NZ", // New Zealand Dollar
      SGD: "en-SG", // Singapore Dollar
      THB: "th-TH", // Thai Baht
      TRY: "tr-TR", // Turkish Lira
      USD: "en-US", // United States Dollar
      ZAR: "en-ZA", // South African Rand
      MXN: "es-MX", // Mexican Peso
      BRL: "pt-BR", // Brazilian Real
    };

    const invoiceColumns = [
      { field: "id", headerName: "ID", flex: 0.2 },
      {
        field: "customer_name",
        headerName: "Customer Name",
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
        headerName: "Invoice Number",
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
        field: "currency",
        headerName: "Currency",
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
        field: "total_amount",
        headerName: "Amount",
        flex: 0.3,
        renderCell: (params) => {
          // Use Intl.NumberFormat for currency formatting
          const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency], {
            style: 'currency',
            currency: params.row.currency, // Replace with your desired currency
          }).format(params.value);
      
          return (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewInvoices(params.row.id)}
            >
              <Typography variant="h7">
                {formattedAmount}  {/* Display formatted amount */}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "invoice_date",
        headerName: "Invoice Date",
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
        field: "sales_person",
        headerName: "Sales Person",
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
    ]


    const billColumns = [
      { field: "id", headerName: "ID", flex: 0.2 },
      {
        field: "vendor_name",
        headerName: "Vendor Name",
        flex: 0.7,
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
        headerName: "Bill Number",
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
        field: "bill_date",
        headerName: "Bill Date",
        flex: 0.25,
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
          headerName: "Status",
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
          field: "total_amount",
          headerName: "Total Amount",
          flex: 0.4,
          renderCell: (params) => {
            // Use Intl.NumberFormat for currency formatting
            const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency] || 'en-KE', {
              style: 'currency',
              currency: 'KES', // Replace with your desired currency
            }).format(params.value);
        
            return (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
              >
                <Typography variant="h7">
                  {formattedAmount}  {/* Display formatted amount */}
                </Typography>
              </Box>
            );
          },
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
    ];

    return ( 
        <Box >
            <Box display={'flex'} flexDirection={'column'} gap={'10px'} alignItems={'center'}>
                <Typography fontFamily={'GT Bold'} fontSize={{md:'40px', xs:'28px'}}>OVERALL REPORT</Typography>
            </Box>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display={'flex'} gap={'20px'} mt={'20px'} ml={'30px'}>

                      <Box>
                          <Typography fontFamily={"GT Light"}>Starting Date</Typography>
                          <DatePicker value={startDate} onChange={(date) => setStartDate(date)}/>
                      </Box>

                      <Box>
                          <Typography fontFamily={"GT Light"}>Ending Date</Typography>
                          <DatePicker value={endDate} onChange={(date) => setEndDate(date)}/>
                      </Box>

                  </Box>
                  
              </LocalizationProvider>

              {profit > 0 ? (
                    <Box sx={{backgroundColor:'green', padding:'30px', borderRadius:'15px', width:{md:'300px', xs:'100px'}, margin:'auto', mt:'20px', mb:'20px'}} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Typography fontFamily={"GT Bold"} color={'white'}  textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>PROFIT</Typography>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>+{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(profit)}</Typography>
                    </Box>
                ):(
                    <Box sx={{backgroundColor:'red', padding:'30px', borderRadius:'15px',   width:{md:'300px', xs:'230px'}, margin:'auto', mt:'20px', mb:'20px'}} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Typography fontFamily={"GT Bold"} color={'white'}  textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>LOSS</Typography>
                        <Typography fontFamily={"GT Bold"} color={'white'} textAlign={'center'} fontSize={{md:'25px', xs:'20px'}}>{new Intl.NumberFormat('en-KE', {style:"currency", currency:'KES'}).format(profit)}</Typography>
                    </Box>
                )}

              <Box display={'flex'} flexDirection={{xs:'column', md:'row'}} justifyContent={'center'} gap={'20px'}>

                <Box display={'flex'} flexDirection={'column'} margin={{md:'50px', xs:'10px'}}>
                    <Box sx={{padding:{md:'30px', xs:'0px'}, backgroundColor:"#fff", boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:{md:'400px', xs:"100%"}}}>
                        <Typography fontFamily={'GT Regular'} fontSize={'30px'} textAlign={'center'} padding={{xs:'10px', md:'0px'}}>SALES</Typography>

                        <Divider sx={{ mt:{md:'20px', xs:'0px'}, mb:{md:'20px', xs:'0px'}, ml:{md:'20px', xs:'10px'}, mr:{md:'20px', xs:'10px'} }}/>

                        {invoiceSpecifics.map((item,index) => (
                            <Box display={'flex'} justifyContent={'space-between'} sx={{cursor:'pointer'}} gap={'9px'} alignItems={'center'} padding={{xs:'10px', md:'0px'}} key={index} onClick={() => handleInvoiceSpecific(item.category_name)}>
                                <Typography fontFamily={'GT Medium'} fontSize={{md:'20px', xs:'17px'}}>{item.category_name}</Typography>
                                <Typography fontFamily={'GT Light'} fontSize={{md:'20px', xs:'17px'}}>{new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format (Number(item.amount).toFixed(2))}</Typography>
                            </Box>
                        ))}

                        <Divider sx={{ mt:{md:'20px', xs:'0px'}, mb:{md:'20px', xs:'0px'}, ml:{md:'20px', xs:'10px'}, mr:{md:'20px', xs:'10px'} }}/>

                        <Typography fontFamily={'GT Light'} padding={{xs:'10px', md:'0px'}} fontSize={'20px'}>Total     {new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(invoiceTotal)}</Typography>
                    </Box>
                </Box>

                <Divider orientation="vertical" sx={{border:'1px solid black', height:'500px', display:{xs:"none", md:'block'}}}/>

                <Box display={'flex'} flexDirection={'column'} margin={{md:'50px', xs:'10px'}}>
                    <Box sx={{padding:{md:'30px', xs:'0px'}, backgroundColor:"#fff", boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:{md:'400px', xs:"100%"}}}>
                        <Typography fontFamily={'GT Regular'} fontSize={'30px'} textAlign={'center'} padding={{xs:'10px', md:'0px'}}>EXPENSES</Typography>

                        <Divider sx={{ mt:{md:'20px', xs:'0px'}, mb:{md:'20px', xs:'0px'}, ml:{md:'20px', xs:'10px'}, mr:{md:'20px', xs:'10px'} }}/>

                        {billSpecifics.map((item,index) => (
                            <Box display={'flex'} gap={'9px'} justifyContent={'space-between'} alignItems={'center'} padding={{xs:'10px', md:'0px'}} key={index} sx={{cursor:'pointer'}} onClick={() => handleBillSpecific(item.category_name)}>
                                <Typography fontFamily={'GT Medium'} fontSize={{md:'20px', xs:'17px'}}>{item.category_name}</Typography>
                                <Typography fontFamily={'GT Light'} fontSize={{md:'20px', xs:'17px'}}>{new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(Number(item.amount).toFixed(2))}</Typography>
                            </Box>
                        ))}

                        <Divider sx={{ mt:{md:'20px', xs:'0px'}, mb:{md:'20px', xs:'0px'}, ml:{md:'20px', xs:'10px'}, mr:{md:'20px', xs:'10px'} }}/>

                        <Typography fontFamily={'GT Light'} fontSize={'20px'} padding={{xs:'10px', md:'0px'}}>Total {new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(billTotal)}</Typography>
                    </Box>
                </Box>
              </Box>

              <Box>
                {isMobile ? (
                  <Box>
                    {viewType === 'invoice' && activeCategory === categoryName  && (
                      <Box>
                          <Typography fontFamily={"GT Bold"} fontSize={{md:'30px', xs:'24px'}} mt={'30px'} mb={'30px'} textAlign={'center'}>{categoryName} Invoices.</Typography>
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
                                                      <Typography fontFamily={"GT Light"} fontSize={'15px'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:item.currency}).format(item.total_amount)}</Typography>
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
                    )}
                  </Box>
                ):(
                  <Box padding={'30px'}>
                      {viewType === 'invoice' && activeCategory === categoryName  && (
                        <Box>
                          <Typography fontFamily={"GT Bold"} fontSize={'30px'} textAlign={'center'}>{categoryName} Invoices.</Typography>
                          <DataGrid 
                            columns={invoiceColumns}
                            rows={categoryInvoices}
                            getRowId={(row) => row.id}
                            components={{toolbar:GridToolbar}}
                          />
                        </Box>
                      )}
                  </Box>
                )}

              </Box>

              <Box>
                {isMobile ? (
                  <Box>
                    {viewType === 'bill' && activeCategory === categoryName && (
                      <Box>
                          <Typography fontFamily={"GT Bold"} fontSize={{md:'30px', xs:'24px'}} mt={'30px'} mb={'30px'} textAlign={'center'}>{categoryName} Bills.</Typography>
                          <Box
                              display={'grid'}
                              gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                              gap="20px"
                              margin="0 10px"
                          >

                              {billItemDisplayed && billItemDisplayed.map((item) => (
                                  <Card
                                      key={item.id}
                                      onClick={() => handleViewDetails(item.id)}
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
                                              <Typography fontFamily={"GT Light"} fontSize={'15px'}>{new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.total_amount)}</Typography>
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
                    )}
                  </Box>
                ):(
                  <Box padding={'30px'}>
                    {viewType === 'bill' && activeCategory === categoryName && (
                      <Box>
                        <Typography fontFamily={"GT Bold"} fontSize={'30px'} textAlign={'center'}>{categoryName} Bills.</Typography>
                        <DataGrid 
                          columns={billColumns}
                          rows={categoryBills}
                          getRowId={(row) => row.id}
                          components={{toolbar:GridToolbar}}
                        />
                      </Box>
                    )}
                  </Box>
                )}

              </Box>

        </Box>
     );
}
 
export default ReportLayout;