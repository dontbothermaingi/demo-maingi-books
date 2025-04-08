import { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, useMediaQuery, Card, CardContent, Pagination } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import StatBox from "./StatBox";
import {PointOfSale } from "@mui/icons-material";
import { tokens } from "../theme";
import {useTheme } from "@mui/material";

function AccountsReceivables() {

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const token = localStorage.getItem('access_token')
  

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


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [receivables, setReceivables] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("KES"); 
    const [filteredReceivables, setFilteredReceivables] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/customers',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.filter((item) => item.total_amount_owed > 0);
        const formatted = filtered.map((item) => ({
          ...item,
          total_amount_owed: new Intl.NumberFormat().format(item.total_amount_owed),
        }));
        setReceivables(formatted);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, [token]);


  useEffect(() => {
    // Filter data by selected currency
    const filtered = receivables.filter(item => item.currency === selectedCurrency);
    setFilteredReceivables(filtered);
  }, [receivables, selectedCurrency]);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const calculateTotal = (items) =>
    items.reduce((total, item) => total + (parseFloat(item.total_amount_owed.replace(/,/g, "")) || 0), 0);

  const total = calculateTotal(receivables)

  const handleViewDetails = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const columns = [
    {
        field: "customer_name",
        headerName: "Customer Name",
        flex: 0.3,
        cellClassName: "name-column--cell",
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
        field: "customer_type",
        headerName: "TYPE",
        flex: 0.2,
        cellClassName: "name-column--cell",
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
      headerName: "CUSTOMER EMAIL",
      flex: 0.3,
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
      field: "customer_phone",
      headerName: "CUSTOMER PHONE",
      flex: 0.2,
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
        field: "kra_pin",
        headerName: "KRA PIN",
        flex: 0.3,
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
        field: "currency",
        headerName: "CURRENCY",
        flex: 0.3,
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
        field: "total_amount_owed",
        headerName: "Amount Owed",
        flex: 0.3,
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
    }

  ];

  const totalPages = Math.ceil(filteredReceivables.length / itemsPerPage)
  const displayedItems = filteredReceivables.slice((currentPage-1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (event, value) => {
      setCurrentPage(value);
  };

  return (
    <Box margin={{md:'40px', xs:'20px'}}>

      {/* Currency Selector */}
      <FormControl width="50px" sx={{margin:'20px'}}>
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
            gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
            gap="10px"
            margin="0 10px"
        >
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <StatBox
                    title={`${new Intl.NumberFormat('en-KE',{style:'currency', currency:'KES'}).format(total)}`}
                    subtitle="AMOUNT RECEIVABLE"
                    icon={
                        <PointOfSale
                            sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
                        />
                    }
                />
            </Box>
        </Box>
        {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>ACCOUNT RECEIVABLES</Typography>
                    <Box
                        display={'grid'}
                        gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                        gap="10px"
                        margin="0 10px"
                    >
                        {displayedItems.map((item) => (
                            <Card
                            key={item.id}
                            onClick={() => handleViewDetails(item.vendor_name)}
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
                                    <Typography>Customer Name: {item.customer_name}</Typography>
                                    <Typography>Customer Email: {item.customer_email}</Typography>
                                    <Typography>Customer Phone: {item.customer_phone}</Typography>
                                    <Typography>KRA Pin: {item.kra_pin}</Typography>
                                    <Typography>Currency: {item.currency}</Typography>
                                    <Typography>Amount Owed: {item.total_amount_owed}</Typography>
                                    <Typography>Date: {item.date}</Typography>
                                </CardContent>

                            </Card>
                        ))}

                    </Box>

                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
                    </Box>
                </Box>
            ):(
                 <Box m="20px" mt='50px'>
                 <Typography fontWeight="bold" variant="h5" textAlign="center">
                      ACCOUNT RECEIVABLES
                 </Typography>
                 <Box
                   margin='auto'
                   mt='20px'
                   height="75vh"
                   // width="1000px"
                   sx={{
                     "& .MuiDataGrid-root": {
                       border: "none",
                     },
                     "& .MuiDataGrid-cell": {
                       borderBottom: "none",
                     },
                     "& .name-column--cell": {},
                     "& .MuiDataGrid-columnHeaders": {
                       borderBottom: "none",
                     },
                     "& .MuiDataGrid-virtualScroller": {},
                     "& .MuiDataGrid-footerContainer": {
                       borderTop: "none",
                     },
                     "& .MuiCheckbox-root": {},
                     "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
                   }}
                 >
                   <DataGrid
                     rows={filteredReceivables}
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
    </Box>
  );
}

export default AccountsReceivables;
