import { useEffect, useState } from "react";
import { Box,ToggleButton,ToggleButtonGroup,Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import BillControl from "./BiilControl";
import {useMediaQuery, CardContent, Pagination, Card } from "@mui/material";


function Bill() {
    const [bills, setBills] = useState([]);
    const [isNewBill, setIsNewBill] = useState("All Bills")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        vendor_name: "",
        vendor_phone: "",
        vendor_email: "",
        vendor_pin:"",
        bill_number: "",
        account_name: "",
        order_number: "",
        bill_date: "",
        due_date: "",
        type_name:"",
        category_name:"",
        subcategory_name:"",
        currency:"",
        payment_terms: "",
        payment_made:0,
        status:"",
        type_vat: "Inclusive VAT",
        items: [],
    });

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/newbills',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {

              const sort = data.sort((a,b) => b.id - a.id)
                const invoiceTotal = sort.map((invoice) => {
                    const totalAmount = (invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setBills(invoiceTotal);
            });
    }, [token]);

    useEffect(() => {
        if (formData.payment_terms && formData.bill_date) {
            calculateDueDate(formData.payment_terms, formData.bill_date);
        }
    }, [formData.payment_terms, formData.bill_date]);

   const navigate = useNavigate()

    function calculateDueDate(terms, invoiceDate) {
        const date = new Date(invoiceDate);
        switch (terms) {
            case 'Cash':
                date.setDate(date.getDate())
                break;
            case '15 days':
                date.setDate(date.getDate() + 15);
                break;
            case '30 days':
                date.setDate(date.getDate() + 30);
                break;
            case '45 days':
                date.setDate(date.getDate() + 45);
                break;
            case '60 days':
                date.setDate(date.getDate() + 60);
                break;
            default:
                return;
        }
        setFormData(prevFormData => ({
            ...prevFormData,
            due_date: date.toISOString().split('T')[0]
        }));
    }

    const handleViewDetails = (billId) => {
        navigate(`/newbills/${billId}`);
      };

    const columns = [
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
            field: "totalAmount",
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
    ]

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

    const totalPages = Math.ceil(bills.length / itemsPerPage)
    const displayedItems = bills.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    return (
        <div>

          <ToggleButtonGroup
            value={isNewBill}
            onChange={(e) => setIsNewBill(e.target.value)}
            exclusive
            color="secondary"
            sx={{ml:'20px'}}
          >
            <ToggleButton value={"All Bills"}>All Bills</ToggleButton>
            <ToggleButton value={"New Bills"}>New Bills</ToggleButton>
          </ToggleButtonGroup>

          {isNewBill === 'New Bills' ? 
            <BillControl /> 
                  :
            <Box>
              {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>BILLS</Typography>
                <Box
                    display={'grid'}
                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                    gap="10px"
                    margin="0 10px"
                >

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
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
                                    <Typography>Vendor Name:</Typography>
                                    <Typography fontWeight={'bold'}>{item.vendor_name}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Bill Number:</Typography>
                                    <Typography fontWeight={'bold'}>{item.bill_number}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Bill Date: {item.bill_date}</Typography>
                                    <Typography fontWeight={'bold'}>{item.bill_date}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Payment Terms:</Typography>
                                    <Typography fontWeight={'bold'}>{item.payment_terms}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Amount:</Typography>
                                    <Typography fontWeight={'bold'}>{new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:'KES'}).format(item.totalAmount)}</Typography>
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
                      BILLS
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={bills}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      />
                  </Box>
                </Box>
              )}
            </Box>
            }
        </div>
    );
}

export default Bill;
