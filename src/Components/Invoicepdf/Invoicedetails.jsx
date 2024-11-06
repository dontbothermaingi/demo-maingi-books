import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InvoiceLayout from "./Invoice";
import { useNavigate, useParams } from "react-router-dom";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [total, setTotal] = useState(null);
  const [vatTotal, setVatTotal] = useState(null);
  const [diesels, setDiesels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0); // Initialize subtotal state
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate()


  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetch(`https://db-demo-u07o.onrender.com/invoices/${invoiceId}`,{
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`
      },
      credentials:'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched invoice:', data); // Debugging log
        setInvoice(data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch(error => {
        console.error('Error fetching invoice:', error);
        setError(error); // Set error state
        setLoading(false); // Set loading to false in case of error
      });
  }, [invoiceId,token]);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/pumpnames',{
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`
      },
      credentials:'include'
    })
      .then(response => response.json())
      .then(data => {
        const pumpname = invoice.items.length > 0 ? invoice.items[0].item_details : null;
        console.log(pumpname)
        const pump = pumpname ? data.filter(pump => pump.pump_name === pumpname) : [];
        const fuelPump = pump[0]
        console.log(fuelPump)
        const total = parseInt(fuelPump.litres)
        setDiesels(total);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [invoice,token]);

  const totalDiesel = new Intl.NumberFormat().format(diesels);

  useEffect(() => {
    if (invoice && invoice.items) {
      // Calculate subtotal from items array
      const subtotalAmount = invoice.items.reduce((total, item) => total + item.sub_total, 0);
      const totalSubTotalAmount = new Intl.NumberFormat().format(subtotalAmount)
      setSubtotal(totalSubTotalAmount);

      // Calculate vat amount from items array
      const vatAmount = invoice.items.reduce((total, item) => total + item.rate_vat, 0);
      const totalVatAmount = new Intl.NumberFormat().format(vatAmount)
      setVatTotal(totalVatAmount);

      // Calculate total amount based on VAT type
      if (invoice.type_vat === "Exclusive VAT") {
        const calculateTotal = subtotalAmount + vatAmount
        const displayTotal = new Intl.NumberFormat().format(calculateTotal)
        setTotal(displayTotal);
      } else {
        const calculateTotal = subtotalAmount + vatAmount
        setTotal(calculateTotal);
      }
    }
  }, [invoice,token]);


  const formatedPayment = invoice ? new Intl.NumberFormat().format(invoice.amount_paid || 0) : "";
  const formatedRemainder = invoice ? new Intl.NumberFormat().format(invoice.amount_owed || 0) : "";

  function handleInvoiceEdit(){
    navigate(`/invoice-edit/${invoiceId}`)
  }


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching invoice details</div>;
  if (!invoice) return <div>No invoice data available</div>;

  return (
    <Box m="30px">

      <Button
          variant="contained"
          color="secondary"
          onClick={handleInvoiceEdit}
      >
        <Typography>EDIT INVOICE</Typography>
      </Button>

      <InvoiceLayout
        title="INVOICE"
        address={invoice.address}
        country={invoice.country}
        invoiceNumber={invoice.invoice_number}
        invoiceDate={invoice.invoice_date}
        terms={invoice.invoice_terms}
        dueDate={invoice.due_date}
        salesPerson={invoice.sales_person}
        customerName={invoice.customer_name}
        items={invoice.items}
        consignee={invoice.consignee}
        customerPhone={invoice.customer_phone}
        customerEmail={invoice.customer_email}
        currency={invoice.currency}
        subtotal={subtotal}
        vatamount={vatTotal}
        vendorPin={invoice.vendor_pin}
        typeVat={invoice.type_vat}
        total={total}
        status={invoice.status}
        paidtotal={formatedPayment}
        remainder={formatedRemainder}
        diesel={totalDiesel}
         // Use formatted remainder here
      />
    </Box>
  );
};

export default InvoiceDetails;
