import { useEffect, useState } from "react";
import { Card, CardContent,Pagination,useMediaQuery, } from "@mui/material";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function Banking() {
    const [customers,setCustomers]=useState([])
    const [payementsreceived, setPaymentsRceived] = useState([])
    const [payments,setPayments] = useState([])
    const [vendors,setVendors] = useState([]);
    const [currentInPage, setCurrentInPage] = useState(1)
    const [currentOutPage, setCurrentOutPage] = useState(1)
    const [currentInvoicePage, setCurrentInvoicePage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [invoices, setInvoices] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("KES"); 
    const [filteredReceivables, setFilteredReceivables] = useState([]);
    const token = localStorage.getItem('access_token')
    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/invoices',{
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
                const paid = invoiceTotal.filter(item => item.status === 'PAID')
                setInvoices(paid)
            });
    }, [token]);

    useEffect(() => {
      fetch('https://demo-server-757m.onrender.com/paymentsmade',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
      })
          .then(response => response.json())
          .then((data) => {
              const formattedPayment = data.map((payments) => ({
                  ...payments,
                  payment_amount: payments.payment_amount
              }))
              setPayments(formattedPayment)})
  }, [token]);


  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/customers',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
    })
        .then(response => response.json())
        .then(data => {
            setCustomers(data);
        })
        .catch(error => console.error('Error fetching bills:', error));
}, [token]);

useEffect(() => {
  // Filter data by selected currency
  const filtered = customers.filter(item => item.currency === selectedCurrency);
  setFilteredReceivables(filtered);
}, [customers, selectedCurrency]);

const handleCurrencyChange = (event) => {
  setSelectedCurrency(event.target.value);
};

