import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaymentLayout from "./PaymentsLayout";

function PaymentsDetails() {
  const { madeId } = useParams();
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0); // Initialize subtotal state
  const [total, setTotal] = useState(null);
  const [vatTotal, setVatTotal] = useState(null);
  const token = localStorage.getItem('access_token')



  useEffect(() => {
    setLoading(true);
    fetch(`https://demo-server-757m.onrender.com/paymentsmade/${madeId}`, {
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`
      },
      credentials:'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch quote details");
        }
        return response.json();
      })
      .then((data) => {
        setQuotes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [madeId,token]);

  useEffect(() => {
    if (quotes && quotes.items) {
      // Calculate subtotal from items array
      const subtotalAmount = quotes.items.reduce((total, item) => total + item.sub_total, 0);
      const totalSubTotalAmount = new Intl.NumberFormat().format(subtotalAmount)
      setSubtotal(totalSubTotalAmount);

      // Calculate vat amount from items array
      const vatAmount = quotes.items.reduce((total, item) => total + item.rate_vat, 0);
      const totalVatAmount = new Intl.NumberFormat().format(vatAmount)
      setVatTotal(totalVatAmount);

      // Calculate total amount based on VAT type
      if (quotes.type_vat === "Exclusive VAT") {
        const calculateTotal = subtotalAmount + vatAmount
        const displayTotal = new Intl.NumberFormat().format(calculateTotal)
        setTotal(displayTotal);
      } else {
        const calculateTotal = subtotalAmount + vatAmount
        setTotal(calculateTotal);
      }
    }
  }, [quotes]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!quotes) {
    return null; // Render nothing if there's no quote data and no error
  }

  return (
    <Box>
      <PaymentLayout
        title={'PAYMENT SLIP'}
        vendorName={quotes.vendor_name}
        vendorEmail={quotes.vendor_email}
        vendPhone={quotes.vendor_phone}
        paymentDate={quotes.payment_date}
        payment={quotes.payment}
        vendorPin={quotes.vendor_pin}
        paymentMode={quotes.payment_mode}
        paymentAmount={quotes.payment_amount}
        payWith={quotes.deposit_to}
        bankName={quotes.bank_name}
        subtotal={subtotal}
        vatamount={vatTotal}
        total={total}
      />
    </Box>
  );
}

export default PaymentsDetails;
