import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PieChart from "./PieChart";

function CheckSpares() {
    const [items, setItems] = useState([]);
    const [type, setType] = useState([])

    useEffect(() => {
        fetch("https://db-demo-u07o.onrender.com/stores")
            .then(response => response.json())
            .then(data => {
                // Sort items based on date in descending order
                const sortedItems = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setItems(sortedItems);
            });
    }, []); // Empty dependency array to run the effect only once on component mount

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/stores')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log(data); 

            const receiptsItem = data.map(invoice => invoice)
          .reduce((acc, item) => {
            if (acc[item.item_details]) {
              acc[item.item_details] += item.quantity;
            } else {
              acc[item.item_details] = item.quantity;
            }
            return acc;
          }, {});

        // Convert the accumulated data into the desired format
        const formattedReceipts = Object.entries(receiptsItem).map(([item_details, quantity]) => ({
          id: item_details,
          value: quantity
        }));

            setType(formattedReceipts);
          })
          .catch(error => console.error('Error fetching data:', error));
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
        {
            field: "truck_number",
            headerName: "TRUCK NUMBER",
            flex: 0.3,
        },
        {
            field: "mechanic",
            headerName: "MECHANIC",
            flex: 0.3,
        },
        {
            field: "date",
            headerName: "FITMENT DATE",
            flex: 0.3,
        },
      ];

    return (
        <Box m="20px">
                <Typography
                  textAlign='center'
                  fontSize='30px'
                  fontWeight='bold'
                >
                   FREQUENTLY FITTED SPARES
                </Typography>

                <PieChart chartdata={type} />

                <Typography
                  textAlign='center'
                  fontSize='30px'
                  fontWeight='bold'
                >
                    FITTED SPARES
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
                        rows={items}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => `${row.item_details}-${row.quantity}-${row.truck_number}-${row.date}`}
                        />
                    </Box>
            </Box>
    );
}

export default CheckSpares;
