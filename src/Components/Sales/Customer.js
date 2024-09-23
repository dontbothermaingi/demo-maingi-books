import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './Customer.css'
import { useNavigate } from "react-router-dom";

function Customer() {
    const [customers, setCustomers] = useState([]);
    const [isVatInclusive, setIsVatInclusive] = useState([])
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_type: "",
        company_name: "",
        customer_email: "",
        customer_phone: "",
        currency: "",
        kra_pin:"",
        total_amount_owed: "",
        amount_paid: "",
    });

    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/customers')
            .then(response => response.json())
            .then((data) => setCustomers(data));
    }, []);

    function handleChange(event){
        const {name, value} = event.target

        const upperCaseValue = name === "customer_name" ? value.toUpperCase() : value

        setFormData(prevFormData =>({
            ...prevFormData,
            [name]:upperCaseValue
        }))
    }

    function handleSubmit(event) {
        event.preventDefault();
        fetch('https://db-demo-u07o.onrender.com/customers', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                amount_paid: 0,
            })
        })
            .then(response => response.json())
            .then(() => {
                // Refetch customers after successful submission
                fetch('https://maingi-server-3.onrender.com/customers')
                    .then(response => response.json())
                    .then((data) => setCustomers(data));
                
                // Clear form data
                setFormData({
                    customer_name: "",
                    customer_type: "",
                    company_name: "",
                    customer_email: "",
                    customer_phone: "",
                    currency: "",
                    opening_balance: "",
                    payment_terms: "",
                    kra_pin:"",
                    documents: "",
                    total_amount_owed: "",
                });
            })
            .catch(error => console.error('Error:', error));
    }

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
    
    

    function handleToggleVat() {
        setIsVatInclusive(!isVatInclusive);
    }

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
          field: "company_name",
          headerName: "Company Name",
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
        }
      ];

    return (
        <div>
            <div className="bill-content">
                        <button
                                type="button"
                                className="button"
                                onClick={handleToggleVat}
                                >
                                {isVatInclusive ? "New Customer" : "All Customers"}
                        </button>
        {isVatInclusive ? "" : <div>
                    <h2 className="h2">NEW CUSTOMER</h2>
                    <form className="bill-form" onSubmit={handleSubmit}>
                    <div className="bill-input">
                        <label>Customer Name</label>
                        <input
                            type="text"
                            name="customer_name"
                            placeholder="Customer Name"
                            className="bill-inputfield"
                            value={formData.customer_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bill-input">
                        <label>Customer Type</label>
                        <select value={formData.customer_type} className="bill-inputfield" name="customer_type" onChange={handleChange}>
                            <option value="">Select Customer Type</option>
                            <option value="Business">Business</option>
                            <option value="Individual">Individual</option>
                        </select>
                    </div>

                    <div className="bill-input">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            placeholder="Company Name"
                            className="bill-inputfield"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bill-input">
                        <label>Customer Email</label>
                        <input
                            type="text"
                            name="customer_email"
                            placeholder="Customer Email"
                            className="ibill-inputfield"
                            value={formData.customer_email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bill-input">
                        <label>Customer Phone</label>
                        <input
                            type="text"
                            name="customer_phone"
                            placeholder="Customer Phone"
                            className="bill-inputfield"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bill-input">
                        <label>KRA Pin</label>
                        <input
                            type="text"
                            name="kra_pin"
                            placeholder="KRA Pin"
                            className="bill-inputfield"
                            value={formData.kra_pin}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bill-input">
                                <label>Currency</label>
                                <select
                                    value={formData.currency}
                                    name="currency"
                                    onChange={handleChange}
                                    label="Currency"
                                >
                                    <option value="">Select Currency</option>
                                    {currencyOptions.map((option) => (
                                        <option key={option.code} value={option.code}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                    </div>


                    

                    <div className="bill-input">
                            <label>Total Amount Owed</label>
                            <input
                                type="number"
                                name="total_amount_owed"
                                placeholder="Total Amount Owed"
                                value={formData.total_amount_owed}
                                onChange={handleChange}
                                variant="outlined"
                            />
                    </div>

                    <div className="bill-input">
                        <label>Payment Terms</label>
                        <select value={formData.payment_terms} className="bill-inputfield" name="payment_terms" onChange={handleChange}>
                            <option value="">Select Invoice Term</option>
                            <option value="Cash">Cash</option>
                            <option value="15 days">15 days</option>
                            <option value="30 days">30 days</option>
                            <option value="45 days">45 days</option>
                            <option value="60 days">60 days</option>
                        </select>

                    </div>

                        <button type="submit" className="button">Save</button>
                    </form>
                </div> }
            </div>
            <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    CUSTOMERS
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
                    rows={customers}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
            </Box>
        </div>
    );
}

export default Customer;
