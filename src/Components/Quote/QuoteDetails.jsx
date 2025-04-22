import { Box, CircularProgress, Typography } from "@mui/material";
import QuoteLayout from "./QuoteLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function QuoteDetails() {
  const { quoteId } = useParams();
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0); // Initialize subtotal state
  const [total, setTotal] = useState(null);
  const [vatTotal, setVatTotal] = useState(null);


  useEffect(() => {
    setLoading(true);
    fetch(`https://maingi-demo-server.onrender.com/quotes/${quoteId}`)
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
  }, [quoteId]);

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
      <QuoteLayout
        title={'QUOTE'}
        customerName={quotes.customer_name}
        customerEmail={quotes.customer_email}
        customerPhone={quotes.customer_phone}
        quoteDate={quotes.quote_date}
        quoteNumber={quotes.quote_number}
        items={quotes.items}
        vendorPin={quotes.vendor_pin}
        typeVat={quotes.type_vat}
        subtotal={subtotal}
        vatamount={vatTotal}
        total={total}
        
      />
    </Box>
  );
}

export default QuoteDetails;
