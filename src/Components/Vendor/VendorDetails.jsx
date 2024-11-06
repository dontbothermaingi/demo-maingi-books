import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VendorLayout from "./VendorLayout";

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

  useEffect(() => {
    fetch(`https://db-demo-u07o.onrender.com/vendors/${vendorId}`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {
        const billItems = data.bills.flatMap((bill) =>
          bill.items.map((item) => ({
            ...bill,
            ...item,
          }))
        );
        const calculateTotal = (items) =>
          items.reduce((total, item) => total + item.amount, 0);

        const billTotal = calculateTotal(billItems);

        const overallTotal = new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(
          parseFloat(billTotal)
        );

        setBillItems(billItems);
        setBillTotal(billTotal);
        setTruckDetails(data);
        setAmountOwed(new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(data.total_amount_owed));
        setAmountPaid(new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(data.amount_paid));
        setOverallTotal(overallTotal);
      })
      .catch((error) => setError(error));
  }, [vendorId,token]);

  if (error) return <div>Error fetching truck details: {error.message}</div>;
  if (!truckDetails) return <div>No truck data available</div>;

  return (
    <Box m="30px">
      <VendorLayout
        title={truckDetails.vendor_name}
        billItems={billItems}
        expenseItems={truckDetails.expense_items} // Use data directly
        billTotal={billTotal}
        amountOwed={amountOwed}
        amountPaid={amountPaid}
        Totalamount={overallTotal}
      />
    </Box>
  );
};

export default VendorDetails;
