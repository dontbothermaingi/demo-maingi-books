import { Button, Divider, useMediaQuery, useTheme } from "@mui/material";
import { Box,Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { tokens } from "../../theme";
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { useEffect, useState, useRef } from "react";
import './Invoicepage.css'; // Import your CSS file
import StatBox from "../StatBox";
import { PointOfSale } from "@mui/icons-material";

const InvoiceLayout = ({ items, status,remainder,currency, diesel, vendorPin, customerEmail, typeVat, paidtotal, customerPhone, subtotal, title, total, vatamount, address, country, customerName, invoiceNumber, invoiceDate, terms, dueDate, salesPerson, truckNumber }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formattedItems, setFormattedItems] = useState([]);
  const componentRef = useRef();
  const itemsPerPage = 14;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${title}_Invoice_${invoiceNumber}`,
  });

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

  function setPageItems (items,itemsPerPage){
    let Pages = []
    for(let i = 0; i < items.length; i += itemsPerPage){
      Pages.push(items.slice(i, i + itemsPerPage))
    }
    return Pages
  }

  const pages = setPageItems(formattedItems,itemsPerPage)

  const totalTotal = new Intl.NumberFormat().format(total);
  

  const columns = [
    { field: "item_details", headerName: "ITEM", flex: 0.3 },
    { field: "quantity", headerName: "QUANTITY", flex: 0.1 },
    { field: "rate", headerName: "RATE", flex: 0.2 },
    { field: "vat", headerName: "VAT", flex: 0.1 },
    { field: "rate_vat", headerName: "VAT AMOUNT", flex: 0.1 },
    { field: "sub_total", headerName: "SUB TOTAL", flex: 0.2 },
    { field: "description", headerName: "TRUCKS", flex: 0.3 },
  ];

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
      

      <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'} margin={'5px'}>Invoice Number: #{invoiceNumber}</Typography>
      <Box
            display="grid"
            gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(3,1fr)', md:'repeat(12,1fr)'}}
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

      

      {isMobile ? (
         <Box mt={4}>
            <Button variant="contained" color="secondary" onClick={handlePrint}>Download Invoice</Button>

            <Box ref={componentRef} className="a4-print-mobile" padding='10mm'>

          {pages.map((pageItems,pageIndex) => (
            <Box key={pageIndex} className="invoice-page" display='flex' flexDirection='column' height='92vh' justifyContent='space-between'>

              {/* {Header} */}
              <Box>
                  <Box textAlign='right' mb='10px'>
                    <Box textAlign='right'>
                      <Typography fontSize='35px' color="black" fontWeight="bold" className="INVOICE">{title}</Typography>
                    </Box>
                  </Box>

                  <Box mb='20px' display='flex' justifyContent='space-between'>
                    <Box>
                    <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL TO</Typography>
                    <Typography fontSize='14px' color="black" className="Info">{customerName}</Typography>
                    <Typography fontSize='14px' color="black" className="Info">{customerEmail}</Typography>
                    <Typography fontSize='14px' color="black" className="Info">{customerPhone}</Typography>
                    <Typography fontSize='14px' color="black" className="Info">KRA PIN: {vendorPin}</Typography>
                    </Box>

                    <Box>
                    <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL FROM</Typography>
                      <Typography fontSize='14px' color="black" className="Info">MAINGI BOOKS</Typography>
                      <Typography fontSize='14px' color="black" className="Info">County, Country</Typography>
                      <Typography fontSize='14px' color="black" className="Info">Country</Typography>
                    </Box>

                    <Box>
                    <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">INVOICE</Typography>
                      <Typography fontSize='14px' color="black" className="Info">{invoiceNumber}</Typography>
                      <Typography fontSize='14px' color="black" className="Info">Date: {invoiceDate}</Typography>
                      <Typography fontSize='14px' color="black" className="Info">Due Date: {dueDate}</Typography>
                    </Box>

                    <Box textAlign='right'>
                      {customerName === 'EKATI FUELS' && (
                        <Box textAlign='right'>
                          <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">DIESEL</Typography>
                          <Typography fontSize='14px' color="black" className="Info">{diesel} Litres</Typography>
                        </Box>
                      )}
                    </Box>

                  </Box>
              </Box>
                
                {/* {Content Area} */}
                <Box marginBottom='20px' className="table-container">
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
                        {pageItems.map((item, index) => (
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

                  {pageIndex === pages.length - 1 && (
                        <Box>
                          <Box display='flex' justifyContent='space-between' mt='20px'>
                            <Box>
                              
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
                        </Box>
                    )}
                </Box>

                {/* {Footer} */}
                <Box justifyContent={'flex-end'}>
                  <Divider orientation="horizontal" sx={{width:"auto", color:'black', mt:'20px'}}/>

                  <Box display='flex' gap='20px' justifyContent='space-between' mt='20px'>
                    <Box>
                      <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Payment Info</Typography>
                      <Typography fontSize='14px' color='black' className="Info">MAINGI BOOKS LIMITED</Typography>
                    </Box>

                    <Box>
                      <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Terms & Conditions</Typography>
                      <Typography fontSize='14px' color='black' className="Info">Payment to be made in {terms}</Typography>
                      <Typography fontSize='14px' color='black' className="Info">The VAT is {typeVat}</Typography>
                      <Typography fontSize='14px' color='black' className="Info">Pay using {currency}</Typography>
                    </Box>

                    <Box>
                      <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Contact Us</Typography>
                      <Typography fontSize='14px' color="black" className="Info">+52045889632</Typography>
                      <Typography fontSize='14px' color="black" className="Info">maingibooks@yahoo.com</Typography>
                    </Box>
                  </Box>
                </Box>
          </Box>
          ))}
            </Box>
        </Box>
      ):(

        <Box>

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

          <Box ref={componentRef} className="a4-print" padding='10mm'>

        {pages.map((pageItems,pageIndex) => (
          <Box key={pageIndex} className="invoice-page" display='flex' flexDirection='column' height='92vh' justifyContent='space-between'>

            {/* {Header} */}
            <Box>
                <Box textAlign='right' mb='10px'>
                  <Box textAlign='right'>
                    <Typography fontSize='35px' color="black" fontWeight="bold" className="INVOICE">{title}</Typography>
                  </Box>
                </Box>

                <Box mb='20px' display='flex' justifyContent='space-between'>
                  <Box>
                  <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL TO</Typography>
                  <Typography fontSize='14px' color="black" className="Info">{customerName}</Typography>
                  <Typography fontSize='14px' color="black" className="Info">{customerEmail}</Typography>
                  <Typography fontSize='14px' color="black" className="Info">{customerPhone}</Typography>
                  <Typography fontSize='14px' color="black" className="Info">KRA PIN: {vendorPin}</Typography>
                  </Box>

                  <Box>
                  <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL FROM</Typography>
                    <Typography fontSize='14px' color="black" className="Info">MAINGI BOOKS LIMITED</Typography>
                    <Typography fontSize='14px' color="black" className="Info">Somewhere, County</Typography>
                    <Typography fontSize='14px' color="black" className="Info">Country</Typography>
                  </Box>

                  <Box>
                  <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">INVOICE</Typography>
                    <Typography fontSize='14px' color="black" className="Info">{invoiceNumber}</Typography>
                    <Typography fontSize='14px' color="black" className="Info">Date: {invoiceDate}</Typography>
                    <Typography fontSize='14px' color="black" className="Info">Due Date: {dueDate}</Typography>
                  </Box>

                  <Box textAlign='right'>
                    {customerName === 'EKATI FUELS' && (
                      <Box textAlign='right'>
                        <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">DIESEL</Typography>
                        <Typography fontSize='14px' color="black" className="Info">{diesel} Litres</Typography>
                      </Box>
                    )}
                  </Box>

                </Box>
            </Box>
              
              {/* {Content Area} */}
              <Box marginBottom='20px' className="table-container">
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
                      {pageItems.map((item, index) => (
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

                {pageIndex === pages.length - 1 && (
                      <Box>
                        <Box display='flex' justifyContent='space-between' mt='20px'>
                          <Box>
                            
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
                      </Box>
                  )}
              </Box>

              {/* {Footer} */}
              <Box justifyContent={'flex-end'}>
                <Divider orientation="horizontal" sx={{width:"auto", color:'black', mt:'20px'}}/>

                <Box display='flex' gap='20px' justifyContent='space-between' mt='20px'>
                  <Box>
                    <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Payment Info</Typography>
                    <Typography fontSize='14px' color='black' className="Info">MAINGI BOOKS LIMITED</Typography>
                  </Box>

                  <Box>
                    <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Terms & Conditions</Typography>
                    <Typography fontSize='14px' color='black' className="Info">Payment to be made in {terms}</Typography>
                    <Typography fontSize='14px' color='black' className="Info">The VAT is {typeVat}</Typography>
                    <Typography fontSize='14px' color='black' className="Info">Pay using {currency}</Typography>
                  </Box>

                  <Box>
                    <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Contact Us</Typography>
                    <Typography fontSize='14px' color="black" className="Info">+52045889632</Typography>
                    <Typography fontSize='14px' color="black" className="Info">maingibooks@yahoo.com</Typography>
                  </Box>
                </Box>
              </Box>
        </Box>
        ))}
          </Box>

      </Box>
      )}

     
    </Box>
  );
};

export default InvoiceLayout;
