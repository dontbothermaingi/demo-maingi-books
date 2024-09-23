import { Box,Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RepairMade(){
    const [repairs, setRepairs] = useState([]);
    const navigate = useNavigate()


    useEffect(()=>{
        fetch("https://db-demo-u07o.onrender.com/vehiclemantainances")
        .then((response) => response.json())
        .then((data) => {
          const combined = data.flatMap((vehicle) =>
            vehicle.items.map((item, index) => ({
              ...item,
              ...vehicle,
              id: `${vehicle.id}-${index}`, // Creating a unique id by combining vehicle id and item index
            }))
          );

          setRepairs(combined);
        });
    },[])

    const handleRepairReport = (repairId) => {
        navigate(`/repair/${repairId}`);
      };

const columns = [
        {
            field: "truck_number",
            headerName: "VEHICLE NUMBER",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.2,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "manufacturer",
            headerName: "MANUFACTURER",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.25,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "job_description",
            headerName: "JOB TYPE",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.15,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "spare_category_name",
            headerName: "SPARE CATEGORY",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.25,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
          field: "spare_subcategory_name",
          headerName: "SPARE NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "mechanic",
            headerName: "MECHANIC",
            flex: 0.15,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
          field: "quantity",
          headerName: "QUANTITY",
          flex: 0.15,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "job_name",
            headerName: "JOB DESCRIPTION",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.4,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
            <Box m="20px">
                    <Typography
                        textAlign='center'
                        fontSize='30px'
                        fontWeight='bold'
                        >
                            ALL REPAIRS / SERVICES
                    </Typography>          

                    <Box
                    m="40px 0 0 0"
                    width='auto'
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
                        rows={repairs}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                    />
                    </Box>
          </Box>
        </div>
     );
}
 
export default RepairMade;