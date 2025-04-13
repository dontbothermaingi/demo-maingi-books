import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerLayout from "./CustomerLayout";
import { LocalizationProvider} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const CustomerDetails = () => {
  const { customerId } = useParams();
  const [truckDetails, setTruckDetails] = useState(null);
  const [overallReport, setOveralTotal] = useState([]);
  const [receiptItems, setReceiptItems] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [receiptTotal, setReceiptTotal] = useState([]);
  const [invoiceTotal, setInvoiceTotal] = useState([]);
  const [creditTotal, setCreditTotal] = useState([]);
  const [amountPaid, setAmountPaid] = useState([]);
  const [amountOwed, setAmountOwed] = useState([]);
  const [spares, setSpares] = useState(null);
  const [sparesTotal, setSparesTotal] = useState([]);
  const [dieselTotal, setDieselTotal] = useState([]);
  const [retreadTotal, setRetreadTotal] = useState([]);
  const [pumpTotal, setPumpTotal] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null)

  const filterByDateRange = (items, startDate, endDate) => {
    if (!startDate || !endDate) return items; // No filter if dates are not set

    return items.filter(item => {
        const itemDate = new Date(item.invoice_date);
        return itemDate >= startDate && itemDate <= endDate;
    });
  };


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


  useEffect(() => {
    fetch(`https://demo-server-757m.onrender.com/customers/${customerId}`, {
      method:'GET',
      credentials:'include',
      headers:{
        'Authorization':`Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {

        const filteredData = filterByDateRange(data.invoices, startDate, endDate);


        const invoiceItems = filteredData.flatMap((invoice) =>
          invoice.items.map((item) => ({
            ...invoice,
            ...item,
          }))
        );

        const creditnotes = data.credit_notes.flatMap((creditNote) =>
          creditNote.items.map((item) => ({
            ...creditNote,
            ...item,
          }))
        );


        const invoiceTotalItems = filteredData.map((invoice) => {
          const totalAmount = (invoice.items.reduce((total, item) => total + item.amount, 0));
          return { ...invoice, totalAmount };

      })


        const calculateTotal = (items) =>
          items.reduce((total, item) => total + item.amount, 0);

        const calculateAmountPaid = (items) =>
          items.reduce((total, item) => total + item.amount_paid, 0);

        const calculateAmountOwed = (items) =>
            items.reduce((total, item) => total + item.amount_owed, 0);

        const paid = calculateAmountPaid(invoiceTotalItems)

        const owed = calculateAmountOwed(invoiceTotalItems)

        const receiptTotal = calculateTotal(receiptItems);
        const invoiceTotal = calculateTotal(invoiceItems);
        const creditTotal = calculateTotal(creditnotes);

        const totalCredit = new Intl.NumberFormat().format(
          parseFloat(creditTotal)
        );

        setReceiptItems(receiptItems);
        setSparesTotal(sparesTotal);
        setReceiptTotal(receiptTotal);
        setRetreadTotal(retreadTotal);
        setInvoiceTotal(invoiceTotal);
        setCreditTotal(totalCredit);
        setPumpTotal(pumpTotal);
        setDieselTotal(dieselTotal);
        setOveralTotal(invoiceTotal);
        setInvoiceItems(invoiceTotalItems);
        setSpares(data);
        setTruckDetails(data);
        setAmountOwed(owed);
        setAmountPaid(paid);
      })
      .catch((error) => setError(error));
  }, [customerId, dieselTotal,pumpTotal,receiptItems,retreadTotal,sparesTotal,token,startDate, endDate]);

  if (error) return <div>Error fetching truck details: {error.message}</div>;
  if (!truckDetails) return <div>No truck data available</div>;

  function handleEdit(){
    navigate(`/customer-edit/${customerId}`)
  }

  return (
    <Box m="30px">

      <Box display={'flex'} justifyContent={'space-between'}>

            <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography fontSize='23px' fontWeight='Bold'>FILTER BY DATE</Typography>
                <Box display={'flex'} gap={'5px'} flexDirection={{xs:'column', md:'row'}}>
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

          <Button 
            onClick={handleEdit}
            variant="contained"
            color="secondary"
          >
            EDIT
          </Button>
      </Box>


      <CustomerLayout
        title={truckDetails.customer_name}
        type={truckDetails.type}
        currency={truckDetails.currency}
        newtyresitems={null} // Removed the unused states
        retreadItems={null}
        spareitems={spares?.stores}
        dieselitems={spares?.removediesels}
        invoiceItems={invoiceItems}
        receiptItems={receiptItems}
        pumpitems={spares?.removedieselpumps_b}
        expenseTotal={[]} // Adjusted to match unused variable removal
        sparesTotal={sparesTotal}
        retreadTotal={retreadTotal}
        dieselTotal={dieselTotal}
        invoiceTotal={invoiceTotal}
        receiptTotal={receiptTotal}
        pumpTotal={pumpTotal}
        creditTotal={creditTotal}
        customerEmail={truckDetails.customer_email}
        customerPhone={truckDetails.customer_phone}
        customerPin={truckDetails.customer_pin}
        amountPaid={new Intl.NumberFormat(currencyLocaleMap[truckDetails.currency] || 'en-KE', {style:'currency', currency:truckDetails.currency}).format(amountPaid)}
        amountOwed={new Intl.NumberFormat(currencyLocaleMap[truckDetails.currency] || 'en-KE', {style:'currency', currency:truckDetails.currency}).format(amountOwed)}
        Totalamount={new Intl.NumberFormat(currencyLocaleMap[truckDetails.currency] || 'en-KE', {style:'currency', currency:truckDetails.currency}).format(overallReport)}
      />
    </Box>
  );
};

export default CustomerDetails;
