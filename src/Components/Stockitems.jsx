import { Box} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Header from "./Header";
import PieChart from "./PieChart";


const Items = () => {
  const [items, setItems] = useState([]);
  const [diesel, setDiesel] = useState({ litres: 0, reading: 0 });

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/stockitems')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Check the data
        const formattedData = data.map(item => ({
          id: item.item_details,
          value: item.quantity
        }));
        setItems(formattedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/stockitems')
      .then(response => response.json())
      .then((data) => {
          setDiesel(data); // Assuming you want the first item from the data array
      });
  }, []);

  const columns = [
    {
      field: "item_details",
      headerName: "ITEM DETAILS",
      headerAlign: "left",
      cellClassName: "name-column--cell",
      flex: 0.2,
      align: "left",
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      flex: 0.3,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="STOCK ITEMS"
        subtitle="List of all stock items"
        // righttitle={`Litres: ${new Intl.NumberFormat().format(diesel.litres)}`}
        // rightsubtitle={`Reading: ${new Intl.NumberFormat().format(diesel.initial_reading)}`}
      />
      <PieChart chartdata={items}/>
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
          rows={diesel}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => `${row.item_details}-${row.quantity}`}
        />
      </Box>
    </Box>
  );
};

export default Items;
