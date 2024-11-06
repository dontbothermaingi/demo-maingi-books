import { useEffect, useState } from "react";
import { Button, Card, CardContent,Pagination,TextField, useMediaQuery, } from "@mui/material";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function Banking() {
    const [customers,setCustomers]=useState([])
    const [payementsreceived, setPaymentsRceived] = useState([])
    const [banks,setBanks] = useState([])
    const [payments,setPayments] = useState([])
    const [deposit,setDeposit] = useState([])
    const [funds,setFunds] = useState([])
    const [vendors,setVendors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [currentInPage, setCurrentInPage] = useState(1)
    const [currentOutPage, setCurrentOutPage] = useState(1)
    const [currentInvoicePage, setCurrentInvoicePage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [invoices, setInvoices] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("KES"); 
    const [filteredReceivables, setFilteredReceivables] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([])
    const token = localStorage.getItem('access_token')
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
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(newItem),
            credentials:'include'
        })
        .then(response => response.json())
        .then( (data) => {
            console.log(data)

            fetch('https://db-demo-u07o.onrender.com/bankaccounts', {
              method:'GET',
              headers:{
                  'Authorization':`Bearer ${token}`
              },
              credentials:'include'
            })
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
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${token}`
          },
          body: JSON.stringify(formDepositData),
          credentials:'include'
      })
      .then(response => response.json())
      .then(data => {

        fetch('https://db-demo-u07o.onrender.com/bankaccounts', {
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
        })
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
                          "Content-Type": "application/json",
                          'Authorization':`Bearer ${token}`
                      },
                      body: JSON.stringify({
                          amount: updatedAmount
                      }),
                      credentials:'include'
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
        fetch('https://db-demo-u07o.onrender.com/invoices',{
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
      fetch('https://db-demo-u07o.onrender.com/paymentsmade',{
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
                  payment_amount: new Intl.NumberFormat().format(payments.payment_amount)
              }))
              setPayments(formattedPayment)})
  }, [token]);


    useEffect(() => {
      fetch('https://db-demo-u07o.onrender.com/bankaccounts',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
      })
          .then(response => response.json())
          .then(data => {
              setBanks(data);
          })
          .catch(error => console.error('Error fetching bills:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/customers',{
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
  fetch('https://db-demo-u07o.onrender.com/vendors',{
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
    fetch('https://db-demo-u07o.onrender.com/bankaccounts',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
    })
        .then(response => response.json())
        .then(data => {
          const formattedPayment = data.map((payments) => ({
            ...payments,
            amount: new Intl.NumberFormat().format(payments.amount)
        }))
            setBankAccounts(formattedPayment);
        })
        .catch(error => console.error('Error fetching bills:', error));
}, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/paymentsreceived',{
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

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/funds',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
    })
        .then(response => response.json())
        .then(data => {
            setDeposit(data);
        })
        .catch(error => console.error('Error fetching funds:', error));
  }, [token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/funds',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Check the structure of the fetched data
        const pettycash = data.filter(cash => cash.fund_name === 'Petty Cash');
        setFunds(pettycash);
      })
      .catch(error => console.error('Error fetching funds:', error));
  }, [token]);

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

  const totalPages = Math.ceil(bankAccounts.length / itemsPerPage)
  const displayedItems = bankAccounts.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)

  const totalInPages = Math.ceil(payementsreceived.length / itemsPerPage)
  const displayedInItems = payementsreceived.slice((currentInPage - 1)*itemsPerPage, currentInPage * itemsPerPage)

  const totalOutPages = Math.ceil(payments.length / itemsPerPage)
  const displayedOutItems = payments.slice((currentOutPage - 1)*itemsPerPage, currentOutPage * itemsPerPage)

  const totalInvoicePages = Math.ceil(invoices.length / itemsPerPage)
  const displayedInvoiceItems = invoices.slice((currentInvoicePage - 1)*itemsPerPage, currentInvoicePage * itemsPerPage)
  

  const handleInPageChange = (event, value) => {
      setCurrentInPage(value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
                  <Typography fontWeight={'bold'} textAlign={'center'}>{pettyName}</Typography>
                  <Typography textAlign={'center'}>{pettyFund}</Typography>
                </CardContent>

            </Card>

          </Box>

          <Box
            display={'grid'}
            gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
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
                <Typography  variant="h6" color="black" fontWeight="bold" mt="30px" textAlign={'center'}>
                    CREATE NEW ACCOUNT
                </Typography>

                <Box
                   sx={{
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto', // Adjust height for better flexibility
                    padding: '10px',
                    backgroundColor: '#fff',
                    // Media queries for responsive design
                    '@media (max-width: 600px)': {
                    padding: '5px', // Adjust padding for smaller screens
                    },
                    '@media (min-width: 600px)': {
                    padding: '10px', // Keep padding for medium screens and above
                    },
                }}
                >
                    <form style={{display:'flex', flexDirection:'column', margin:'20px'}} onSubmit={handleSubmit}>

                          <TextField
                            type="text"
                            name="bank_name"
                            value={newItem.bank_name}
                            label="Bank Name"
                            onChange={handleNewItemChange}
                            variant="outlined"
                            sx={{marginBottom:'20px'}}
                          />

                        <TextField
                          type="text"
                          name="bank_details"
                          value={newItem.bank_details}
                          label="Account Name"
                          onChange={handleNewItemChange}
                          variant="outlined"
                          sx={{marginBottom:'20px'}}
                        />

                      <FormControl>
                        <Typography fontWeight={'bold'}>CURRENCY</Typography>
                        <Select
                          value={newItem.currency}
                          name="currency"
                          onChange={handleNewItemChange}
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
                          type="text"
                          name="amount"
                          value={newItem.amount}
                          placeholder="Amount"
                          className="bill-inputfield"
                          onChange={handleNewItemChange}
                          variant="outlined"
                          sx={{mb:'20px'}}
                        />

                      <Button type="submit" variant="contained" color="secondary">Create Bank Account</Button>
                    </form>
                </Box>

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
                
              }}
            >
              {isMobile ? (
                 <Box>
                 <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>BANKS</Typography>
                 <Box
                     display={'grid'}
                     gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                     gap="10px"
                     margin="0 10px"
                 >
 
                     {displayedItems.map((item) => (
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
                                             <Typography>Bank Name:</Typography>
                                             <Typography fontWeight={'bold'}>{item.bank_name}</Typography>
                                         </Box>
 
                                         <Box display={'flex'} gap={'7px'}>
                                             <Typography>Account Name:</Typography>
                                             <Typography  fontWeight={'bold'}>{item.bank_details}</Typography>
                                         </Box>
 
                                         <Box display={'flex'} gap={'7px'}>
                                             <Typography>Amount:</Typography>
                                             <Typography fontWeight={'bold'}>{ new Intl.NumberFormat(currencyLocaleMap[item.currency], {style:'currency', currency:item.currency}).format(item.amount)}</Typography>
                                         </Box>
 
                                         <Box display={'flex'} gap={'7px'}>
                                             <Typography>Currency:</Typography>
                                             <Typography fontWeight={'bold'}>{item.currency}</Typography>
                                         </Box>
 
                             </CardContent>
                         </Card>
                     ))}
                     <Box display="flex" justifyContent="center" mt="20px">
                             <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
                     </Box>
                 </Box>
                 </Box>
              ):(

                <Box>
                  <Typography fontSize={'20px'} fontWeight={'bold'} textAlign={'center'}>BANKS</Typography>
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
              )}
            </Card>

            </Box>

            <Box
              display={'grid'}
              gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
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
                                                          <Typography>Customer Name:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.customer_name}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography>Customer Phone:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.customer_phone}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography>Customer Email:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.customer_email}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography>Amount Received:</Typography>
                                                          <Typography fontWeight={'bold'}>{new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:item.currency}).format(item.amount_received)}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography>Bank Charges:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.bank_charges}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography>Payment Date:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.payment_date}</Typography>
                                                      </Box>

                                                      <Box display={'flex'} gap={'5px'}>
                                                          <Typography>Payment Mode:</Typography>
                                                          <Typography fontWeight={'bold'}>{item.payment_mode}</Typography>
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
                )}
               
        
            </Card>

            </Box>

            <Box
              display={'grid'}
              gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
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
                }}
            >
                <Typography  variant="h6" color="black" fontWeight="bold" mt="20px" textAlign={'center'}>
                    WITHDRAW FROM BANK
                </Typography>

                <Box
                   sx={{
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto', // Adjust height for better flexibility
                    padding: '10px',
                    backgroundColor: '#fff',
                    // Media queries for responsive design
                    '@media (max-width: 600px)': {
                    padding: '5px', // Adjust padding for smaller screens
                    },
                    '@media (min-width: 600px)': {
                    padding: '10px', // Keep padding for medium screens and above
                    },
                }}
                >
                <form style={{display:'flex', flexDirection:'column', margin:'20px'}} onSubmit={handleDepositSubmit}>


                  <FormControl>
                        <Typography fontWeight={'bold'}>BANK ACCOUNT</Typography>
                        <Select name="bank_details" value={formDepositData.bank_details} sx={{mb:'20px'}} onChange={handleSelectBank}>
                          <MenuItem value="">Select Bank Account</MenuItem>
                          {banks.map((bank,index) => (
                          <MenuItem key={index} value={bank.bank_details}>{bank.bank_details}</MenuItem>
                          ))}
                        </Select>
                    </FormControl>

                        <TextField
                            type="text"
                            name="bank_name"
                            value={formDepositData.bank_name}
                            label="Bank Name"
                            onChange={handleDepositChange}
                            inputProps={{readOnly:true}}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                    {/* {formDepositData.bank_name.id === formDepositData.} */}
                    <FormControl>
                        <Typography fontWeight={'bold'}>DEPOSIT TO</Typography>
                        <Select name="deposit_from" value={formDepositData.deposit_from} sx={{mb:'20px'}} onChange={handleDepositChange}>
                          <MenuItem value="">Select</MenuItem>
                          {deposit.map((bank,index) => (
                          <MenuItem key={index} value={bank.fund_name}>{bank.fund_name}</MenuItem>
                          ))}
                        </Select>
                    </FormControl>

                        <TextField
                            type="text"
                            name="currency"
                            value={formDepositData.currency}
                            label="Currency"
                            onChange={handleDepositChange}
                            inputProps={{readOnly:true}}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="number"
                            name="bank_charges"
                            value={formDepositData.bank_charges}
                            label="Bank Charges"
                            onChange={handleDepositChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="number"
                            name="amount"
                            value={formDepositData.amount}
                            label="Amount"
                            onChange={handleDepositChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <Typography>DATE</Typography>
                        <TextField
                            type="date"
                            name="date"
                            value={formDepositData.date}
                            onChange={handleDepositChange}
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                    <Button type="submit" color="secondary" variant="contained">DEPOSIT MONEY</Button>
                </form>
                </Box>
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
                                           <Typography>Vendor Name:</Typography>
                                           <Typography fontWeight={'bold'}>{item.vendor_name}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography>Vendor Phone:</Typography>
                                           <Typography fontWeight={'bold'}>{item.vendor_phone}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography>Vendor Email:</Typography>
                                           <Typography fontWeight={'bold'}>{item.vendor_email}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography>Amount:</Typography>
                                           <Typography fontWeight={'bold'}>{new Intl.NumberFormat(currencyLocaleMap[item.currency] || 'en-KE', {style:'currency', currency:item.currency}).format(item.payment_amount)}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography>Payment Date:</Typography>
                                           <Typography fontWeight={'bold'}>{item.payment_date}</Typography>
                                       </Box>

                                       <Box display={'flex'} gap={'5px'}>
                                           <Typography>Payment Mode:</Typography>
                                           <Typography fontWeight={'bold'}>{item.payment_mode}</Typography>
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
