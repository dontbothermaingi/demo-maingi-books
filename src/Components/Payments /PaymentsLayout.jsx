import { useTheme } from "@mui/material";
import {
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { tokens } from "../../theme";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import "./PaymentsMade.css"; // Import custom CSS for additional styling

const PaymentLayout = ({
  vendorPin,
  vendorEmail,
  vendorName,
  paymentDate,
  vendorPhone,
  bankName,
  title,
  paymentAmount,
  payment,
  payWith,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();

  const formattedPaymentAmount = new Intl.NumberFormat().format(paymentAmount);

  return (
    <Box padding="20px">
      <Box ref={componentRef} className="a4-print" padding="20px" border="1px solid #ddd">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb="30px">
          <Box>
            <Typography fontSize="28px" fontWeight="bold" color="black">
              EKATI HAULIERS
            </Typography>
            <Typography variant="body1" color="black">
              Emali, Makueni, Kenya
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography fontSize="24px" fontWeight="bold" color="black">
              {title}
            </Typography>
            <Typography variant="body2" color="black">
              Payment: {payment}
            </Typography>
            <Typography variant="body2" color="black">
              Date: {paymentDate}
            </Typography>
            <Typography variant="body2" color="black">
              Amount: {formattedPaymentAmount}
            </Typography>
            <Typography variant="body2" color="black">
              Paid via: {payWith}
            </Typography>
            <Typography variant="body2" color="black">
              Bank: {bankName}
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider />

        {/* Vendor Details */}
        <Box mt="20px" mb="20px">
          <Typography fontSize="20px" fontWeight="bold" color="black" mb="10px">
            Vendor Details
          </Typography>
          <Typography variant="body2" color="black">
            Name: {vendorName}
          </Typography>
          <Typography variant="body2" color="black">
            Email: {vendorEmail}
          </Typography>
          <Typography variant="body2" color="black">
            Phone: {vendorPhone}
          </Typography>
          <Typography variant="body2" color="black">
            KRA PIN: {vendorPin}
          </Typography>
        </Box>

        {/* Summary Section */}
        <Box mt="20px" mb="20px">
          <Typography fontSize="20px" fontWeight="bold" color="black" mb="10px">
            Payment Summary
          </Typography>
          <Typography variant="body2" color="black">
            Total Payment Amount: {formattedPaymentAmount}
          </Typography>
          <Typography variant="body2" color="black">
            Payment Method: {payWith}
          </Typography>
          <Typography variant="body2" color="black">
            Bank: {bankName}
          </Typography>
        </Box>

        {/* Footer Message */}
        <Box display="flex" justifyContent="center" mt="30px">
          <Typography fontSize="18px" color="black" fontWeight="bold">
            Thank you for your business!
          </Typography>
        </Box>
      </Box>

      {/* Print Button */}
      <Box display="flex" justifyContent="center" mt="20px">
        <ReactToPrint
          trigger={() => (
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                "&:hover": {
                  backgroundColor: colors.blueAccent[500],
                },
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Print
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Box>
    </Box>
  );
};

export default PaymentLayout;
