import { Box} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Header from "./Header";

const Spares = () => {
  const [subSpares,setSubSpares] = useState([])

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/sparesubcategories')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Check the data
        setSubSpares(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/sparesubcategories')
      .then(response =>  response.json())
      .then(data => {
        console.log(data);
        setSubSpares(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const columns = [
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
      flex: 0.3,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.3,
    },
    {
      field: "measurement",
      headerName: "Unit of Measurements",
      flex: 0.3,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="SPARES"
        subtitle="List of all spares"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
          rows={subSpares}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => `${row.item_details}-${row.quantity}`}
        />
      </Box>
    </Box>
  );
};

export default Spares;
