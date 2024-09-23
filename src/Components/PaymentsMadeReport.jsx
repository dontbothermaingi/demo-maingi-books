import { useEffect, useState } from "react";
import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import StatBox from "./StatBox";
import PointOfSale from "@mui/icons-material/PointOfSale";
import { useNavigate } from "react-router-dom";

function PaymentsMadeReport(){


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

    const [payments, setPayments] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [totals,setTotals] = useState([])
    const [selectedCurrency, setSelectedCurrency] = useState("KES"); 
    const [filteredReceivables, setFilteredReceivables] = useState([]);
    const [filteredTotals, setFilteredTotals] = useState([]);
    const navigate = useNavigate();

    const filterByDateRange = (items, startDate, endDate) => {
        if (!startDate || !endDate) return items; // No filter if dates are not set
    
        return items.filter(item => {
            const itemDate = new Date(item.payment_date); // Converts the string to a Date object
            return itemDate >= startDate && itemDate <= endDate;
        });
      };

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/paymentsmade')
        .then(response => response.json())
        .then(data => {
            const datefilter = filterByDateRange(data, startDate,endDate)
            const all = datefilter.map((item) => ({
                ...item,
                payment_amount:new Intl.NumberFormat().format(item.payment_amount)
            }))
            setPayments(all)
            setTotals(datefilter)
        })
    },[startDate,endDate])

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

      const calculatetotal = filteredTotals.reduce((total,item) => total + item.payment_amount, 0)
      const total = new Intl.NumberFormat().format(calculatetotal)

      const handleViewDetails = (vendorId) => {
        navigate(`/vendors/${vendorId}`);
    };

    const handleViewSlip = (madeId) => {
        navigate(`/payment-details/${madeId}`);
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "vendor_name",
          headerName: "Vendor Name",
          flex: 0.2,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.vendor_name)}
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
            field: "vendor_email",
            headerName: "Vendor Email",
            flex: 0.2,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewSlip(params.row.payment)}
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
            field: "vendor_phone",
            headerName: "Vendor Phone",
            flex: 0.1,
        },
        {
            field: "currency",
            headerName: "Currency",
            flex: 0.05,
        },
        {
            field: "bank_name",
            headerName: "Bank Name",
            flex: 0.2,
        },
        {
          field: "payment_amount",
          headerName: "Amount Paid",
          flex: 0.1,
        },
        {
          field: "payment_date",
          headerName: "Payment Date",
          flex: 0.1,
        },
        {
            field: "payment_mode",
            headerName: "Payment Mode",
            flex: 0.1,
        },
        
    ]

    return ( 
        <div>

            {/* Currency Selector */}
            <FormControl width="50px" margin="normal">
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

            <Box mb='20px'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography
                    fontSize='23px'
                    fontWeight='Bold'
                >
                  FILTER BY DATE
                </Typography>
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
                </LocalizationProvider>
            </Box>

            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                marginRight='20px'
                gridAutoRows="140px"
                gap="20px"
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
                    title= {total}
                    subtitle="TOTAL PAYMENTS MADE"
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

            <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    PAYMENTS MADE
                </Typography>
                <Box
                    m="40px 0 0 0"
                    height="75vh"
                    sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        // fontSize: "16px",
                    },
                    "& .name-column--cell": {
                        // color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        // fontSize: "16px",
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
                    rows={filteredReceivables}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => `${row.customer_name}-${row.amount_received}-${row.bank_charges}-${row.payment_date}-${row.payment}-${row.payment_mode}`}
                    />
                </Box>
            </Box>
        </div>
     );
}
 
export default PaymentsMadeReport;