import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

function FuelTransactions(){
    const [fuelings,setFuelings] = useState([]);

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/pumpfuelings')
        .then(response => response.json())
        .then((data) => {

            const filtered = data.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))
            setFuelings(filtered)
        })
    },[])

    const columns = [
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
    
    return ( 
        <div>
            <Box m="20px" mt='50px'>
                  <Typography fontWeight="bold" variant="h5" textAlign="center">
                        NUMBER OF FUEL TRANSACTIONS
                  </Typography>
                  <Box
                    margin='auto'
                    mt='20px'
                    height="75vh"
                    // width="1000px"
                    sx={{
                      "& .MuiDataGrid-root": {
                        border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                      },
                      "& .name-column--cell": {},
                      "& .MuiDataGrid-columnHeaders": {
                        borderBottom: "none",
                      },
                      "& .MuiDataGrid-virtualScroller": {},
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                      },
                      "& .MuiCheckbox-root": {},
                      "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
                    }}
                  >
                    <DataGrid
                      rows={fuelings}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Box>
                </Box> 
        </div>
     );
}
 
export default FuelTransactions;