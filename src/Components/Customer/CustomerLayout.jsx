import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";
import StatBox from "../StatBox";
import { PointOfSale } from "@mui/icons-material";

const CustomerLayout = ({
  invoiceItems = [],
  Totalamount,
  amountOwed,
  amountPaid,
  invoiceTotal,
  receiptTotal,
  creditTotal,
  title,
  barchart,
}) => {
  const [formattedItems, setFormattedItems] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();

  const formatted = new Intl.NumberFormat().format(invoiceTotal);

  const navigate = useNavigate()

  useEffect(() => {
    const formatted = invoiceItems.map(item => ({
        ...item,
        rate: new Intl.NumberFormat().format(item.rate),
        amount: new Intl.NumberFormat().format(item.amount),
        rate_vat: new Intl.NumberFormat().format(item.rate_vat),
        sub_total: new Intl.NumberFormat().format(item.sub_total)
      }));
      setFormattedItems(formatted)
  },[invoiceItems])

  const handleViewDetails = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const invoices = [
    {
      field: "invoice_number",
      headerName: "Invoice Number",
      flex: 0.15,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.invoice_number)}
      >
        <Typography
          variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.invoice_number)}
      >
        <Typography
          variant="h7"
        >
          {params.value}
        </Typography>
      </Box>
      ),
    },
    { field: "invoice_date", headerName: "Invoice Date", flex: 0.15 , renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),},
    { field: "item_details", headerName: "ITEM", flex: 0.4, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "quantity", headerName: "QUANTITY", flex: 0.15, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "rate", headerName: "RATE", flex: 0.15, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),},
    { field: "sub_total", headerName: "SUB TOTAL", flex: 0.15, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "vat", headerName: "VAT", flex: 0.1, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "rate_vat", headerName: "VAT AMOUNT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "amount", headerName: "AMOUNT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewDetails(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
  ];

  return (
    <Box>
      <Box ref={componentRef} mb="60px" backgroundColor="white" m="30px" height="1200px" borderRadius="10px">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography fontSize="32px" color="black" ml="23px" mt="9px" fontWeight="bold">
              {title}
            </Typography>
          </Box>
        </Box>

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
          backgroundColor={colors.primary[400]}
          borderRadius='10px'
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title = {Totalamount}
            subtitle="TOTAL SALES"
            // progress="0.75"
            // increase="+14%"
            icon={
              <PointOfSale
                sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius='10px'
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title= {amountOwed}
            subtitle="AMOUNT OWED"
            // progress="0.75"
            // increase="+14%"
            icon={
              <PointOfSale
                sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius='10px'
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title= {amountPaid}
            subtitle="AMOUNT PAID"
            // progress="0.75"
            // increase="+14%"
            icon={
              <PointOfSale
                sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius='10px'
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title= {creditTotal}
            subtitle="RETURN INWARDS"
            // progress="0.75"
            // increase="+14%"
            icon={
              <PointOfSale
                sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Box>

{invoiceItems.length > 0 && (
      <Box>
        <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              INVOICES
        </Typography>
        {invoiceItems.length > 0 && (
                  barchart
        )}
          <Box>
            <Box
              m="40px 0 0 0"
              ml="20px"
              mr="20px"
              height="35vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                  color: "black",
                  fontSize: "15px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "white",
                  borderBottom: "none",
                  fontSize: "15px",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "white",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: "white",
                  color: "black",
                },
                "& .MuiCheckbox-root": {
                  color: "black",
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: "black",
                },
              }}
            >
              <DataGrid rows={formattedItems} columns={invoices} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
              Total: {formatted}
            </Typography>
          </Box>
        </Box>
        )}
        
      </Box>

      <Box display="flex" justifyContent="center" mt="1500px">
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

export default CustomerLayout;
