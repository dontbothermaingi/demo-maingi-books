import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Header from "./Header";

const AvailableRetreadTyres = () => {
  const [tyres, setTyres] = useState([]);
  const token = localStorage.getItem('access_token')
  

  useEffect(() => {
    fetch('https://demo-server-757m.onrender.com/usedtyres',{
          method: 'GET',
          credentials: 'include',
          headers: {
              'Authorization': `Bearer ${token}`
          }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const formattedTyres = data.map((tyre) => ({
          ...tyre,
          starting_mileage: new Intl.NumberFormat().format(tyre.starting_mileage),
          final_mileage: new Intl.NumberFormat().format(tyre.final_mileage)
        }));
  
        const availableTyres = formattedTyres.filter((tyre) => tyre.retread_status === 'AVAILABLE');
        setTyres(availableTyres);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, [token]);


  const columns = [
    {
      field: "name",
      headerName: "ITEM DETAILS",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "size",
      headerName: "SIZE",
      headerAlign: "left",
      flex: 0.2,
      align: "left",
    },
    {
      field: "serial_number",
      headerName: "SERIAL NUMBER",
      flex: 0.3,
    },
    {
      field: "tyre_mileage",
      headerName: "TYRE MILEAGE",
      flex: 0.2,
    },
    {
        field: "status",
        headerName: "STATUS",
        flex: 0.3,
        display:"flex",
        justifyContent:"center",
        renderCell: ({ row }) => (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor='green'
            borderRadius="4px"
          >
            <Typography color='white' fontWeight='bold'>
              AVAILABLE
            </Typography>
          </Box>
        ),
      },
  ];

  return (
    <Box m="20px">
      <Header
        title="RETREAD TYRES"
        subtitle="List of all retread tyres"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        // width='900px'
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            // fontSize: "16px",  // Increase the font size of the data
          },
          "& .name-column--cell": {
            // color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            // backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            // fontSize: "16px",  // Increase the font size of the header
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
          rows={tyres}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => `${row.truck_number}-${row.size}-${row.item_details}-${row.position}-${row.date}-${row.serial_number}-${row.starting_mileage}`}
        />
      </Box>
    </Box>
  );
};

export default AvailableRetreadTyres;
