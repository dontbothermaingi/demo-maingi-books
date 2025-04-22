import { useEffect, useState } from "react";
import { Box, TextField, Typography , Select, MenuItem, FormControl, InputLabel, useMediaQuery, Card, CardContent, Pagination} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";


function PaymentsRececivedReport(){

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');


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

    const [payments, setPayments] = useState([]);
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [totals,setTotals] = useState([])
    const [selectedCurrency, setSelectedCurrency] = useState("KES"); 
    const [filteredReceivables, setFilteredReceivables] = useState([]);
    const [filteredTotals, setFilteredTotals] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token')


    const filterByDateRange = (items, startDate, endDate) => {
        if (!startDate || !endDate) return items; // No filter if dates are not set
    
        return items.filter(item => {
            const itemDate = new Date(item.payment_date); // Converts the string to a Date object
            return itemDate >= startDate && itemDate <= endDate;
        });
      };

    useEffect(()=>{
        fetch('https://maingi-demo-server.onrender.com/paymentsreceived',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
        })
        .then(response => response.json())
        .then(data => {
            const datefilter = filterByDateRange(data, startDate,endDate)
            const all = datefilter.map((item) => ({
                ...item,
            }))
            setPayments(all)
            setTotals(datefilter)
        })
    },[startDate,endDate,token])

      useEffect(() => {
        // Filter data by selected currency
        const filtered = payments.filter(item => item.currency === selectedCurrency);
        const filteredTotal = totals.filter(item => item.currency === selectedCurrency);
        setFilteredReceivables(filtered);
        setFilteredTotals(filteredTotal)
      }, [payments, selectedCurrency, totals]);
    
      const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
      };

      const calculatetotal = filteredTotals.reduce((total,item) => total + item.amount_received, 0)

      const handleViewDetails = (customerId) => {
        navigate(`/customers/${customerId}`);
    };

    const columns = [
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
            onClick={() => handleViewDetails(params.row.customer_name)}
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
        },
        {
            field: "customer_phone",
            headerName: "Customer Phone",
            flex: 0.15,
        },
        {
            field: "currency",
            headerName: "Currency",
            flex: 0.1,
        },
        {
            field: "bank_name",
            headerName: "Bank Name",
            flex: 0.3,
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
          field: "bank_charges",
          headerName: "BANK CHARGES",
          flex: 0.17,
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

    const totalPages = Math.ceil(filteredTotals.length / itemsPerPage)
    const displayedItems = filteredReceivables.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)

    const total = new Intl.NumberFormat(currencyLocaleMap[selectedCurrency], {style:'currency', currency:selectedCurrency}).format(calculatetotal)


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return ( 
        <Box margin={{md:'40px', xs:'10px'}}>
          <Box display={'flex'} justifyContent={{md:'space-between', xs:''}} flexDirection={{xs:'column', md:'row'}} alignItems={'center'} mb={'20px'}>

            <Box m='30px'>
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

            {/* Currency Selector */}
            <FormControl>
              <InputLabel id="currency-label">Currency</InputLabel>
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
          </Box>

            <Box
            sx={{
              backgroundColor:'purple',
              borderRadius:'10px',
              padding:'20px',
              width:{xs:'300px', md:'400px'},
              margin:'auto'
            }}
          >
            <Typography fontFamily={"GT Bold"} fontSize={"27px"} color={'white'} textAlign={'center'}>Payments Received</Typography>
            <Typography fontFamily={"GT Bold"} fontSize={"27px"} color={'white'} textAlign={'center'}>{total}</Typography>
          </Box>


            {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} mt={"20px"}>PAYMENTS RECEIVED</Typography>
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
                      PAYMENTS RECEIVED
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={filteredReceivables}
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
 
export default PaymentsRececivedReport;