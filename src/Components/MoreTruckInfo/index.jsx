import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRef } from "react";
import ReactToPrint from 'react-to-print';

function TruckReport ({
    title,
}) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();

  


  const invoices = [
    { field: "id", headerName: "ID", flex: 0.1 },
    { field: "item_details", headerName: "ITEM", flex: 0.2 },
    { field: "description", headerName: "DESCRIPTION", flex: 0.2 },
    { field: "quantity", headerName: "QUANTITY", flex: 0.2 },
    { field: "rate", headerName: "RATE", flex: 0.2 },
    { field: "vat", headerName: "VAT", flex: 0.2 },
    { field: "amount", headerName: "AMOUNT", flex: 0.2 },
  ];
  
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
          field: "price",
          headerName: "Price",
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
          field: "truck_number",
          headerName: "Truck Number",
          flex: 0.5,
          cellClassName: "name-column--cell",
        },
        {
          field: "litres",
          headerName: "Litres",
        //   type: "number",
          flex: 0.5,
        },
        {
          field: "reading",
          headerName: "Reading",
          flex: 0.5,
        },
        {
          field: "price",
          headerName: "Price",
          flex: 0.5,
        },
        {
          field: "date",
          headerName: "Date",
          flex: 1,
        },
      ];

      const dieselb = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
          field: "truck_number",
          headerName: "Truck Number",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "litres",
          headerName: "Litres",
        //   type: "number",
          flex: 1,
        },
        {
          field: "reading",
          headerName: "Reading",
          flex: 1,
        },
        {
          field: "price",
          headerName: "Price",
          flex: 0.5,
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
          field: "price",
          headerName: "Price",
          flex: 1,
        },
        {
            field: "date",
            headerName: "Fitment Date",
            flex: 1,
          },
      ];

      const spare = [
        {
          field: "truck_number",
          headerName: "VEHICLE NUMBER",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
          field: "vehicle_type",
          headerName: "VEHICLE TYPE",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
          field: "manufacturer",
          headerName: "MANUFACTURER",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
          field: "description",
          headerName: "REPAIR DESCRIPTION",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.4,
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
      <Box ref={componentRef} mb="60px" backgroundColor="white" m="30px" height="2000px" borderRadius="10px">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography fontSize="32px" color="black" ml="23px" mt="9px" fontWeight="bold" fontFamily='Cambria, Cochin, Georgia, Times, Times New Roman, serif'>
              {title}
            </Typography>
          </Box>
        </Box>

        <Box display='flex' flexDirection='row' gap='20px'>
            <Box>
            <Typography color="black" fontWeight="bold">
                New Tyre:{expenseTotal}
            </Typography>
            <Typography  color="black" fontWeight="bold">
                Spares: {sparesTotal}
            </Typography>
            <Typography  color="black" fontWeight="bold">
                Retread Tyres: {retreadTotal}
            </Typography>
            <Typography  color="black" fontWeight="bold">
                Diesel:{dieselTotal}
            </Typography>
            <Typography  color="black" fontWeight="bold">
                Diesel: {pumpTotal}
            </Typography>
            </Box>

            <Box>
            <Typography  color="black" fontWeight="bold">
                Sales: {invoiceTotal}
            </Typography>
            </Box>
        </Box>

      <Box>
    <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
              FITTED RETREAD TYRES
      </Typography>

          {barchartexpenses}

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
              PUMP A 
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
              PUMP B
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
              <DataGrid rows={pumpitems} columns={dieselb} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
            </Box>
            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">
              Total Diesel Pump: {formattedPump}
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
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                Expenses
            </Typography>
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                New Tyre Expense:{expenseTotal}
            </Typography><Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                Spares Expense: {sparesTotal}
            </Typography><Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                Retread Tyre Expense: {retreadTotal}
            </Typography>
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                Diesel Expense:{dieselTotal}
            </Typography>
            <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                Diesel Expense: {pumpTotal}
            </Typography>
            
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