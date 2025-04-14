import { Typography, Box, useTheme, Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Divider, Card, CardContent, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import { useRef } from "react";
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import './Bill.css'; // Import your CSS file


const BillLayout = ({ items,status,remainder,vendorPin, vendorEmail, paidtotal, vendorPhone, subtotal,title, total, vatamount,vendorName, invoiceNumber, invoiceDate,dueDate,truckNumber }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();
  const itemsPerPage = 14;

  function splitItemToPages(items,itemsperpage){
    let pages = []
    for(let i = 0; i < items.length; i += itemsperpage){
      pages.push(items.slice(i, i + itemsperpage))
    }
    return pages
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${title}_Invoice_${invoiceNumber}`,
  });

  const Pages = splitItemToPages(items,itemsPerPage)


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

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography fontSize={'27px'} fontFamily={"GT Medium"} mt={'20px'} textAlign={'center'} >Bill Number: #{invoiceNumber}</Typography>
        <Box
            display="grid"
            gridTemplateColumns={{md:"repeat(3, 1fr)", xs:"repeat(1, 1fr)"}}
            gap="20px"
            margin={'30px'}
        >
        
        <Card
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            height: 'auto', // Adjust height for better flexibility
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
        }}
        >

          <CardContent sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Typography fontSize={'23px'} fontWeight={'bold'}>{paidtotal}</Typography>
            <Typography color={'#70d8bd'} fontSize={'27px'} fontWeight={'bold'}>PAYMENT MADE</Typography>
          </CardContent>

        </Card>

        <Card
            sx={{
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              height: 'auto', // Adjust height for better flexibility
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
          }}
        >

          <CardContent sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Typography fontSize={'23px'} fontWeight={'bold'}>{remainder}</Typography>
            <Typography color={'#70d8bd'} fontSize={'27px'} fontWeight={'bold'}>REMAINDER</Typography>
          </CardContent>

        </Card>

        <Card
          sx={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            height: 'auto', // Adjust height for better flexibility
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
        }}
        >
          <CardContent sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Typography fontSize={'23px'} fontWeight={'bold'}>{status}</Typography>
            <Typography color={'#70d8bd'} fontSize={'27px'} fontWeight={'bold'}>STATUS</Typography>
          </CardContent>

        </Card>

      </Box>

      {isMobile ? (
        <Box>
            <Button variant="contained" color="secondary" sx={{fontFamily:'GT Bold'}} onClick={handlePrint}>Download Bill</Button>

            <Box ref={componentRef} className="a4-print-mobile" padding='10mm' >
                  {Pages.map((pageItems,pageIndex) => (
                    <Box key={pageIndex} className="invoice-page" mb='20px'>

                      {/* {Header} */}
                      <Box>
                          <Box textAlign='right' mb='10px'>
                            <Box textAlign='right'>
                              <Typography fontSize='35px' color="black" fontWeight="bold" className="INVOICE">{title}</Typography>
                            </Box>
                          </Box>

                          <Box mb='20px' display='flex' justifyContent='space-between'>
                            <Box>
                            <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL FROM</Typography>
                            <Typography fontSize='14px' color="black" className="Info">{vendorName}</Typography>
                            <Typography fontSize='14px' color="black" className="Info">{vendorEmail}</Typography>
                            <Typography fontSize='14px' color="black" className="Info">{vendorPhone}</Typography>
                            <Typography fontSize='14px' color="black" className="Info">KRA PIN: {vendorPin}</Typography>
                            </Box>

                            <Box>
                            <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL TO</Typography>
                              <Typography fontSize='14px' color="black" className="Info">EKATI HAULIERS</Typography>
                              <Typography fontSize='14px' color="black" className="Info">Emali, Makueni</Typography>
                              <Typography fontSize='14px' color="black" className="Info">Kenya</Typography>
                            </Box>

                            <Box>
                            <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL</Typography>
                              <Typography fontSize='14px' color="black" className="Info">Bill Number: #{invoiceNumber}</Typography>
                              <Typography fontSize='14px' color="black" className="Info">Date: {invoiceDate}</Typography>
                              <Typography fontSize='14px' color="black" className="Info">Due Date: {dueDate}</Typography>
                            </Box>

                          </Box>
                      </Box>

                      <Box marginBottom='30px' className="table-container">
                        <TableContainer  component={Paper} >
                                              <Table>
                                                  <TableHead>
                                                      <TableRow>
                                                          {columns.map((column) => (
                                                              <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '12px' }}>{column.headerName}</TableCell>
                                                          ))}
                                                </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                      {pageItems.map((item, index) => (
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

                              {pageIndex === Pages.length - 1 && (
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
                                        <Typography fontSize='17px' color='black'>{total}</Typography>
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
                        <Typography fontSize='14px' color='black' className="Info">EKATI HAULIERS LIMITED</Typography>
                      </Box>

                      <Box>
                        <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Terms & Conditions</Typography>
                        <Typography fontSize='14px' color='black' className="Info">The VAT is</Typography>
                        <Typography fontSize='14px' color='black' className="Info">Pay using</Typography>
                      </Box>

                      <Box>
                        <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Contact Us</Typography>
                        <Typography fontSize='14px' color="black" className="Info">0728891580</Typography>
                        <Typography fontSize='14px' color="black" className="Info">gmutyetumo@yahoo.com</Typography>
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
     
          <Box ref={componentRef} className="a4-print" padding='10mm' >
                {Pages.map((pageItems,pageIndex) => (
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
                          <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL FROM</Typography>
                          <Typography fontSize='14px' color="black" className="Info">{vendorName}</Typography>
                          <Typography fontSize='14px' color="black" className="Info">{vendorEmail}</Typography>
                          <Typography fontSize='14px' color="black" className="Info">{vendorPhone}</Typography>
                          <Typography fontSize='14px' color="black" className="Info">KRA PIN: {vendorPin}</Typography>
                          </Box>

                          <Box>
                          <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL TO</Typography>
                            <Typography fontSize='14px' color="black" className="Info">EKATI HAULIERS</Typography>
                            <Typography fontSize='14px' color="black" className="Info">Emali, Makueni</Typography>
                            <Typography fontSize='14px' color="black" className="Info">Kenya</Typography>
                          </Box>

                          <Box>
                          <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">BILL</Typography>
                            <Typography fontSize='14px' color="black" className="Info">Bill Number: #{invoiceNumber}</Typography>
                            <Typography fontSize='14px' color="black" className="Info">Date: {invoiceDate}</Typography>
                            <Typography fontSize='14px' color="black" className="Info">Due Date: {dueDate}</Typography>
                          </Box>

                        </Box>
                    </Box>

                    <Box marginBottom='30px' className="table-container">
                      <TableContainer  component={Paper} >
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        {columns.map((column) => (
                                                            <TableCell key={column.field} sx={{ fontWeight: 'bold', fontSize: '12px' }}>{column.headerName}</TableCell>
                                                        ))}
                                              </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {pageItems.map((item, index) => (
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

                            {pageIndex === Pages.length - 1 && (
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
                                      <Typography fontSize='17px' color='black'>{total}</Typography>
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
                          <Typography fontSize='14px' color='black' className="Info">EKATI HAULIERS LIMITED</Typography>
                        </Box>

                        <Box>
                          <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Terms & Conditions</Typography>
                          <Typography fontSize='14px' color='black' className="Info">The VAT is</Typography>
                          <Typography fontSize='14px' color='black' className="Info">Pay using</Typography>
                        </Box>

                        <Box>
                          <Typography fontSize='20px' color="black" fontWeight="bold" className="HEADER">Contact Us</Typography>
                          <Typography fontSize='14px' color="black" className="Info">0728891580</Typography>
                          <Typography fontSize='14px' color="black" className="Info">gmutyetumo@yahoo.com</Typography>
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

export default BillLayout;
