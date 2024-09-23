import { useEffect, useState } from "react";
import { Box, Typography} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import './Invoice.css'
import InvoiceControl from "./InvoiceControl";

function Invoice() {
    const [invoices, setInvoices] = useState([]);
    const [isNewCustomer, setIsNewCustomer] = useState(null)


    const navigate = useNavigate();

    

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/invoices')
            .then(response => response.json())
            .then((data) => {
                const invoiceTotal = data.map((invoice) => {
                    const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                    return { ...invoice, totalAmount };

                })
                setInvoices(invoiceTotal);
            });
    }, []);


    function handleToggleInvoice() {
        setIsNewCustomer(!isNewCustomer);
    }

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
          field: "currency",
          headerName: "Currency",
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
        <Box>

                            <button
                                type="button"
                                className="button"
                                onClick={handleToggleInvoice}
                                >
                                {!isNewCustomer ? "New Invoice" : "All Invoices"}
                        </button>
        {isNewCustomer ?  
           <InvoiceControl/> :
                <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    INVOICES
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
            }

        </Box>
        
    );
}

export default Invoice;
