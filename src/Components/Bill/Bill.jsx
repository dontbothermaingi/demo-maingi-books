import { Typography, Box, useTheme, Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody } from "@mui/material";
import { tokens } from "../../theme";
import { useRef } from "react";
import ReactToPrint from 'react-to-print';
import StatBox from "../StatBox";
import { PointOfSale } from "@mui/icons-material";

const BillLayout = ({ items,status,remainder,vendorPin, vendorEmail, paidtotal, vendorPhone, subtotal,title, total, vatamount,vendorName, invoiceNumber, invoiceDate,dueDate,truckNumber }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();

  const columns = [
    // { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "item_details",
      headerName: "ITEM",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      headerAlign: "left",
      flex: 0.3,
      align: "left",
    },
    {
      field: "rate",
      headerName: "RATE",
      flex: 0.3,
    },
    {
      field: "sub_total",
      headerName: "SUB TOTAL",
      flex: 0.3,
    },
    {
      field: "vat",
      headerName: "VAT",
      flex: 0.2,
    },
    {
      field: "rate_vat",
      headerName: "VAT AMOUNT",
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      flex: 0.5,
    },
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

      <Box ref={componentRef} mb="60px" backgroundColor={'white'} m='10px' height='1200px' borderRadius='10px' >
        <Box display='flex' justifyContent='space-between'>
          <Box>
            <Typography fontSize='25px' color={"black"} ml='23px' mt='9px' fontWeight="bold">
              EKATI HAULIERS
            </Typography>
            <Typography fontSize='17px' ml='23px' color={"black"}>
              Emali, Makueni
            </Typography>
            <Typography fontSize='17px' ml='23px' color={"black"}>
              Kenya
            </Typography>
          </Box>
          <Box>
            <Typography
              fontSize='25px'
              color={"black"}
              fontWeight="bold"
              // sx={{ m: "0 0 5px 0" }}
              mt='9px'
            >
              {title}
            </Typography>
            <Typography fontSize='17px' mr='15px' color={"black"}>
              Bill Number: #{invoiceNumber}
            </Typography>
            <Typography fontSize='17px'  mr='15px' color={"black"}>
              Bill Date: {invoiceDate}
            </Typography>
            <Typography fontSize='17px'  mr='15px' color={"black"}>
              Due Date: {dueDate}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            fontSize='23px' 
            color={"black"}
            fontWeight="bold"
            // sx={{ m: "0 0 5px 0" }}
            mt='30px'
            ml='23px'
          >
            VENDOR
          </Typography>
          <Typography fontSize='17px'  ml='23px' color={"black"}>
            {vendorName}
          </Typography>
          <Typography fontSize='17px'  ml='23px' color={"black"}>
            {vendorEmail}
          </Typography>
          <Typography fontSize='17px'  ml='23px' color={"black"}>
            {vendorPhone}
          </Typography>
          <Typography fontSize='17px'  ml='23px' color={"black"}>
            KRA PIN: {vendorPin}
          </Typography>
        </Box>

        <Box mt='50px' mb='50px'>
          <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '12px' }}>{column.headerName}</TableCell>
                                            ))}
                                   </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.item_details}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.vat}</TableCell>
                                                <TableCell>{item.rate}</TableCell>
                                                <TableCell>{item.sub_total}</TableCell>
                                                <TableCell>{item.rate_vat}</TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                        
                                </Table>
          </TableContainer>    
        </Box>

        <Box display='flex' justifyContent='right' mt='15px'>
          <Box>
            <Box display='flex' mr='15px' justifyContent='right'>
              <Typography fontSize='17px' color={'black'} fontWeight="bold" mr='40px'> SUB TOTAL:</Typography> 
              <Typography fontSize='17px' color={'black'} fontWeight="bold">{subtotal}</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
            <Box display='flex' mr='15px' justifyContent='right'>
              <Typography fontSize='17px' color={'black'} fontWeight="bold" mr='40px'> VAT AMOUNT:</Typography> 
              <Typography fontSize='17px' color={'black'} fontWeight="bold">{vatamount}</Typography>
            </Box>
        </Box>

        <Box>
            <Box display='flex' mr='15px' justifyContent='right'>
              <Typography fontSize='17px' color={'black'} fontWeight="bold" mr='40px'> TOTAL:</Typography> 
              <Typography fontSize='17px' color={'black'} fontWeight="bold">{total}</Typography>
            </Box>
        </Box>
        
        <Box display='flex' justifyContent='center' mt='50px'>
          <Typography fontSize='22px' color={'black'} fontWeight="bold">
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

export default BillLayout;
