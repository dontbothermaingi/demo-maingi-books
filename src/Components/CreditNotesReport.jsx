import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function CreditNotesReport(){

    const [creditnotes,setCreditNote] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/creditnotes')
        .then(response=>response.json())
        .then(data => {
            const invoiceTotal = data.map((invoice) => {
                const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                return { ...invoice, totalAmount };

            })
            setCreditNote(invoiceTotal)
        })
    },[])

    const handleViewDetails = (creditId) => {
        navigate(`/creditnotes/${creditId}`);
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "customer_name",
          headerName: "Customer Name",
          flex: 0.3,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "customer_email",
            headerName: "Customer Email",
            flex: 0.3,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "customer_phone",
            headerName: "Customer Phone",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
            field: "vendor_pin",
            headerName: "Customer Pin",
            flex: 0.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
              <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
              }}
              onClick={() => handleViewDetails(params.row.credit_number)}
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
          field: "credit_number",
          headerName: "Credit Note Number",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
          field: "credit_date",
          headerName: "Credit Note Date",
          flex: 0.2,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.credit_number)}
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
            headerName: "Total Amount",
            flex: 0.5,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.credit_number)}
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
                            fontWeight='bold'
                            variant="h5"
                            textAlign='center'
                            >
                                CREDIT NOTES
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
                                rows={creditnotes}
                                columns={columns}
                                components={{ Toolbar: GridToolbar }}
                                />
                            </Box>
                         </Box>
        </div>
     );
}
 
export default CreditNotesReport;