useEffect(() => {
  fetch('https://demo-server-757m.onrender.com/vendors',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
  })
      .then(response => response.json())
      .then(data => {
          setVendors(data);
      })
      .catch(error => console.error('Error fetching bills:', error));
}, [token]);


  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/paymentsreceived',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
    })
        .then(response => response.json())
        .then(data => {
            setPaymentsRceived(data);
        })
        .catch(error => console.error('Error fetching bills:', error));
}, [token]);

    //Calculate Paid Revenue
    const calculatePaidCustomerAmount = (items) => items.reduce((total, item) => total + (item.amount_paid || 0), 0);
    const paidCustomer = calculatePaidCustomerAmount(filteredReceivables)
    const formattedPaidAmount = new Intl.NumberFormat().format(paidCustomer);

    // Calculate Unpaid Revenue
    const calculateUnpaidRevenue = (items) => items.reduce((total, item) => total + (item.total_amount_owed || 0), 0);
    const unpaidRevenue = calculateUnpaidRevenue(filteredReceivables)
    const formattedUnpaidAmount = new Intl.NumberFormat().format(unpaidRevenue);

    // Calculate Debited Cash
    const calculateDebitedCash = (items) => items.reduce((total, item) => total + (item.total_amount_owed || 0), 0);
    const unpaidDebit = calculateDebitedCash(vendors)
    const formattedBillAmount = new Intl.NumberFormat('en-KE',{style:'currency', currency:'KES'}).format(unpaidDebit);


    const currencyOptions = [
      { code: "AED", label: "United Arab Emirates Dirham" },
      { code: "AFN", label: "Afghan Afghani" },
      { code: "ALL", label: "Albanian Lek" },
      { code: "AMD", label: "Armenian Dram" },
      { code: "ANG", label: "Netherlands Antillean Guilder" },
      { code: "AOA", label: "Angolan Kwanza" },
      { code: "ARS", label: "Argentine Peso" },
      { code: "AUD", label: "Australian Dollar" },
      { code: "AWG", label: "Aruban Florin" },
      { code: "AZN", label: "Azerbaijani Manat" },
      { code: "BAM", label: "Bosnia and Herzegovina Convertible Mark" },
      { code: "BBD", label: "Barbadian Dollar" },
      { code: "BDT", label: "Bangladeshi Taka" },
      { code: "BGN", label: "Bulgarian Lev" },
      { code: "BHD", label: "Bahraini Dinar" },
      { code: "BIF", label: "Burundian Franc" },
      { code: "BMD", label: "Bermudian Dollar" },
      { code: "BND", label: "Brunei Dollar" },
      { code: "BOB", label: "Bolivian Boliviano" },
      { code: "BRL", label: "Brazilian Real" },
      { code: "BSD", label: "Bahamian Dollar" },
      { code: "BTN", label: "Bhutanese Ngultrum" },
      { code: "BWP", label: "Botswana Pula" },
      { code: "BYN", label: "Belarusian Ruble" },
      { code: "BZD", label: "Belize Dollar" },
      { code: "CAD", label: "Canadian Dollar" },
      { code: "CDF", label: "Congolese Franc" },
      { code: "CHF", label: "Swiss Franc" },
      { code: "CLP", label: "Chilean Peso" },
      { code: "CNY", label: "Chinese Yuan" },
      { code: "COP", label: "Colombian Peso" },
      { code: "CRC", label: "Costa Rican Colón" },
      { code: "CUP", label: "Cuban Peso" },
      { code: "CVE", label: "Cape Verdean Escudo" },
      { code: "CZK", label: "Czech Koruna" },
      { code: "DJF", label: "Djiboutian Franc" },
      { code: "DKK", label: "Danish Krone" },
      { code: "DOP", label: "Dominican Peso" },
      { code: "DZD", label: "Algerian Dinar" },
      { code: "EGP", label: "Egyptian Pound" },
      { code: "ERN", label: "Eritrean Nakfa" },
      { code: "ETB", label: "Ethiopian Birr" },
      { code: "EUR", label: "Euro" },
      { code: "FJD", label: "Fijian Dollar" },
      { code: "FKP", label: "Falkland Islands Pound" },
      { code: "FOK", label: "Faroese Króna" },
      { code: "GBP", label: "British Pound Sterling" },
      { code: "GEL", label: "Georgian Lari" },
      { code: "GHS", label: "Ghanaian Cedi" },
      { code: "GIP", label: "Gibraltar Pound" },
      { code: "GMD", label: "Gambian Dalasi" },
      { code: "GNF", label: "Guinean Franc" },
      { code: "GTQ", label: "Guatemalan Quetzal" },
      { code: "GYD", label: "Guyanese Dollar" },
      { code: "HKD", label: "Hong Kong Dollar" },
      { code: "HNL", label: "Honduran Lempira" },
      { code: "HRK", label: "Croatian Kuna" },
      { code: "HTG", label: "Haitian Gourde" },
      { code: "HUF", label: "Hungarian Forint" },
      { code: "IDR", label: "Indonesian Rupiah" },
      { code: "ILS", label: "Israeli New Shekel" },
      { code: "INR", label: "Indian Rupee" },
      { code: "IQD", label: "Iraqi Dinar" },
      { code: "IRR", label: "Iranian Rial" },
      { code: "ISK", label: "Icelandic Króna" },
      { code: "JMD", label: "Jamaican Dollar" },
      { code: "JOD", label: "Jordanian Dinar" },
      { code: "JPY", label: "Japanese Yen" },
      { code: "KES", label: "Kenyan Shilling" },
      { code: "KGS", label: "Kyrgyzstani Som" },
      { code: "KHR", label: "Cambodian Riel" },
      { code: "KID", label: "Kiribati Dollar" },
      { code: "KMF", label: "Comorian Franc" },
      { code: "KRW", label: "South Korean Won" },
      { code: "KWD", label: "Kuwaiti Dinar" },
      { code: "KYD", label: "Cayman Islands Dollar" },
      { code: "KZT", label: "Kazakhstani Tenge" },
      { code: "LAK", label: "Laotian Kip" },
      { code: "LBP", label: "Lebanese Pound" },
      { code: "LKR", label: "Sri Lankan Rupee" },
      { code: "LRD", label: "Liberian Dollar" },
      { code: "LSL", label: "Lesotho Loti" },
      { code: "LYD", label: "Libyan Dinar" },
      { code: "MAD", label: "Moroccan Dirham" },
      { code: "MDL", label: "Moldovan Leu" },
      { code: "MGA", label: "Malagasy Ariary" },
      { code: "MKD", label: "Macedonian Denar" },
      { code: "MMK", label: "Burmese Kyat" },
      { code: "MNT", label: "Mongolian Tugrik" },
      { code: "MOP", label: "Macanese Pataca" },
      { code: "MRU", label: "Mauritanian Ouguiya" },
      { code: "MUR", label: "Mauritian Rupee" },
      { code: "MVR", label: "Maldivian Rufiyaa" },
      { code: "MWK", label: "Malawian Kwacha" },
      { code: "MXN", label: "Mexican Peso" },
      { code: "MYR", label: "Malaysian Ringgit" },
      { code: "MZN", label: "Mozambican Metical" },
      { code: "NAD", label: "Namibian Dollar" },
      { code: "NGN", label: "Nigerian Naira" },
      { code: "NIO", label: "Nicaraguan Córdoba" },
      { code: "NOK", label: "Norwegian Krone" },
      { code: "NPR", label: "Nepalese Rupee" },
      { code: "NZD", label: "New Zealand Dollar" },
      { code: "OMR", label: "Omani Rial" },
      { code: "PAB", label: "Panamanian Balboa" },
      { code: "PEN", label: "Peruvian Nuevo Sol" },
      { code: "PGK", label: "Papua New Guinean Kina" },
      { code: "PHP", label: "Philippine Peso" },
      { code: "PKR", label: "Pakistani Rupee" },
      { code: "PLN", label: "Polish Zloty" },
      { code: "PYG", label: "Paraguayan Guarani" },
      { code: "QAR", label: "Qatari Rial" },
      { code: "RON", label: "Romanian Leu" },
      { code: "RSD", label: "Serbian Dinar" },
      { code: "RUB", label: "Russian Ruble" },
      { code: "RWF", label: "Rwandan Franc" },
      { code: "SAR", label: "Saudi Riyal" },
      { code: "SBD", label: "Solomon Islands Dollar" },
      { code: "SCR", label: "Seychellois Rupee" },
      { code: "SDG", label: "Sudanese Pound" },
      { code: "SEK", label: "Swedish Krona" },
      { code: "SGD", label: "Singapore Dollar" },
      { code: "SHP", label: "Saint Helena Pound" },
      { code: "SLL", label: "Sierra Leonean Leone" },
      { code: "SOS", label: "Somali Shilling" },
      { code: "SRD", label: "Surinamese Dollar" },
      { code: "SSP", label: "South Sudanese Pound" },
      { code: "STN", label: "São Tomé and Príncipe Dobra" },
      { code: "SVC", label: "Salvadoran Colón" },
      { code: "SYP", label: "Syrian Pound" },
      { code: "SZL", label: "Swazi Lilangeni" },
      { code: "THB", label: "Thai Baht" },
      { code: "TJS", label: "Tajikistani Somoni" },
      { code: "TMT", label: "Turkmenistani Manat" },
      { code: "TND", label: "Tunisian Dinar" },
      { code: "TOP", label: "Tongan Paʻanga" },
      { code: "TRY", label: "Turkish Lira" },
      { code: "TTD", label: "Trinidad and Tobago Dollar" },
      { code: "TVD", label: "Tuvaluan Dollar" },
      { code: "TZS", label: "Tanzanian Shilling" },
      { code: "UAH", label: "Ukrainian Hryvnia" },
      { code: "UGX", label: "Ugandan Shilling" },
      { code: "USD", label: "United States Dollar" },
      { code: "UYU", label: "Uruguayan Peso" },
      { code: "UZS", label: "Uzbekistani Som" },
      { code: "VES", label: "Venezuelan Bolívar Soberano" },
      { code: "VND", label: "Vietnamese Dong" },
      { code: "VUV", label: "Vanuatu Vatu" },
      { code: "WST", label: "Samoan Tala" },
      { code: "XAF", label: "Central African CFA Franc" },
      { code: "XAG", label: "Silver Ounce" },
      { code: "XAU", label: "Gold Ounce" },
      { code: "XCD", label: "East Caribbean Dollar" },
      { code: "XDR", label: "Special Drawing Rights" },
      { code: "XOF", label: "West African CFA Franc" },
      { code: "XPF", label: "CFP Franc" },
      { code: "YER", label: "Yemeni Rial" },
      { code: "ZAR", label: "South African Rand" },
      { code: "ZMW", label: "Zambian Kwacha" },
      { code: "ZWL", label: "Zimbabwean Dollar" }
  ];


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
          field: "totalAmount",
          headerName: "Amount",
          flex: 0.3,
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
          headerName: "STATUS",
          flex: 0.4,
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
    ]

    function handlePayment(madeId){
      navigate(`/payment-report/${madeId}`)
  }

  const transactioncolumns = [
      { field: "id", headerName: "ID", flex: 0.05 },
      {
        field: "customer_name",
        headerName: "CUSTOMER NAME",
        headerAlign: "left",
        cellClassName: "name-column--cell",
        flex: 0.3,
        align: "left",
        renderCell: (params) => (
          <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
          }}
          onClick={() => handlePayment(params.row.id)}
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
          renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handlePayment(params.row.id)}
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
          renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handlePayment(params.row.id)}
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
          flex: 0.15,
          renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handlePayment(params.row.id)}
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
        field: "amount_received",
        headerName: "AMOUNT RECEIVED",
        flex: 0.2,
        renderCell: (params) => {
          // Use Intl.NumberFormat for currency formatting
          const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency] || 'en-KE', {
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
            >
              <Typography variant="h7">
                {formattedAmount}  {/* Display formatted amount */}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "payment_date",
        headerName: "PAYMENT DATE",
        flex: 0.15,
      },
      {
        field: "payment_mode",
        headerName: "PAYMENT MODE",
        flex: 0.2,
      },
    ];

  const transactionoutcolumns = [
    { field: "id", headerName: "ID", flex: 0.05 },
    {
      field: "vendor_name",
      headerName: "VENDOR NAME",
      headerAlign: "left",
      cellClassName: "name-column--cell",
      flex: 0.3,
      align: "left",
    },
    {
        field: "vendor_email",
        headerName: "VENDOR EMAIL",
        flex: 0.3,
    },
    {
        field: "vendor_phone",
        headerName: "VENDOR PHONE",
        flex: 0.2,
    },
    {
        field: "currency",
        headerName: "CURRENCY",
        flex: 0.15,
    },
    {
      field: "payment_amount",
      headerName: "AMOUNT RECEIVED",
      flex: 0.2,
      renderCell: (params) => {
        // Use Intl.NumberFormat for currency formatting
        const formattedAmount = new Intl.NumberFormat(currencyLocaleMap[params.row.currency] || 'en-KE', {
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
          >
            <Typography variant="h7">
              {formattedAmount}  {/* Display formatted amount */}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "payment_date",
      headerName: "PAYMENT DATE",
      flex: 0.15,
    },
    {
      field: "payment_mode",
      headerName: "PAYMENT MODE",
      flex: 0.2,
    },
  ];

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

  const totalInPages = Math.ceil(payementsreceived.length / itemsPerPage)
  const displayedInItems = payementsreceived.slice((currentInPage - 1)*itemsPerPage, currentInPage * itemsPerPage)

  const totalOutPages = Math.ceil(payments.length / itemsPerPage)
  const displayedOutItems = payments.slice((currentOutPage - 1)*itemsPerPage, currentOutPage * itemsPerPage)

  const totalInvoicePages = Math.ceil(invoices.length / itemsPerPage)
  const displayedInvoiceItems = invoices.slice((currentInvoicePage - 1)*itemsPerPage, currentInvoicePage * itemsPerPage)
  

  const handleInPageChange = (event, value) => {
      setCurrentInPage(value);
  };

  const handleOutPageChange = (event, value) => {
    setCurrentOutPage(value);
  };

  const handleInvoicePageChange = (event, value) => {
    setCurrentInvoicePage(value);
  };

    return (
        <Box height={'100vh'} overflow={'auto'}>

          {/* Currency Selector */}
          <FormControl width="50px" sx={{margin:'40px'}}>
              <InputLabel>Select Currency</InputLabel>
              <Select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                label="Select Currency"
              >
                {currencyOptions.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.label}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>

        <Box
            display={'grid'}
            gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(4,1fr)'}}
            gap="10px"
            margin="0 10px"
        >

          
            <Card
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto', // Adjust height for better flexibility
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '10px',
                  margin: '30px',
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
              }}
            >
                <CardContent sx={{display:'flex', flexDirection:'column'}}>
                  <Typography fontWeight={'bold'} textAlign={'center'}>PAID REVENUE</Typography>
                  <Typography textAlign={'center'}>{formattedPaidAmount}</Typography>
                </CardContent>
            </Card>
            
            <Card
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto', // Adjust height for better flexibility
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '10px',
                  margin: '30px',
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
              }}
            >
                <CardContent sx={{display:'flex', flexDirection:'column'}}>
                  <Typography fontWeight={'bold'} textAlign={'center'}>TOTAL RECEIVABLES</Typography>
                  <Typography textAlign={'center'}>{formattedUnpaidAmount}</Typography>
                </CardContent>
            </Card>

            <Card
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto', // Adjust height for better flexibility
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '10px',
                  margin: '30px',
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
            >

                <CardContent sx={{display:'flex', flexDirection:'column'}}>
                  <Typography fontWeight={'bold'} textAlign={'center'}>TOTAL PAYABLES</Typography>
                  <Typography textAlign={'center'}>{formattedBillAmount}</Typography>
                </CardContent>

            </Card>

          </Box>

            <Box
              display={'grid'}
              gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
              gap="10px"
              margin="0 10px"
              paddingBottom={'30px'}

            >
            <Card
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto', // Adjust height for better flexibility
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '10px',
                  margin: {xs:"0px", md:'30px'},
                  backgroundColor: '#fff',
                  paddingBottom:'30px'
                  
                }}
              >
                {isMobile ? (
                                  <Box>
                                  <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>TRANSACTIONS IN</Typography>
                                  <Box
                                      display={'grid'}
                                      gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                                      gap="10px"
                                      margin="0 10px"
                                  >
                  
                                      {displayedInItems.map((item) => (
                                          <Card
                                              key={item.id}
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
                                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.customer_name}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Phone No:</Typography>
                                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.customer_phone}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Email:</Typography>
                                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.customer_email}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Amount Received:</Typography>
                                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:item.currency}).format(item.amount_received)}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Bank Charges:</Typography>
                                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.bank_charges}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Payment Date:</Typography>
                                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.payment_date}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Payment Mode:</Typography>
                                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.payment_mode}</Typography>
                                                      </Box>
                                              </CardContent>
                                          </Card>
                                      ))}
                                      <Box display="flex" justifyContent="center" mt="20px">
                                              <Pagination count={totalInPages} page={currentInPage} onChange={handleInPageChange} color="secondary" />
                                      </Box>
                                  </Box>
                                </Box>

                                ):(
                                  <Box>
                                  <Typography fontSize={'25px'} fontWeight={'bold'} textAlign={'center'}>TRANSACTIONS IN</Typography>
                                  <Box m="20px">
                                        <Typography 
                                            fontSize='30px'
                                            fontWeight='bold'
                                            textAlign='center'
                                            mt='30px'
                                        >
                                        </Typography>
                                      <Box>
                                          <DataGrid
                                            rows={payementsreceived}
                                            columns={transactioncolumns}
                                            components={{ Toolbar: GridToolbar }}
                                            getRowId={(row) => row.id}
                                        />
                                      </Box>
                                  </Box>
                                  </Box>
                                )}
                    </Card>

            </Box>

            <Box
              display={'grid'}
              gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
              gap="10px"
              margin="0 10px"
              paddingBottom={'30px'}
            >
            
            <Card
                sx={{
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto', // Adjust height for better flexibility
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '10px',
                  margin: {xs:"0px", md:'30px'},
                  backgroundColor: '#fff',
                  paddingBottom:'20px'
                  
                }}
              >

                {isMobile ? (
                   <Box>
                   <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>TRANSACTIONS OUT</Typography>
                   <Box
                       display={'grid'}
                       gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                       gap="10px"
                       margin="0 10px"
                   >
   
                       {displayedOutItems.map((item) => (
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
                                           <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Name:</Typography>
                                           <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.vendor_name}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Vendor Phone:</Typography>
                                           <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.vendor_phone}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Email:</Typography>
                                           <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.vendor_email}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Amount:</Typography>
                                           <Typography fontFamily={"GT Light"} fontSize={'15px'}>{new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:item.currency}).format(item.payment_amount)}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Payment Date:</Typography>
                                           <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.payment_date}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Payment Mode:</Typography>
                                           <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.payment_mode}</Typography>
                                       </Box>
                               </CardContent>
                           </Card>
                       ))}
                       <Box display="flex" justifyContent="center" mt="20px">
                               <Pagination count={totalOutPages} page={currentOutPage} onChange={handleOutPageChange} color="secondary" />
                       </Box>
                   </Box>
                 </Box>
                ):(
                  <Box>
                  <Typography fontSize={'25px'} fontWeight={'bold'} textAlign={'center'}>TRANSACTIONS OUT</Typography>
                  <Box m="20px">
                        <Typography 
                            fontSize='30px'
                            fontWeight='bold'
                            textAlign='center'
                            mt='30px'
                        >
                        </Typography>
                        
                        <Box
                            height="75vh"
                        >
                            <DataGrid
                              rows={payments}
                              columns={transactionoutcolumns}
                              components={{ Toolbar: GridToolbar }}
                              getRowId={(row) => row.id}
                            />
                        </Box>
                  </Box>
              </Box>
                )}
               
        
            </Card>

            </Box>

            {isMobile ? (
              <Box>
              <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>PAID INVOICES</Typography>
              <Box
                  display={'grid'}
                  gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                  gap="10px"
                  margin="0 10px"
                  paddingBottom={'30px'}
              >

                  {displayedInvoiceItems.map((item) => (
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
                                      <Box display={'flex'} gap={'7px'}>
                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Name:</Typography>
                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.customer_name}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'7px'}>
                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Invoice Number:</Typography>
                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{item.invoice_number}</Typography>
                                      </Box>

                                      <Box display={'flex'} gap={'7px'}>
                                          <Typography fontFamily={"GT Medium"} fontSize={'15px'}>Amount:</Typography>
                                          <Typography fontFamily={"GT Light"} fontSize={'15px'}>{ new Intl.NumberFormat('en-KE', {style:'currency', currency:item.currency}).format(item.totalAmount)}</Typography>
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
                          <Pagination count={totalInvoicePages} page={currentInvoicePage} onChange={handleInvoicePageChange} color="secondary" />
                  </Box>
              </Box>
              </Box>
            ):(
              <Box m="20px">
                    <Typography 
                        fontSize='30px'
                        fontWeight='bold'
                        textAlign='center'
                        mt='30px'
                    >
                        PAID INVOICES
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

                    <Typography variant="h6" color="black" fontWeight="bold" mt="10px" ml="20px" mb={'30px'}>
                        Total Paid Amount: {formattedPaidAmount}
                </Typography>
            </Box>
            )}

            
           
        </Box>
    );
}

export default Banking;
