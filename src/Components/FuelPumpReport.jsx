import { Box,Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FuelPumpReport(){
    const { pumpId } = useParams();
    const navigate = useNavigate()
    const [updates, setUpdates] = useState([])
    const [fuelings, setFuelings] = useState([])
    const [pumps,setPumps]=useState([])

    useEffect(() => {
        fetch(`https://db-demo-u07o.onrender.com/pumpnames/${pumpId}`)
        .then(response => response.json())
        .then((data) => {
            const filteredFuelings = data.fuelings.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))
            const filteredUpdates = data.updates.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))
            setFuelings(filteredFuelings)
            setUpdates(filteredUpdates);
            setPumps(data)
        })
        .catch(error => {
            console.error("Error fetching pumps:", error);
        });
    }, [pumpId]);

    const handleCustomBill = () => {
        navigate(`/fuel-control`);
      };

    const fuelupdates = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "Pump Name",
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
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];

    const feultransactions = [
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

            <button
                        type="button"
                        className="button"
                        onClick={()=> handleCustomBill()}
                    >
                        BACK
            </button>
            <Typography variant="h4" textAlign="center" mb={2} sx={{textDecoration:'underline'}}>
                    <h2 className="OWE">{pumps.pump_name}</h2>
            </Typography>
            <Typography textAlign="center" mb={2} >
                    <h2 className="OWE">The Pump Has { new Intl.NumberFormat().format(pumps.litres)} Litres of Fuel</h2>
            </Typography>

            <h2 className="OWE">The Initial Reading of this Pump was {new Intl.NumberFormat().format(pumps.initial_reading)} </h2>

                <Box m="20px" mt='50px'>
                  <Typography fontWeight="bold" variant="h5" textAlign="center">
                        FUEL TRANSACTIONS
                  </Typography>
                  <Box
                    // m="40px 0 0 0"
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
                      columns={feultransactions}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Box>
                </Box> 

                <Box m="20px">
                  <Typography fontWeight="bold" variant="h5" textAlign="center">
                        PUMP UPDATES
                  </Typography>
                  <Box
                    // m="40px 0 0 0"
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
                      rows={updates}
                      columns={fuelupdates}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Box>
                </Box> 

        </div>
     );
}
 
export default FuelPumpReport;
