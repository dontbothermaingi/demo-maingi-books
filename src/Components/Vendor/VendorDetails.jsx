import { Box, Button,TextField, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VendorLayout from "./VendorLayout";
import { LocalizationProvider} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const VendorDetails = () => {
  const { vendorId } = useParams();
  const [truckDetails, setTruckDetails] = useState(null);
  const [amountOwed, setAmountOwed] = useState([]);
  const [amountPaid, setAmountPaid] = useState([]);
  const [overallTotal, setOverallTotal] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const token = localStorage.getItem('access_token')
  const [billTotal, setBillTotal] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null)
  const isMobile = useMediaQuery("(max-width:768px)");
  

  const filterByDateRange = (items, startDate, endDate) => {
    if (!startDate || !endDate) return items; // No filter if dates are not set

    return items.filter(item => {
        const itemDate = new Date(item.bill_date);
        return itemDate >= startDate && itemDate <= endDate;
    });
  };

  useEffect(() => {
    fetch(`https://demo-server-757m.onrender.com/vendors/${vendorId}`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {

        const filteredData = filterByDateRange(data.bills, startDate, endDate);

        const billItems = filteredData.flatMap((bill) =>
          bill.items.map((item) => ({
            ...bill,
            ...item,
          }))
        );

        const invoiceTotal = filteredData.map((invoice) => {
          const totalAmount = (invoice.items.reduce((total, item) => total + item.amount, 0));
          return { ...invoice, totalAmount };

      })

        const calculateTotal = (items) =>
          items.reduce((total, item) => total + item.amount, 0);

        const calculateAmountPaid = (items) =>
            items.reduce((total, item) => total + item.amount_paid, 0);

        const calculateAmountOwed = (items) =>
            items.reduce((total, item) => total + item.amount_owed, 0);

        const billTotal = calculateTotal(billItems);

        const paid = calculateAmountPaid(invoiceTotal)

        const owed = calculateAmountOwed(invoiceTotal)

        const overallTotal = new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(
          parseFloat(billTotal)
        );

        setBillItems(invoiceTotal);
        setBillTotal(billTotal);
        setTruckDetails(data);
        setAmountOwed(new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(owed));
        setAmountPaid(new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(paid));
        setOverallTotal(overallTotal);
      })
      .catch((error) => setError(error));
  }, [vendorId,token,startDate,endDate]);

  if (error) return <div>Error fetching truck details: {error.message}</div>;
  if (!truckDetails) return <div>No truck data available</div>;

  function handleEdit(){
    navigate(`/vendor-edit/${vendorId}`)
  }

  return (
    <Box m="30px">

      {isMobile ? (
        <Box display={'flex'} flexDirection={'column'} gap={'20px'}>

        <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Typography fontSize='23px' fontWeight='Bold'>FILTER BY DATE</Typography>
            <Box display={'flex'} gap={'5px'} flexDirection={{xs:'row', md:'row'}}>
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
            sx={{fontFamily:'GT Bold', width:'150px'}}
        >
            EDIT VENDOR
        </Button>
        </Box>
      ):(
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>

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
                sx={{fontFamily:'GT Bold', width:'150px'}}

            >
                EDIT VENDOR
            </Button>
        </Box>
      )}
      
      <VendorLayout
        title={truckDetails.vendor_name}
        vendorPhone={truckDetails.vendor_phone}
        vendorPin={truckDetails.kra_pin}
        vendorEmail={truckDetails.vendor_email}
        currency={truckDetails.currency}
        billItems={billItems}
        expenseItems={truckDetails.expense_items} // Use data directly
        billTotal={billTotal}
        amountOwed={amountOwed}
        amountPaid={amountPaid}
        Totalamount={overallTotal}
        startDate={startDate}
        endDate={endDate}
      />
    </Box>
  );
};

export default VendorDetails;
