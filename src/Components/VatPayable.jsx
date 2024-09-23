import { Box, Button, TextField,Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatBox from "./StatBox";
import PointOfSale from "@mui/icons-material/PointOfSale";
import ReactToPrint from "react-to-print";

function VatPayable (){

    const [vat, setVat] = useState([]);
    const componentRef = useRef();
    const [calculation, setCalculation] = useState([])
    const [startDate,setStartDate] = useState(null)
    const [endDate,setEndDate] = useState(null)
    const navigate = useNavigate()

    function filterByDateRange(items,startDate,endDate){
        if (!startDate || !endDate) return items

        return items.filter((item)=>{
            const itemDate = new Date(item.invoice_date)
            return itemDate >= startDate && itemDate <= endDate;
        })
    }

    useEffect(() => {
      fetch('https://db-demo-u07o.onrender.com/invoices')
          .then(response => response.json())
          .then((data) => {
              // Assuming filterByDateRange is a function that filters data by date
              const filterDate = filterByDateRange(data,startDate,endDate);
              
              // Flatten the structure so each item has its corresponding invoice data
              const all = filterDate.flatMap(invoice =>
                  invoice.items.map(item => ({
                      ...invoice,
                      ...item,
                      rate_vat: new Intl.NumberFormat().format(item.rate_vat.toFixed(2)),
                      amount: new Intl.NumberFormat().format(item.amount.toFixed(2)),
                      sub_total: new Intl.NumberFormat().format(item.sub_total.toFixed(2))
                  }))
              );

              const calculate = filterDate.flatMap(invoice =>
                invoice.items.map(item => ({
                    ...invoice,
                    ...item,
                }))
            );
              
              // Set the filtered and flattened data to state
              setVat(all);
              setCalculation(calculate);
          })
          .catch(error => console.error('Error fetching invoices:', error));
  }, [startDate, endDate]);
  

    function handleViewDetails(invoiceId){
        navigate(`/invoices/${invoiceId}`)
    }

    const calculateVat = calculation.reduce((total,item) => total + item.rate_vat,0)

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
        { field: "item_details", headerName: "ITEM", flex: 0.35, renderCell: (params) => (
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

          <Box display='flex' justifyContent='space-between'>
            <Box>
              <Typography fontWeight='bold' fontSize='25px'>FILTER BY DATE</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>

            <Box>
              <Box display="flex" justifyContent="center" mt="20px">
                  <ReactToPrint
                    trigger={() => (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "#a4a9fc",
                          color: "#141414",
                          '&:hover': {
                            backgroundColor: "#6870fa",
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
          </Box>

          <Box ref={componentRef}>

                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(12, 1fr)"
                            gridAutoRows="140px"
                            gap="10px"
                            mb="20px"
                            mt="20px"
                            width='1630px'
                            // ml="10px"
                        >
                            <Box
                                gridColumn="span 3"
                                backgroundColor={ "#f2f0f0"}
                                borderRadius="10px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <StatBox
                                    title={`$${new Intl.NumberFormat().format(calculateVat)}`}
                                    subtitle="VAT PAYABLE"
                                    icon={
                                        <PointOfSale
                                            sx={{ color: "#4cceac", fontSize: "26px" }}
                                        />
                                    }
                                />
                            </Box>
                        </Box>

                        <Box m="20px" >
                            <Typography
                            fontWeight='bold'
                            variant="h5"
                            textAlign='center'
                            >
                                INVOICES
                            </Typography>
                            <Box
                                height="75vh"
                                sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                },
                                "& .name-column--cell": {
                                    // color: colors.greenAccent[300],
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    // backgroundColor: colors.blueAccent[700],
                                    borderBottom: "none",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    // backgroundColor: colors.primary[400],
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    borderTop: "none",
                                    // backgroundColor: colors.blueAccent[700],
                                },
                                "& .MuiCheckbox-root": {
                                    // color: `${colors.greenAccent[200]} !important`,
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    // color: `${colors.grey[100]} !important`,
                                },
                                }}
                            >
                                <DataGrid
                                rows={vat}
                                columns={invoices}
                                components={{ Toolbar: GridToolbar }}
                                />
                            </Box>
                         </Box>
          </Box>
                         
        </Box>
     );
}
 
export default VatPayable;