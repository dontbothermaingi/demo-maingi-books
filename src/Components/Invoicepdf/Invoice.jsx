import { useTheme } from "@mui/material";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { tokens } from "../../theme";
import ReactToPrint from 'react-to-print';
import { useEffect, useState, useRef } from "react";
import './Invoicepage.css'; // Import your CSS file
import StatBox from "../StatBox";
import { PointOfSale } from "@mui/icons-material";

const InvoiceLayout = ({ items, status,remainder, currency, vendorPin, customerEmail, typeVat, paidtotal, customerPhone, subtotal, title, total, vatamount, address, country, customerName, invoiceNumber, invoiceDate, terms, dueDate, salesPerson, truckNumber }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formattedItems, setFormattedItems] = useState([]);
  const componentRef = useRef();

  useEffect(() => {
    const formatted = items.map(item => ({
      ...item,
      rate: new Intl.NumberFormat().format(item.rate),
      amount: new Intl.NumberFormat().format(item.amount),
      rate_vat: new Intl.NumberFormat().format(item.rate_vat),
      sub_total: new Intl.NumberFormat().format(item.sub_total)
    }));
    setFormattedItems(formatted);
  }, [items, truckNumber]);

  const totalTotal = new Intl.NumberFormat().format(total);

  const columns = [
    { field: "item_details", headerName: "ITEM", flex: 0.3 },
    { field: "quantity", headerName: "WEIGHT", flex: 0.1 },
    { field: "rate", headerName: "RATE", flex: 0.2 },
    { field: "vat", headerName: "VAT", flex: 0.1 },
    { field: "rate_vat", headerName: "VAT AMOUNT", flex: 0.1 },
    { field: "sub_total", headerName: "SUB TOTAL", flex: 0.2 },
    { field: "description", headerName: "DESCRIPTION", flex: 0.3 },
  ];

  return (
    <Box>
      <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
            mb='20px'
            mt='20px'
            ml='20px'
        >
        
        <Box
          gridColumn="span 3"
          backgroundColor= "#f2f0f0"
          borderRadius='10px'
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title = {paidtotal}
            subtitle="PAYMENT MADE"
            // progress="0.75"
            // increase="+14%"
            icon={
              <PointOfSale
                sx={{ color: "#4cceac", fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
           gridColumn='span 3'
           backgroundColor= "#f2f0f0"
           borderRadius='10px'
           display="flex"
           alignItems="center"
           justifyContent="center"
        >

          <StatBox
            title={remainder}
            subtitle="REMAINDER"
            icon={
              <PointOfSale 
                    sx={{ color: "#4cceac", fontSize: "26px" }}
              />
            }
          >
          </StatBox>

        </Box>

        <Box
           gridColumn='span 3'
           backgroundColor="#f2f0f0"
           borderRadius='10px'
           display="flex"
           alignItems="center"
           justifyContent="center"
        >

          <StatBox
              title={status}
              subtitle='STATUS'
            >

          </StatBox>

        </Box>

      </Box>

      <Box ref={componentRef} className="a4-print" padding='10mm'>
        <Box display='flex' justifyContent='space-between' mb='20px'>
          <Box>
            <Typography fontSize='24px' color="black" fontWeight="bold">EKATI HAULIERS</Typography>
            <Typography variant="h6" color="black">Emali, Makueni</Typography>
            <Typography variant="h6" color="black">Kenya</Typography>
          </Box>
          <Box textAlign='right'>
            <Typography variant="h4" color="black" fontWeight="bold">{title}</Typography>
            <Typography fontSize='16px' color="black">Invoice Number: {invoiceNumber}</Typography>
            <Typography fontSize='16px' color="black">Invoice Date: {invoiceDate}</Typography>
            <Typography fontSize='16px' color="black">Due Date: {dueDate}</Typography>
          </Box>
        </Box>

        <Box mb='20px'>
          <Typography fontSize='24px' color="black" fontWeight="bold">BILL TO</Typography>
          <Typography fontSize='16px' color="black">{customerName}</Typography>
          <Typography fontSize='16px' color="black">{customerEmail}</Typography>
          <Typography fontSize='16px' color="black">{customerPhone}</Typography>
          <Typography fontSize='16px' color="black">KRA PIN: {vendorPin}</Typography>
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
                {formattedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.item_details}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.rate}</TableCell>
                    <TableCell>{item.vat}</TableCell>
                    <TableCell>{item.rate_vat}</TableCell>
                    <TableCell>{item.sub_total}</TableCell>
                    <TableCell>{item.description}</TableCell>
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
            <Typography variant="h6" color='black' fontWeight="bold">OTHER COMMENTS</Typography>
            <Typography variant="body2" color='black'>1. Make all cheques payable to EKATI HAULIERS LIMITED</Typography>
            <Typography variant="body2" color='black'>2. Payment to be made in {terms}</Typography>
            <Typography variant="body2" color='black'>3. The VAT is {typeVat}</Typography>
            <Typography variant="body2" color='black'>4. Pay using {currency}</Typography>
          </Box>
          <Box width='50%' textAlign='right'>
            <Box mb='1px' display='flex' flexDirection='row' justifyContent='right' gap='10px' alignItems='center'>
              <Typography fontSize='17px' color='black' fontWeight="bold">SUB TOTAL :</Typography>
              <Typography fontSize='17px' color='black'>{subtotal}</Typography>
            </Box>
            <Box mb='1px' display='flex' flexDirection='row' justifyContent='right' gap='10px'>
            <Box><Typography fontSize='17px' color='black' fontWeight="bold" >VAT AMOUNT :</Typography></Box>
            <Box><Typography fontSize='17px' color='black' >{vatamount}</Typography></Box>
          </Box>

            <Box mb='1px' display='flex' flexDirection='row' justifyContent='right' gap='10px'>
              <Typography fontSize='17px' color='black' fontWeight="bold" mr='0'>TOTAL :</Typography>
              <Typography fontSize='17px' color='black'>{totalTotal}</Typography>
            </Box>
          </Box>
        </Box>

        <Box display='flex' justifyContent='center' mt='30px'>
          <Typography variant="body1" color='black'>
            If you have any questions about this invoice please contact
          </Typography>
        </Box>

        <Box display='flex' justifyContent='center'>
          <Typography variant="body1" color='black' fontWeight="bold">
            Gerald, 0728891580, gmutyetumo@yahoo.com
          </Typography>
        </Box>

        <Box display='flex' justifyContent='center' mt='30px'>
          <Typography fontSize='24px' color='black' fontWeight="bold">
            THANK YOU FOR YOUR BUSINESS!
          </Typography>
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

export default InvoiceLayout;
