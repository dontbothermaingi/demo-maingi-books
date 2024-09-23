import StatBox from "./StatBox";
import { PointOfSale } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { tokens } from "../theme";
import { IconButton, useTheme } from "@mui/material";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import './Banking.css'
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";

function Banking() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [customers,setCustomers]=useState([])
    const [payementsreceived, setPaymentsRceived] = useState([])
    const [banks,setBanks] = useState([])
    const [payments,setPayments] = useState([])
    const [deposit,setDeposit] = useState([])
    const [funds,setFunds] = useState([])
    const [vendors,setVendors] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("KES"); 
    const [filteredReceivables, setFilteredReceivables] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([])
    const [newItem, setNewItem] = useState({
      bank_name: "",
      bank_details: "",
      currency:"",
      amount:"",
  })

    const [formDepositData, setFormDepositData] = useState({
      bank_name: "",
      bank_details: "",
      deposit_from:"",
      currency : "",
      amount : "",
      bank_charges:"",
      date : "",
  })

    function handleNewItemChange(event) {
      const { name, value } = event.target;
      const upperCasedValue = name === 'bank_name' ? value.toUpperCase() : value;
      setNewItem(prevNewItem => ({
          ...prevNewItem,
          [name]: upperCasedValue
      }));
  }
    
    function handleDepositChange(event) {
      const { name, value } = event.target;
      const upperCasedValue = name === 'bank_name' ? value.toUpperCase() : value;
      setFormDepositData(prevFormData => ({
          ...prevFormData,
          [name]: upperCasedValue
      }));
  }

    function handleSubmit(event){
        event.preventDefault()

        fetch('https://db-demo-u07o.onrender.com/bankaccounts',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(newItem)
        })
        .then(response => response.json())
        .then( (data) => {
            console.log(data)

            fetch('https://db-demo-u07o.onrender.com/bankaccounts')
            .then(response => response.json())
            .then(data => {
              const formattedPayment = data.map((payments) => ({
                ...payments,
                amount: new Intl.NumberFormat().format(payments.amount)
            }))
                setBankAccounts(formattedPayment);
            })

            setNewItem({
                bank_name: "",
                bank_details: "",
                currency:"",
                amount:"",
            })
        })
    }

    function handleDepositSubmit(event) {
      event.preventDefault();
  
      console.log('Submitting deposit data:', formDepositData);
  
      fetch('https://db-demo-u07o.onrender.com/deposits', {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDepositData)
      })
      .then(response => response.json())
      .then(data => {

        fetch('https://db-demo-u07o.onrender.com/bankaccounts')
        .then(response => response.json())
        .then(data => {
          const formattedPayment = data.map((payments) => ({
            ...payments,
            amount: new Intl.NumberFormat().format(payments.amount)
          }))
              setBankAccounts(formattedPayment);
        })
        
          console.log('Deposit data response:', data);
  
          if (formDepositData.bank_details) {
              const selectedBank = banks.find(bank => bank.bank_details === formDepositData.bank_details);
              if (selectedBank) {
                  const updatedAmount = parseFloat(selectedBank.amount) - (parseFloat(formDepositData.amount) + parseFloat(formDepositData.bank_charges || 0));
                  console.log('Updating bank with amount:', updatedAmount);
  
                  fetch(`https://db-demo-u07o.onrender.com/bankaccounts/${selectedBank.id}`, {
                      method: "PATCH",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                          amount: updatedAmount
                      })
                  })
                  .then(response => response.json())
                  .then(updatedBank => {
                      console.log('Bank updated successfully:', updatedBank);
                  })
                  .catch(error => console.error('Error updating bank:', error));
              }
          }
  
          setFormDepositData({
              bank_name: "",
              deposit_from: "",
              currency: "",
              bank_charges: "",
              amount: "",
              date: "",
          });
      })
      .catch(error => console.error('Error submitting deposit:', error));
  }

    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/invoices')
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                const paid = invoiceTotal.filter(item => item.status === 'PAID')
                setInvoices(paid)
            });
    }, []);

    useEffect(() => {
      fetch('https://db-demo-u07o.onrender.com/paymentsmade')
          .then(response => response.json())
          .then((data) => {
              const formattedPayment = data.map((payments) => ({
                  ...payments,
                  payment_amount: new Intl.NumberFormat().format(payments.payment_amount)
              }))
              setPayments(formattedPayment)})
  }, []);


    useEffect(() => {
      fetch('https://db-demo-u07o.onrender.com/bankaccounts')
          .then(response => response.json())
          .then(data => {
              setBanks(data);
          })
          .catch(error => console.error('Error fetching bills:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/customers')
        .then(response => response.json())
        .then(data => {
            setCustomers(data);
        })
        .catch(error => console.error('Error fetching bills:', error));
}, []);

useEffect(() => {
  // Filter data by selected currency
  const filtered = customers.filter(item => item.currency === selectedCurrency);
  setFilteredReceivables(filtered);
}, [customers, selectedCurrency]);

const handleCurrencyChange = (event) => {
  setSelectedCurrency(event.target.value);
};

useEffect(() => {
  fetch('https://db-demo-u07o.onrender.com/vendors')
      .then(response => response.json())
      .then(data => {
          setVendors(data);
      })
      .catch(error => console.error('Error fetching bills:', error));
}, []);


  
  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/bankaccounts')
        .then(response => response.json())
        .then(data => {
          const formattedPayment = data.map((payments) => ({
            ...payments,
            amount: new Intl.NumberFormat().format(payments.amount)
        }))
            setBankAccounts(formattedPayment);
        })
        .catch(error => console.error('Error fetching bills:', error));
}, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/paymentsreceived')
        .then(response => response.json())
        .then(data => {
            setPaymentsRceived(data);
        })
        .catch(error => console.error('Error fetching bills:', error));
}, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/funds')
        .then(response => response.json())
        .then(data => {
            setDeposit(data);
        })
        .catch(error => console.error('Error fetching funds:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/funds')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Check the structure of the fetched data
        const pettycash = data.filter(cash => cash.fund_name === 'Petty Cash');
        setFunds(pettycash);
      })
      .catch(error => console.error('Error fetching funds:', error));
  }, []);

    // Ensure funds is not empty before accessing its elements
    const fund = funds[0] || {};

    const pettyFund = new Intl.NumberFormat().format(fund.amount || 0);
    const pettyName = (fund.fund_name || '').toUpperCase();

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
    const formattedBillAmount = new Intl.NumberFormat().format(unpaidDebit);


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

    function handleSelectBank(event) {
      const selectedValue = event.target.value;
      
      const selectedCustomer = banks.find(customer => customer.bank_details === selectedValue);
      
      if (selectedCustomer) {
          setFormDepositData(prevFormDepositData => ({
              ...prevFormDepositData,
              bank_name: selectedCustomer.bank_name,
              bank_details: selectedCustomer.bank_details,
              currency: selectedCustomer.currency,
          }));
      }
  }
    
    const bankcolumns = [
      {
        field: "bank_name",
        headerName: "Bank Name",
        flex: 0.5,
      },
      {
        field: "bank_details",
        headerName: "Bank Details",
        flex: 0.5,
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 0.2,
      },
      {
        field: "currency",
        headerName: "Currency",
        flex: 0.2,
      }
    ]
    
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
          field: "consignee",
          headerName: "Consignee",
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

    const transactioncolumns = [
      {
        field: "customer_name",
        headerName: "CUSTOMER NAME",
        headerAlign: "left",
        cellClassName: "name-column--cell",
        flex: 0.3,
        align: "left",
      },
      {
        field: "amount_received",
        headerName: "AMOUNT RECEIVED",
        flex: 0.17,
      },
      {
        field: "bank_charges",
        headerName: "BANK CHARGES",
        flex: 0.12,
      },
      {
        field: "payment_date",
        headerName: "PAYMENT DATE",
        flex: 0.12,
      },
      {
        field: "deposit_to",
        headerName: "DEPOSIT",
        flex: 0.1,
      },
      {
        field: "payment_mode",
        headerName: "PAYMENT MODE",
        flex: 0.15,
      },
      {
        field: "bank_name",
        headerName: "Bank Name",
        flex: 0.2,
      },
      {
        field: "bank_details",
        headerName: "Bank Name",
        flex: 0.25,
      },
    ];

    const transactionoutcolumns = [
      // { field: "id", headerName: "ID", flex: 0.2 },
      {
        field: "vendor_name",
        headerName: "Vendor Name",
        flex: 0.35,
        cellClassName: "name-column--cell",
      },
      {
        field: "payment_amount",
        headerName: "Amount Paid",
        flex: 0.15,
      },
      {
        field: "deposit_to",
        headerName: "PAID WITH",
        flex: 0.2,
      },
      {
        field: "bank_name",
        headerName: "Bank Name",
        flex: 0.25,
      },
      {
        field: "payment_date",
        headerName: "Date",
        flex: 0.15,
      },
      {
          field: "payment_mode",
          headerName: "Payment Mode",
          flex: 0.2,
      },
      
  ]

    return (
        <Box>

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

        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="10px"
            mb="20px"
            mt="20px"
            width='1630px'
            // ml="10px"
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
                    title={`$${formattedPaidAmount}`}
                    subtitle="PAID REVENUE"
                    icon={
                        <PointOfSale
                            sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
                        />
                    }
                />
            </Box>
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <StatBox
                    title={`$${formattedUnpaidAmount}`}
                    subtitle="TOTAL RECEIVABLES"
                    icon={
                        <PointOfSale
                            sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
                        />
                    }
                />
            </Box>
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <StatBox
                    title={`$${formattedBillAmount}`}
                    subtitle="TOTAL PAYABLES"
                    icon={
                        <PointOfSale
                            sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
                        />
                    }
                />
            </Box>
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <StatBox
                    title={`$${pettyFund}`} // Use optional chaining and fallback
                    subtitle={pettyName}
                    icon={
                        <PointOfSale
                            sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
                        />
                    }
                />
            </Box>
            <Box
                gridColumn="span 7"
                gridRow="span 4"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                display="flex"
                flexDirection='column'
                alignItems="center"
                justifyContent="center"
            >
                <Typography  variant="h6" color="black" fontWeight="bold" mt="10px" ml="20px">
                    CREATE NEW ACCOUNT
                </Typography>

                    <form className="bank-form" onSubmit={handleSubmit}>
                      <div className="bill-input">
                        <label>BANK NAME</label>
                          <input
                            type="text"
                            name="bank_name"
                            value={newItem.bank_name}
                            placeholder="Bank Name"
                            className="bill-inputfield"
                            onChange={handleNewItemChange}
                          />
                      </div>

                      <div className="bill-input">
                        <label>ACCOUNT DETAILS</label>
                        <input
                          type="text"
                          name="bank_details"
                          value={newItem.bank_details}
                          placeholder="Account Details"
                          className="bill-inputfield"
                          onChange={handleNewItemChange}
                        />
                      </div>

                      <div className="bill-input">
                        <label>CURRENCY</label>
                        <select
                          value={newItem.currency}
                          name="currency"
                          onChange={handleNewItemChange}
                          className="bill-inputfield"
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
                        <label>AMOUNT</label>
                        <input
                          type="text"
                          name="amount"
                          value={newItem.amount}
                          placeholder="Amount"
                          className="bill-inputfield"
                          onChange={handleNewItemChange}
                        />
                      </div>

                      <button type="submit" className="button">Create Bank Account</button>
                    </form>

            </Box>
            <Box
          gridColumn="span 5"
          borderRadius='10px'
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        //   height='400px'
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            // onClick={handleViewReport}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Banks
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {/* ${TotalExpenses} */}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlined
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                    mt='30px'
                >
                </Typography>
                <Box
                    // m="40px 0 0 0"
                    height="52vh"
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
                    rows={bankAccounts}
                    columns={bankcolumns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
        </Box>
            </Box>
            <Box
                gridColumn="span 12"
                borderRadius='10px'
                gridRow="span 5"
                backgroundColor={colors.primary[400]}
              //   height='400px'
              >
                <Box
                  mt="25px"
                  p="0 30px"
                  display="flex "
                  // onClick={handleViewReport}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color={colors.grey[100]}
                    >
                      Transactions In
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color={colors.greenAccent[500]}
                    >
                      {/* ${TotalExpenses} */}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton>
                      <DownloadOutlined
                        sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                      />
                    </IconButton>
                  </Box>
                </Box>
                <Box m="20px">
                      <Typography 
                          fontSize='30px'
                          fontWeight='bold'
                          textAlign='center'
                          mt='30px'
                      >
                      </Typography>
                      <Box
                          // m="40px 0 0 0"
                          height="68vh"
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
                          rows={payementsreceived}
                          columns={transactioncolumns}
                          components={{ Toolbar: GridToolbar }}
                          getRowId={(row) => row.id}
                          />
                      </Box>
              </Box>
        
            </Box>
            <Box
                gridColumn="span 5"
                gridRow="span 6"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                display="flex"
                flexDirection='column'
                alignItems="center"
                justifyContent="center"
            >
                <Typography  variant="h6" color="black" fontWeight="bold" mt="10px" ml="20px">
                    WITHDRAW FROM BANK
                </Typography>
                <form className="bank-form" onSubmit={handleDepositSubmit}>


                  <div className="bill-input">
                        <label>BANK ACCOUNT</label>
                        <select name="bank_details" value={formDepositData.bank_details} className="bill-inputfield" onChange={handleSelectBank}>
                          <option value="">Select Bank Account</option>
                          {banks.map((bank,index) => (
                          <option key={index} value={bank.bank_details}>{bank.bank_details}</option>
                          ))}
                        </select>
                    </div>

                    <div className="bill-input">
                        <label>BANK NAME</label>
                        <input
                            type="text"
                            name="bank_name"
                            value={formDepositData.bank_name}
                            placeholder="Bank Name"
                            className="bill-inputfield"
                            onChange={handleDepositChange}
                            readOnly
                        />
                    </div>

                    {/* {formDepositData.bank_name.id === formDepositData.} */}
                    <div className="bill-input">
                        <label>DEPOSIT TO</label>
                        <select name="deposit_from" value={formDepositData.deposit_from} className="bill-inputfield" onChange={handleDepositChange}>
                          <option value="">Select</option>
                          {deposit.map((bank,index) => (
                          <option key={index} value={bank.fund_name}>{bank.fund_name}</option>
                          ))}
                        </select>
                    </div>

                    <div className="bill-input">
                        <label>CURRENCY</label>
                        <input
                            type="text"
                            name="currency"
                            value={formDepositData.currency}
                            placeholder="Currency"
                            className="bill-inputfield"
                            onChange={handleDepositChange}
                            readOnly
                        />
                    </div>
                    <div className="bill-input">
                        <label>BANK CHARGES</label>
                        <input
                            type="number"
                            name="bank_charges"
                            value={formDepositData.bank_charges}
                            placeholder="Bank Charges"
                            className="bill-inputfield"
                            onChange={handleDepositChange}
                        />
                    </div>
                    <div className="bill-input">
                        <label>AMOUNT</label>
                        <input
                            type="number"
                            name="amount"
                            value={formDepositData.amount}
                            placeholder="Amount"
                            className="bill-inputfield"
                            onChange={handleDepositChange}
                        />
                    </div>
                    <div className="bill-input">
                        <label>DATE</label>
                        <input
                            type="date"
                            name="date"
                            value={formDepositData.date}
                            placeholder="Date"
                            className="bill-inputfield"
                            onChange={handleDepositChange}
                        />
                    </div>
                    <button type="submit" className="button">DEPOSIT MONEY</button>
                </form>
            </Box>
            <Box
                gridColumn="span 7"
                borderRadius='10px'
                gridRow="span 6"
                backgroundColor={colors.primary[400]}
              //   height='400px'
              >
                <Box
                  mt="25px"
                  p="0 30px"
                  display="flex "
                  // onClick={handleViewReport}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color={colors.grey[100]}
                    >
                      Transactions Out
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color={colors.greenAccent[500]}
                    >
                      {/* ${TotalExpenses} */}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton>
                      <DownloadOutlined
                        sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                      />
                    </IconButton>
                  </Box>
                </Box>
                <Box m="20px">
                      <Typography 
                          fontSize='30px'
                          fontWeight='bold'
                          textAlign='center'
                          mt='30px'
                      >
                      </Typography>
                      <Box
                          // m="40px 0 0 0"
                          height="82vh"
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
                          rows={payments}
                          columns={transactionoutcolumns}
                          components={{ Toolbar: GridToolbar }}
                          getRowId={(row) => row.id}
                          />
                      </Box>
              </Box>
        
            </Box>

        </Box>

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
                    // m="40px 0 0 0"
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
                    rows={invoices}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
        </Box>
        <Typography variant="h6" color="black" fontWeight="bold" mt="10px" ml="20px">
                    Total Paid Amount: {formattedPaidAmount}
        </Typography>
    </Box>
    );
}

export default Banking;
