import { Box, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatBox from "./StatBox";
import PointOfSale from "@mui/icons-material/PointOfSale";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

function SalesReport (){

  const [sales, setSales] = useState([])
  const [all, setAll] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const navigate = useNavigate()

  const filterByDateRange = (items, startDate, endDate) => {
    if (!startDate || !endDate) return items; // No filter if dates are not set

    return items.filter(item => {
        const itemDate = new Date(item.bill_date); // Converts the string to a Date object
        return itemDate >= startDate && itemDate <= endDate;
    });
  };

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/newbills')
        .then(response => response.json())
        .then((data) => {
            const datefilter = filterByDateRange(data, startDate, endDate)
            const invoiceTotal = datefilter.map((invoice) => {
                const totalAmount = new Intl.NumberFormat().format(invoice.items.reduce((total, item) => total + item.amount, 0));
                return { ...invoice, totalAmount };

            })

            const all = data.flatMap(bill => 
                bill.items.map((item) => ({
                    ...bill,
                    ...item
                })))
            setSales(invoiceTotal);
            setAll(all)
        });
}, [startDate,endDate]);

  const total = all.reduce((total,item) => total + item.amount, 0)

  const filter = new Intl.NumberFormat().format(total.toFixed(2))

  const handleViewDetails = (billId) => {
    navigate(`/newbills/${billId}`);
  };

const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
      field: "bill_date",
      headerName: "Bill Date",
      flex: 0.2,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
      field: "payment_terms",
      headerName: "Payment Terms",
      flex: 0.2,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
            onClick={() => handleViewDetails(params.row.bill_number)}
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
        flex: 0.2,
        renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
        field: "due_date",
        headerName: "Due Date",
        flex: 0.2,
        renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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

          <Box mb='20px'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography
                    fontSize='23px'
                    fontWeight='Bold'
                >
                  FILTER BY DATE
                </Typography>
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
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        marginRight='20px'
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor="#f2f0f0"
          borderRadius='10px'
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title= {filter}
            subtitle="TOTAL EXPENSES"
            // progress="0.75"
            // increase="+14%"
            icon={
              <PointOfSale
                sx={{ color: "#70d8bd", fontSize: "26px" }}
              />
            }
          />
        </Box>
        
        </Box>

          <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    EXPENSES
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
                    rows={sales}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
            </Box>

    </div>
   );
}
 
export default SalesReport;