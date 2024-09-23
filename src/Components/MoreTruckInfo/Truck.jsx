import { Typography, Box, useTheme, Button, Divider } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRef } from "react";
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";

function TruckReport ({
  expenseTotal,
  newtyresitems,
  sparesTotal,
  retreadTotal,
  invoiceTotal,
  invoiceItems,
  retreadItems,
  spareitems,
  dieselitems,
  dieselTotal,
  billItems,
  title,
  billTotal,
  barchart,
  barchartretread,
  barchartreceipts,
  barchartbills,
  vehicleType,
  manufacturer,
}) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();

  const formattedSpares = new Intl.NumberFormat().format(sparesTotal);
  const formattedExpense = new Intl.NumberFormat().format(expenseTotal);
  const formattedRetread = new Intl.NumberFormat().format(retreadTotal);
  const formattedDiesel = new Intl.NumberFormat().format(dieselTotal);
  const formattedBill = new Intl.NumberFormat().format(billTotal);
  const formatted = new Intl.NumberFormat().format(invoiceTotal);
  const total = dieselTotal + billTotal
  const formatedTotal = new Intl.NumberFormat().format(total)


  const allExpenses = sparesTotal + expenseTotal + retreadTotal + dieselTotal + billTotal
  const allSales = invoiceTotal


  const formattedAllExpenses = new Intl.NumberFormat().format(allExpenses);
  const formattedAllSales = new Intl.NumberFormat().format(allSales);


  const navigate = useNavigate()

  const handleViewInvoices = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`)
  }

  const handleViewDetails = (billId) => {
    navigate(`/newbills/${billId}`);
  };

  const invoices = [
    { field: "customer_name", headerName: "Customer Name", flex: 0.3,
    renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),
   },
    { field: "invoice_number", headerName: "Invoice Number", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "consignee", headerName: "Consignee", flex: 0.3, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "invoice_date", headerName: "Invoice Date", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "item_details", headerName: "ITEM", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "description", headerName: "DESCRIPTION", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "quantity", headerName: "TRIPS", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "rate", headerName: "RATE", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "vat", headerName: "VAT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
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
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
  ];

  const billcolumns = [
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
      field: "bill_number",
      headerName: "Bill Number",
      flex: 0.3,
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
      flex: 0.4,
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
      flex: 0.5,
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
        flex: 0.5,
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
        field: "amount",
        headerName: "Amount",
        flex: 0.5,
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
        flex: 0.5,
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
  
    const newtyres = [
        // { field: "id", headerName: "ID" },
        {
          field: "item_details",
          headerName: "Name",
          flex: 0.3,
          cellClassName: "name-column--cell",
        },
        {
          field: "serial_number",
          headerName: "Serial Number",
          flex: 0.3
        },
        {
          field: "size",
          headerName: "Size",
          flex: 0.2,
        },
        {
          field: "position",
          headerName: "Position",
          flex: 0.3,
        },
        {
          field: "status",
          headerName: "Status",
          flex: 0.2,
        },
        {
            field: "date",
            headerName: "Fitment Date",
            flex: 0.5,
          },
      ];

      const diesela = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "Pump Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "truck_number",
            headerName: "Truck Number",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "litres",
            headerName: "Litres",
            flex: 1,
        },
        {
            field: "reading",
            headerName: "Reading",
            flex: 1,
        },
        {
          field: "order",
          headerName: "Order",
          flex: 1,
      },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];
      
      const retreadtyres = [
        // { field: "id", headerName: "ID" },
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "serial_number",
          headerName: "Serial Number",
          flex: 1,
        },
        {
          field: "size",
          headerName: "Size",
          flex: 1,
        },
        {
          field: "position",
          headerName: "Position",
          flex: 1,
        },
        {
          field: "status",
          headerName: "Status",
          flex: 1,
        },
        {
            field: "date",
            headerName: "Fitment Date",
            flex: 1,
          },
      ];

      const spare = [
      //   {
      //     field: "truck_number",
      //     headerName: "VEHICLE NUMBER",
      //     headerAlign: "left",
      //     cellClassName: "name-column--cell",
      //     flex: 0.2,
      //     align: "left",
      // },
      // {
      //     field: "vehicle_type",
      //     headerName: "VEHICLE TYPE",
      //     headerAlign: "left",
      //     cellClassName: "name-column--cell",
      //     flex: 0.23,
      //     align: "left",
      // },
      {
          field: "manufacturer",
          headerName: "MANUFACTURER",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
          field: "job_description",
          headerName: "JOB DESCRIPTION",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
          field: "spare_category_name",
          headerName: "SPARE CATEGORY",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
        field: "spare_subcategory_name",
        headerName: "SPARE NAME",
        headerAlign: "left",
        cellClassName: "name-column--cell",
        flex: 0.2,
        align: "left",
      },
      {
          field: "mechanic",
          headerName: "MECHANIC",
          flex: 0.15,
      },
      {
        field: "quantity",
        headerName: "QUANTITY",
        flex: 0.15,
      },
      ];

    return ( 
        <Box>
      <Box ref={componentRef} mb="60px" backgroundColor="white" m="30px" height="2300px" borderRadius="10px">
        <Box display="flex" justifyContent="center" flexDirection='column' alignItems='center' mb='30px'>
        <Box>
            <Typography variant="h3" color="black" ml="23px" mt="9px" fontWeight="bold" style={{ textDecoration: 'underline' }} >
              {vehicleType}
            </Typography>
        </Box>

        <Box>
            <Typography variant="h3" color="black" ml="23px" mt="9px" fontWeight="bold" >
              {manufacturer}
            </Typography>
        </Box>

        <Box>
            <Typography variant="h4" color="black" ml="23px" mt="9px" fontWeight="bold">
              {title}
            </Typography>
        </Box>
        </Box>

        
        <Box>
        <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              FITTED NEW TYRES
        </Typography>
          {barchartbills}
          <Box>
            <Box
              ml="20px"
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
              <DataGrid rows={newtyresitems} columns={newtyres} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
              Total New Tyre Expense: {formattedExpense}
            </Typography>
          </Box>
        </Box>

      <Box>
    <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              FITTED RETREAD TYRES
      </Typography>
          {barchartretread}
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
              <DataGrid rows={retreadItems} columns={retreadtyres} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">
              Total Retread Tyres: {formattedRetread}
            </Typography>
          </Box>
      </Box>

      <Box>
    <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              REPAIRS
      </Typography>

          {barchartreceipts}

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
              <DataGrid rows={spareitems} columns={spare} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">
               Total Spare Expenses: {formattedSpares}
            </Typography>
          </Box>
      </Box>

      <Box>
    <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              FUEL TRANSACTIONS
      </Typography>

          {barchart}

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
              <DataGrid rows={dieselitems} columns={diesela} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">
              Total Diesel Expenses: {formattedDiesel}
            </Typography>
          </Box>
      </Box>

      <Box>
        <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              INVOICES
        </Typography>
                  {barchart}
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
              <DataGrid rows={invoiceItems} columns={invoices} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
              Total Sales: {formatted}
            </Typography>
          </Box>
        </Box>

        <Box>
        <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              FUEL BILLS
        </Typography>
                  {barchart}
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
              <DataGrid rows={billItems} columns={billcolumns} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
              Total Bill: {formattedBill}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" sx={{ p: 3 }}>
              {/* Main Title */}
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Financial Overview
              </Typography>

              {/* Container for Both Sides */}
              <Box display="flex" flexDirection="row" alignItems="flex-start" sx={{ width: '100%', maxWidth: 800 }}>
                
                {/* Left Side - Expenses */}
                <Box sx={{ flex: 1, p: 2 }}>
                  {/* Title for Expenses Section */}
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Expenses
                  </Typography>

                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Diesel</Typography>
                    <Typography variant="subtitle1">{formatedTotal}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">New Tyres</Typography>
                    <Typography variant="subtitle1">{formattedExpense}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Retread Tyres</Typography>
                    <Typography variant="subtitle1">{formattedRetread}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Spares</Typography>
                    <Typography variant="subtitle1">{formattedSpares}</Typography>
                  </Box>

                  {/* Total for Expenses */}
                  <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: '1px solid grey' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Total Expenses</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{formattedAllExpenses}</Typography>
                  </Box>
                </Box>

                {/* Vertical Divider */}
                <Divider orientation="vertical" flexItem sx={{ mx: 2, borderRightWidth: 2 }} />

              {/* Right Side - Sales */}
              <Box sx={{ flex: 1, p: 2 }}>
                {/* Title for Sales Section */}
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Sales
                </Typography>

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Sales</Typography>
                  <Typography variant="subtitle1">{formatted}</Typography>
                </Box>

                {/* Total for Sales */}
                <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: '1px solid grey' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Total Sales</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{formattedAllSales}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>



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
}
 
export default TruckReport;