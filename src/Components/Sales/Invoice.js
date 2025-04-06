import { useEffect, useState } from "react";
import { Box, Card, CardContent, Pagination, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import InvoiceControl from "./InvoiceControl";

function Invoice() {
    const [invoices, setInvoices] = useState([]);
    const [newInvoice, setNewInvoice] = useState('All Invoices')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const token = localStorage.getItem('access_token')
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/invoices', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {

              const filter = data.sort((a,b) => b.id - a.id)
                const invoiceTotal = filter.map((invoice) => {
                    const totalAmount = (invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setInvoices(invoiceTotal);
            });
    }, [token]);

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

    const handleViewDetails = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`);
      };
    
    const columns = [
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
          field: "totalAmount",
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
                onClick={() => handleViewDetails(params.row.id)}
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

    const isMobile = useMediaQuery('(max-width: 768px)');

    const totalPages = Math.ceil(invoices.length / itemsPerPage)
    const displayedItems = invoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };



    return (
        <Box>

          <ToggleButtonGroup
            value={newInvoice}
            onChange={(e) => setNewInvoice(e.target.value)}
            exclusive
            color="secondary"
            sx={{ml:'20px', color:'purple'}}
            style={{color:'purple'}}
          >
            <ToggleButton value={'All Invoices'}>All Invoices</ToggleButton>
            <ToggleButton value={'New Invoices'}>New Invoices</ToggleButton>
          </ToggleButtonGroup>

        {newInvoice === 'New Invoices' ?  
           (<InvoiceControl/>):
           (

            <Box>

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
                            onClick={() => handleViewDetails(item.id)}
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
                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Customer Name:</Typography>
                                            <Typography fontWeight={'bold'}>{item.customer_name}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Invoice Number:</Typography>
                                            <Typography  fontWeight={'bold'}>{item.invoice_number}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Amount:</Typography>
                                            <Typography fontWeight={'bold'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:item.currency}).format(item.totalAmount)}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Currency:</Typography>
                                            <Typography fontWeight={'bold'}>{item.currency}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Date:</Typography>
                                            <Typography fontWeight={'bold'}>{item.invoice_date}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
                                            <Typography>Status:</Typography>
                                            <Typography fontWeight={'bold'}>{item.status}</Typography>
                                        </Box>

                                        <Box display={'flex'} gap={'7px'}>
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
                <Box m="20px">
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
                      rows={invoices}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      />
                  </Box>
                </Box>
              )}
                
            </Box>
           )
            }

        </Box>
        
    );
}

export default Invoice;
