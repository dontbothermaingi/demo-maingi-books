import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaymentLayout from "./PaymentsLayout";

function PaymentsDetails() {
  const { madeId } = useParams();
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access_token')



  useEffect(() => {
    setLoading(true);
    fetch(`https://maingi-demo-server.onrender.com/paymentsreceived/${madeId}`, {
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

  console.log(quotes)

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
        customerName={quotes.customer_name}
        customerEmail={quotes.customer_email}
        customerPhone={quotes.customer_phone}
        paymentDate={quotes.payment_date}
        payment={quotes.payment}
        customerPin={quotes.customer_pin}
        paymentMode={quotes.payment_mode}
        paymentAmount={quotes.amount_received}
        currency={quotes.currency}
        transactionItems={quotes.invoices}
      />
    </Box>
  );
}

export default PaymentsDetails;
