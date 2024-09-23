import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState, useRef } from "react";
import ReactToPrint from 'react-to-print';

const AccountLayout = ({ items,remainder, vendorEmail, paidtotal, vendorPhone,title, total,vendorName, invoiceNumber, invoiceDate,dueDate,}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();


  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
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
      flex: 0.5,
      align: "left",
    },
    {
      field: "rate",
      headerName: "RATE",
      flex: 0.5,
    },
    {
      field: "vat",
      headerName: "VAT",
      flex: 0.5,
    },
    {
      field: "description",  // Define the column for truck_number
      headerName: "Description",
      flex: 0.5,
    },
  ];



  return (
    <Box  >

      <Box ref={componentRef} mb="60px" backgroundColor={'white'} m='30px' height='1200px' borderRadius='10px' >
        <Box display='flex' justifyContent='space-between'>
          <Box>
            <Typography fontSize='32px' color={"black"} ml='23px' mt='9px' fontWeight="bold">
              EKATI HAULIERS
            </Typography>
            <Typography variant="h6" ml='23px' color={"black"}>
              Emali, Makueni
            </Typography>
            <Typography variant="h6" ml='23px' color={"black"}>
              Kenya
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h4"
              color={"black"}
              fontWeight="bold"
              // sx={{ m: "0 0 5px 0" }}
              mt='9px'
            >
              {title}
            </Typography>
            <Typography fontSize='20px' mr='15px' color={"black"}>
              {invoiceNumber}
            </Typography>
            <Typography fontSize='20px'  mr='15px' color={"black"}>
              Bill Date: {invoiceDate}
            </Typography>
            <Typography fontSize='20px'  mr='15px' color={"black"}>
              Due Date: {dueDate}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            fontSize='32px' 
            color={"black"}
            fontWeight="bold"
            // sx={{ m: "0 0 5px 0" }}
            mt='30px'
            ml='23px'
          >
            VENDOR
          </Typography>
          <Typography fontSize='20px'  ml='23px' color={"black"}>
            {vendorName}
          </Typography>
          <Typography fontSize='20px'  ml='23px' color={"black"}>
            {vendorEmail}
          </Typography>
          <Typography fontSize='20px'  ml='23px' color={"black"}>
            {vendorPhone}
          </Typography>
        </Box>

        <Box
          m="40px 0 0 0"
          ml='20px'
          mr='20px'
          height="35vh" 
          color={"white"}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              color:"black",
              fontSize: "15px" 
            },
            "& .name-column--cell": {
              color:"black",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "white",
              borderBottom: "none",
              fontSize: "15px"
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: "white",
              color:"black",
            },
            "& .MuiCheckbox-root": {
              color:"black",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color:"black",
            },
          }}
        >
          <DataGrid
            rows={items}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
          />
        </Box>

        <Box display='flex' justifyContent='right' mt='15px'>
          <Box>
            <Box display='flex' mr='15px' justifyContent='right'>
              <Typography variant="h5" color={'black'} fontWeight="bold" mr='40px'> TOTAL:</Typography> 
              <Typography variant="h5" color={'black'} fontWeight="bold">{total}</Typography>
            </Box>
          </Box>
        </Box>

        {/* <Box>
            <Box display='flex' mr='15px' justifyContent='right'>
              <Typography variant="h3" color={'black'} fontWeight="bold" mr='40px'> TOTAL:</Typography> 
              <Typography variant="h3" color={'black'} fontWeight="bold">{total}</Typography>
            </Box>
          </Box> */}

    <Box>
      {paidtotal && (
        <Box display='flex' mr='15px' justifyContent='right'>
          <Typography variant="h5" color={'black'} fontWeight="bold" mr='40px'> PAYMENT MADE:</Typography> 
          <Typography variant="h5" color={'black'} fontWeight="bold">{paidtotal}</Typography>
        </Box>
      )}
    </Box>

    <Box>
      {remainder && (
        <Box display='flex' mr='15px' justifyContent='right'>
          <Typography variant="h5" color={'black'} fontWeight="bold" mr='40px'> REMAINDER:</Typography> 
          <Typography variant="h5" color={'black'} fontWeight="bold">{remainder}</Typography>
        </Box>
      )}
    </Box>
        
        <Box display='flex' justifyContent='left' mt='30px'>
          <Typography fontSize='26px' color={'black'} fontWeight="bold">
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

export default AccountLayout;
