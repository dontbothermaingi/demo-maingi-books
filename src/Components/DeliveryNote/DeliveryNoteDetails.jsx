import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeliveryNoteLayout from "./DeliveryNoteLayout";

function DeliveryNoteDetails() {
  const { deliveryId } = useParams();
  const [ deliveryNotes, setDeliveryNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://demo-server-757m.onrender.com/deliverynotes/${deliveryId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch delivery note details");
        }
        return response.json();
      })
      .then((data) => {
        setDeliveryNote(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [deliveryId]);

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

  if (!deliveryNotes) {
    return null; // Render nothing if there's no quote data and no error
  }

  return (
    <Box>
      <DeliveryNoteLayout
        title={'DELIVERY NOTE'}
        customerName={deliveryNotes.customer_name}
        customerEmail={deliveryNotes.customer_email}
        customerPhone={deliveryNotes.customer_phone}
        deliveryDate={deliveryNotes.delivery_date}
        deliveryNumber={deliveryNotes.delivery_number}
        items={deliveryNotes.items}
        vendorPin={deliveryNotes.vendor_pin}
        origin={deliveryNotes.origin_place}
        destination={deliveryNotes.destination}
        driver={deliveryNotes.driver}
        driverContact={deliveryNotes.driver_contact}
        truckNumber={deliveryNotes.truck_number}
        invoiceNumber={deliveryNotes.invoice_number}
      />
    </Box>
  );
}

export default DeliveryNoteDetails;
