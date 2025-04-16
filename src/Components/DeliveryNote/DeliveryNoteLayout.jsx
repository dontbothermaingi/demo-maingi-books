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

          <Box textAlign='right'>
            <Typography fontSize='35px' color="black" fontWeight="bold" className="INVOICE">{title}</Typography>
            <Typography fontSize='14px' color="black" className="Info">Delivery Note Number: {deliveryNumber}</Typography>
            <Typography fontSize='14px' color="black" className="Info">Date: {new Date(deliveryDate).toLocaleDateString('en-GB')}</Typography>
          </Box>

          <Box display={'flex'} justifyContent={'space-between'}>
              <Box>
                <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">TRANSPORTER</Typography>
                <Typography fontSize='14px' color="black" className="Info">MAINGI BOOKS</Typography>
                <Typography fontSize='14px' color="black" className="Info">Somewhere, County</Typography>
                <Typography fontSize='14px' color="black" className="Info">Country</Typography>
              </Box>

                <Box>
                <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">CONSIGNEE</Typography>
                <Typography fontSize='14px' color="black" className="Info">{customerName}</Typography>
                <Typography fontSize='14px' color="black" className="Info">{customerEmail}</Typography>
                <Typography fontSize='14px' color="black" className="Info">{customerPhone}</Typography>
                <Typography fontSize='14px' color="black" className="Info">KRA PIN: {vendorPin}</Typography>
                </Box>

                <Box>
                    <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">VEHICLE INFORMATION</Typography>
                    <Typography fontSize='14px' color="black" className="Info">Vehicle Number: {truckNumber}</Typography>
                    <Typography fontSize='14px' color="black" className="Info">Driver: {driver}</Typography>
                    <Typography fontSize='14px' color="black" className="Info">Phone Number: {driverContact}</Typography>
                </Box>

                <Box>
                  <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">FROM</Typography>
                  <Typography fontSize='14px' color="black" className="Info">{origin}</Typography>
                </Box>

                <Box>
                  <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">TO</Typography>
                  <Typography fontSize='14px' color="black" className="Info">{destination}</Typography>
                </Box>
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
            <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER" mb={'20px'}>GOODS RECEIVED IN GOOD ORDER</Typography>

            <Typography fontSize='14px' color="black" className="Info" mb="20px">
                Name: <span style={{ borderBottom: '1px solid black', paddingRight: '150px' }}></span>
            </Typography>

            <Typography fontSize='14px' color="black" className="Info"  mb="20px">
                Signature: <span style={{ borderBottom: '1px solid black', paddingRight: '150px' }}></span>
            </Typography>

            <Typography fontSize='14px' color="black" className="Info"  mb="20px">
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
