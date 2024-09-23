import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function AllInvoices(){

    const [invoices,setInvoices] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/invoices')
        .then(response => response.json())
        .then(data => {
            const invoiceTotal = data.map((invoice) => {
                const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                return { ...invoice, totalAmount };

            })
            setInvoices(invoiceTotal)
        })
    },[])

    const handleViewDetails = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`);
      };
    
    
      const columns = [
          { field: "id", headerName: "ID", flex: 0.2 },
          {
            field: "customer_name",
            headerName: "Customer Name",
            flex: 0.5,
            cellClassName: "name-column--cell",
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
            field: "invoice_number",
            headerName: "Invoice Number",
            flex: 0.3,
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
            field: "totalAmount",
            headerName: "Amount",
            flex: 0.3,
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
            field: "invoice_date",
            headerName: "Invoice Date",
            flex: 0.3,
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
            headerName: "STATUS",
            flex: 0.4,
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
            field: "sales_person",
            headerName: "Sales Person",
            flex: 0.5,
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
      ]


    return ( 
        <div>
            <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    SALES
                </Typography>
                <Box
                    m="40px 0 0 0"
                    height="75vh"
                    sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        // fontSize: "16px",
                    },
                    "& .name-column--cell": {
                        // color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        // fontSize: "16px",
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
                    rows={invoices}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
            </Box>
        </div>
     );
}
 
export default AllInvoices;