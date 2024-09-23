import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PumpReport(){
    const [pumps, setPumps] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/pumpnames')
        .then(response => response.json())
        .then((data) => {
            const filtered = data.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))
            setPumps(filtered);
        })
        .catch(error => {
            console.error("Error fetching pumps:", error);
        });
    }, []);

    const handlePumpReport = (pumpId) => {
        navigate(`/pumps/${pumpId}`);
      };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "PUMP",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.pump_name)}
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
            field: "litres",
            headerName: "Litres",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.pump_name)}
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
            field: "fuel_type",
            headerName: "Fuel Type",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.pump_name)}
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
            field: "reading",
            headerName: "Pump Reading",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.pump_name)}
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
            field: "date",
            headerName: "Date",
            flex: 1,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handlePumpReport(params.row.pump_name)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
    ];

    return ( 
        <div>
            <Box m="20px" mt='30px'>
                <Typography fontWeight="bold" variant="h5" textAlign="center">
                    PUMPS
                </Typography>
                <Box
                    // m="40px 0 0 0"
                    margin='auto'
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
                        rows={pumps}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                    />
                </Box>
            </Box> 
        </div>
    );
}

export default PumpReport;
