import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PieChart from "../PieChart";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TruckReport from "./Truck";
import { LocalizationProvider} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const TruckReportPage = () => {
  const { truckId } = useParams();
  const navigate = useNavigate()
  
  const [truckDetails, setTruckDetails] = useState(null);
  const [newTyres, setNewTyres] = useState([]);
  const [spares, setSpares] = useState([]);
  const [diesel, setDiesel] = useState([]);
  const [bill, setBill] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null)
  
  const [newTyresTotal, setNewTyresTotal] = useState(0);
  const [sparesTotal, setSparesTotal] = useState(0);
  const [dieselTotal, setDieselTotal] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [billTotal, setBillTotal] = useState(0);
  const [retreadTotal, setRetreadTotal] = useState(0);
  const [retreadTyres, setRetreadTyres] = useState([]);
  const [newChart, setNewChart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access_token')


  const filterByDateRange = (items, startDate, endDate) => {
    if (!startDate || !endDate) return items; // No filter if dates are not set

    return items.filter(item => {
        const itemDate = new Date(item.date || item.invoice_date || item.bill_date || item.fitment_date); // Converts the string to a Date object
        return itemDate >= startDate && itemDate <= endDate;
    });
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('https://db-demo-u07o.onrender.com/invoices',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
        });
        const data = await response.json();
        const filteredData = filterByDateRange(data, startDate, endDate);
        const invoiceItems = filteredData.flatMap(invoice =>
          invoice.items.map(item => ({
            ...invoice,
            ...item
          }))
        );
        const filteredInvoices = invoiceItems.filter(item => item.truck_id === Number(truckId));
        setInvoice(filteredInvoices);
        const total = filteredInvoices.reduce((total, item) => total + item.amount, 0);
        setInvoiceTotal(total);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [truckId, startDate, endDate,token]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('https://db-demo-u07o.onrender.com/newbills',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
        });
        const data = await response.json();
        const filteredData = filterByDateRange(data, startDate, endDate);
        const invoiceItems = filteredData.flatMap(invoice =>
          invoice.items.map(item => ({
            ...invoice,
            ...item
          }))
        );
        const filteredBills = invoiceItems.filter(item => item.truck_id === Number(truckId));
        setBill(filteredBills);
        const total = filteredBills.reduce((total, item) => total + item.amount, 0);
        setBillTotal(total);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [truckId, startDate, endDate, token]);

  useEffect(() => {
    setLoading(true);
    const fetchTruckData = async () => {
      try {
        const response = await fetch(`https://db-demo-u07o.onrender.com/trucks/${truckId}`,{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          },
          credentials:'include'
        });
        const data = await response.json();
        const filteredNew = filterByDateRange(data.removetyres, startDate, endDate);
        const filteredRetread = filterByDateRange(data.removeretreadtyres, startDate, endDate);
        const filteredDiesel = filterByDateRange(data.fueling, startDate, endDate);
        const spareItem = filterByDateRange(data.mantainances.flatMap(report => 
          report.items.map((item)=>({
            ...item,
            ...report
          }))), startDate, endDate)
        const filteredSpare = filterByDateRange(spareItem, startDate, endDate);

        const newTyresTotal = filteredNew.reduce((total, item) => total + item.price, 0);
        const retreadTotal = filteredRetread.reduce((total, item) => total + item.price, 0);
        const dieselTotal = filteredDiesel.reduce((total, item) => total + item.price, 0);

        const formattedNew = filteredNew.reduce((acc, item) => {
          acc[item.item_details] = (acc[item.item_details] || 0) + item.quantity;
          return acc;
        }, {});
        const formattedNewTyres = Object.entries(formattedNew).map(([item_details, quantity]) => ({
          id: item_details,
          value: quantity
        }));

        setTruckDetails(data);
        setNewTyres(filteredNew);
        setRetreadTyres(filteredRetread);
        setDiesel(filteredDiesel);
        setSpares(filteredSpare);
        setNewChart(formattedNewTyres);
        setNewTyresTotal(newTyresTotal);
        setRetreadTotal(retreadTotal);
        setDieselTotal(dieselTotal);
        setSparesTotal(filteredSpare.reduce((total, item) => total + item.price, 0));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTruckData();
  }, [truckId, startDate, endDate,token]);


  function handleEditTRuck(){
    navigate(`/truck-edit/${truckId}`)
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching truck details: {error.message}</div>;
  if (!truckDetails) return <div>No truck data available</div>;

  return (
    <Box m="30px">
      <Box display='flex' justifyContent='space-between'>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography fontSize='23px' fontWeight='Bold'>FILTER BY DATE</Typography>
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

            <Box>
              <button 
                 type="button"
                 className="button"
                 onClick={handleEditTRuck}
              >
                EDIT VEHICLE
              </button>
            </Box>
        </Box>

      <TruckReport
        title={truckDetails.truck_number}
        vehicleType={truckDetails.vehicle_type}
        manufacturer={truckDetails.manufacturer}
        newtyresitems={newTyres}
        retreadItems={retreadTyres}
        spareitems={spares}
        dieselitems={diesel}
        invoiceItems={invoice}
        billItems={bill}
        // pumpitems={pump}
        expenseTotal={newTyresTotal}
        sparesTotal={sparesTotal}
        retreadTotal={retreadTotal}
        dieselTotal={dieselTotal}
        invoiceTotal={invoiceTotal}
        billTotal={billTotal}
        barchartbills={<PieChart chartdata={newChart} />}
        // barchartretread={<PieChart chartdata={retreadchart} />}
      />
    </Box>
  );
};

export default TruckReportPage;
