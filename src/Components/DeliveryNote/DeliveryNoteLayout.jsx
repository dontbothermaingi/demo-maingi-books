import { useTheme } from "@mui/material";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { tokens } from "../../theme";
import ReactToPrint from 'react-to-print';
import { useEffect, useRef, useState } from "react";
import './Delivery.css'; // Import

const DeliveryNoteLayout = ({ title, customerName, customerEmail, customerPhone, deliveryDate, deliveryNumber, items, vendorPin, origin, destination, driver, driverContact, truckNumber,}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();
  const [item, setItem] = useState([]);


  useEffect(() => {
    const formatted = items.map(item => ({
      ...item,
      delivery_date: new Date(item.delivery_date).toLocaleDateString('en-GB'),
    }));
    setItem(formatted);
  }, [items]);



  const columns = [
    { field: "container_number", headerName: "CONTAINER NUMBER", flex: 0.3 },
    { field: "cargo description", headerName: "CARGO DESCRIPTION", flex: 0.1 },
    { field: "quantity", headerName: "QUANTITY", flex: 0.2 },
    { field: "weight", headerName: "WEIGHT", flex: 0.1 },
    { field: "measurement", headerName: "MEASUREMENT", flex: 0.1 },
  ];

  return (
    <Box>

      <Box ref={componentRef} className="a4-print" padding='10mm'>
        <Box display='flex' justifyContent='space-between' mb='20px'>
          <Box>
            <Typography fontSize='24px' color="black" fontWeight="bold">EKATI HAULIERS</Typography>
            <Typography variant="h6" color="black">Emali, Makueni</Typography>
            <Typography variant="h6" color="black">Kenya</Typography>
          </Box>
          <Box textAlign='right'>
            <Typography variant="h4" color="black" fontWeight="bold">{title}</Typography>
            <Typography fontSize='16px' color="black">Delivery Note Number: {deliveryNumber}</Typography>
            <Typography fontSize='16px' color="black">Date: {new Date(deliveryDate).toLocaleDateString('en-GB')}</Typography>
          </Box>
        </Box>

        <Box display='flex' justifyContent='space-between' mb='20px'>
                <Box mb='20px'>
                <Typography fontSize='24px' color="black" fontWeight="bold">CONSIGNEE</Typography>
                <Typography fontSize='16px' color="black">{customerName}</Typography>
                <Typography fontSize='16px' color="black">{customerEmail}</Typography>
                <Typography fontSize='16px' color="black">{customerPhone}</Typography>
                <Typography fontSize='16px' color="black">KRA PIN: {vendorPin}</Typography>
                </Box>

                <Box textAlign='right' mb='20px'>
                    <Typography fontSize='24px' color="black" fontWeight="bold">VEHICLE INFORMATION</Typography>
                    <Typography fontSize='16px' color="black">Vehicle Number: {truckNumber}</Typography>
                    <Typography fontSize='16px' color="black">Driver: {driver}</Typography>
                    <Typography fontSize='16px' color="black">Phone Number: {driverContact}</Typography>
                </Box>
        </Box>

        <Box mb='20px'>
          <Typography fontSize='24px' color="black" fontWeight="bold">FROM</Typography>
          <Typography fontSize='16px' color="black">{origin}</Typography>
        </Box>

        <Box mb='20px'>
          <Typography fontSize='24px' color="black" fontWeight="bold">TO</Typography>
          <Typography fontSize='16px' color="black">{destination}</Typography>
        </Box>

        <Box marginBottom='30px' className="table-container">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize:'10px' }}>{column.headerName}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {item.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.container_number}</TableCell>
                    <TableCell>{item.cargo_description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                    <TableCell>{item.measurement}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box display='flex' justifyContent='space-between' mt='20px'>
          <Box
            border="1px solid"
            borderColor={colors.grey[200]}
            padding="10px"
            width='50%'
            sx={{ borderRadius: '8px' }}
          >
            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">GOODS RECEIVED IN GOOD ORDER</Typography>

            <Typography fontSize='16px' color="black" mb="20px">
                Name: <span style={{ borderBottom: '1px solid black', paddingRight: '150px' }}></span>
            </Typography>

            <Typography fontSize='16px' color="black"  mb="20px">
                Signature: <span style={{ borderBottom: '1px solid black', paddingRight: '150px' }}></span>
            </Typography>

            <Typography fontSize='16px' color="black"  mb="20px">
                Date: <span style={{ borderBottom: '1px solid black', paddingRight: '150px' }}></span>
            </Typography>

          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt="20px">
        <ReactToPrint
          trigger={() => (
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                '&:hover': {
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

export default DeliveryNoteLayout;
