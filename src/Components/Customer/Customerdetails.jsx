import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerLayout from "./CustomerLayout";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [truckDetails, setTruckDetails] = useState(null);
  const [overallReport, setOveralTotal] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [receiptItems, setReceiptItems] = useState([]);
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
        const invoiceItems = data.invoices.flatMap((invoice) =>
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

        const calculateTotal = (items) =>
          items.reduce((total, item) => total + item.amount, 0);

        const receiptTotal = calculateTotal(receiptItems);
        const invoiceTotal = calculateTotal(invoiceItems);
        const creditTotal = calculateTotal(creditnotes);

        const overallTotal = new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(
          parseFloat(invoiceTotal)
        );
        const totalCredit = new Intl.NumberFormat().format(
          parseFloat(creditTotal)
        );

        setReceiptItems(receiptItems);
        setSparesTotal(sparesTotal);
        setReceiptTotal(receiptTotal);
        setRetreadTotal(retreadTotal);
        setInvoiceTotal(invoiceTotal);
        setInvoiceItems(invoiceItems);
        setCreditTotal(totalCredit);
        setPumpTotal(pumpTotal);
        setDieselTotal(dieselTotal);
        setOveralTotal(overallTotal);
        setSpares(data);
        setTruckDetails(data);
        setAmountOwed(new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(data.total_amount_owed));
        setAmountPaid(new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(data.amount_paid));
      })
      .catch((error) => setError(error));
  }, [customerId, dieselTotal,pumpTotal,receiptItems,retreadTotal,sparesTotal,token]);

  if (error) return <div>Error fetching truck details: {error.message}</div>;
  if (!truckDetails) return <div>No truck data available</div>;

  return (
    <Box m="30px">
      <CustomerLayout
        title={truckDetails.customer_name}
        type={truckDetails.type}
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
        amountPaid={amountPaid}
        amountOwed={amountOwed}
        Totalamount={overallReport}
      />
    </Box>
  );
};

export default CustomerDetails;
