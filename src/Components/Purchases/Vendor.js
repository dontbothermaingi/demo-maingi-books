import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, FormControl, MenuItem, Pagination, Select, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

function Vendor() {
    const [vendors, setVendors] = useState([]);
    const [isNewVendor, setIsNewVendor] = useState("All Vendors")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        vendor_name: "",
        vendor_email: "",
        vendor_phone: "",
        opening_balance: "",
        total_amount_owed: "",
        amount_paid:"",
        currency:"",
        kra_pin:"",
    });


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

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/vendors',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then((data) => {
                const formattedVendors = data.map((vendor) => ({
                    ...vendor,
                    total_amount_owed: new Intl.NumberFormat().format(vendor.total_amount_owed)
                }))
                setVendors(formattedVendors)});
    }, [token]);

    function handleChange(event) {
        const {name,value} = event.target
        const upperCasedValue = name === 'vendor_name' ? value.toUpperCase() : value
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:upperCasedValue
        }))
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch('https://demo-server-757m.onrender.com/vendors', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            credentials:'include',
            body: JSON.stringify({
                ...formData,
                total_amount_owed: 0,
                amount_paid: 0,
            })
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);

                fetch('https://demo-server-757m.onrender.com/vendors', {
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    },
                    credentials:'include'
                })
                .then(response => response.json())
                .then((data) => {
                    const formattedVendors = data.map((vendor) => ({
                        ...vendor,
                        total_amount_owed: new Intl.NumberFormat().format(vendor.total_amount_owed)
                    }))
                    setVendors(formattedVendors)});

                    
                setFormData({
                    vendor_name: "",
                    vendor_email: "",
                    vendor_phone: "",
                    opening_balance: "",
                    currency:"",
                    kra_pin: "",
                    total_amount_owed: "",
                    amount_paid:"",
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function handleVendor(vendorId) {
        navigate(`/vendors/${vendorId}`);
    }

    const columns = [
        {
          field: "vendor_name",
          headerName: "VENDOR NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.4,
          align: "left",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              margin: '15px'
            }}
            onClick={() => handleVendor(params.row.id)}
          >
            <Typography>
              {params.value}
            </Typography>
          </Box>
          ),
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
          field: "kra_pin",
          headerName: "KRA PIN",
          flex: 0.2,
        },
      ];

      const totalPages = Math.ceil(vendors.length / itemsPerPage)
      const displayedItems = vendors.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)
    

      const handlePageChange = (event, value) => {
        setCurrentPage(value);
       };

    return (
        <Box height={'100vh'} overflow={'auto'}>

            <ToggleButtonGroup
                onChange={(e) => setIsNewVendor(e.target.value)}
                value={isNewVendor}
                exclusive
                color="secondary"
                sx={{ml:'20px', mt:'10px'}}
            >
                <ToggleButton value={'All Vendors'}>All Vendors</ToggleButton>
                <ToggleButton value={'New Vendors'}>New Vendor</ToggleButton>

            </ToggleButtonGroup>

            {isNewVendor === "All Vendors" ? "" : 
            
            <div>
                <Box>
                    <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>NEW VENDOR</Typography>
                    <Box>
                        <form style={{display:'flex', flexDirection:'column', margin:'40px'}} onSubmit={handleSubmit}>

                            <TextField
                                type="text"
                                name="vendor_name"
                                label="Vendor Name"
                                value={formData.vendor_name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />
                            
                            <TextField
                                type="text"
                                name="vendor_email"
                                label="Vendor Email"
                                className="bill-inputfield"
                                value={formData.vendor_email}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <TextField
                                type="text"
                                name="vendor_phone"
                                label="Vendor Phone"
                                value={formData.vendor_phone}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <TextField
                                type="text"
                                name="kra_pin"
                                label="KRA PIN"
                                value={formData.kra_pin}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mb:'20px'}}
                            />

                            <FormControl>
                                    <Typography fontWeight={'bold'}>CURRENCY</Typography>
                                    <Select
                                    value={formData.currency}
                                    name="currency"
                                    onChange={handleChange}
                                    className="bill-inputfield"
                                    sx={{mb:'20px'}}
                                    >
                                    <MenuItem value="">Select Currency</MenuItem>
                                    {currencyOptions.map((option) => (
                                        <MenuItem key={option.code} value={option.code}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                    </Select>
                            </FormControl>

                            <TextField
                                type="number"
                                name="opening_balance"
                                placeholder="Opening Balance"
                                className="bill-inputfield"
                                value={formData.opening_balance}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mb:'20px'}}
                                required
                            />

                            <Button type="submit" variant="contained" color="secondary">Save</Button>
                        </form>
                    </Box>
                </Box>
            </div>
            }

<Box>
            {isMobile ? (
                <Box>
                    <Typography textAlign={'center'} fontSize={'30px'} fontWeight={'bold'}>VENDORS</Typography>
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
                                    <Typography>Name:</Typography>
                                    <Typography fontWeight={'bold'}>{item.vendor_name}</Typography>
                                  </Box>

                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Phone:</Typography>
                                    <Typography fontWeight={'bold'}>{item.vendor_phone}</Typography>
                                  </Box>
                                  
                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>Email:</Typography>
                                    <Typography fontWeight={'bold'}>{item.vendor_email}</Typography>
                                  </Box>
                                  
                                  <Box display={'flex'} gap={'5px'}>
                                    <Typography>KRA Pin:</Typography>
                                    <Typography fontWeight={'bold'}>{item.kra_pin}</Typography>
                                  </Box>
                                    
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
                       VENDORS
                 </Typography>
                 <Box
                   margin='auto'
                   mt='20px'
                   height="75vh"
                 >
                   <DataGrid
                     rows={vendors}
                     columns={columns}
                     components={{ Toolbar: GridToolbar }}
                   />
                 </Box>
               </Box> 
            )}
        </Box>
        </Box>
    );
}

export default Vendor;
