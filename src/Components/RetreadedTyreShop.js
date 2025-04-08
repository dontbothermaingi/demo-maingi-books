import { useEffect, useState } from "react";
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Retreadtyreshop.css';

function RetreadedTyreShop() {
    const [tyres, setTyres] = useState([]);

    useEffect(() => {
        fetch('https://demo-server-757m.onrender.com/shopretreads')
            .then(response => response.json())
            .then((data) => {
                const filter = data.filter(item => item.position === 'SHOP');
                const most = filter.map((item)=>({
                    ...item,
                    tyre_mileage: new Intl.NumberFormat().format(item.tyre_mileage)
                }))
                setTyres(most);
            });
    }, []);


    // Function to handle item deletion
    const handleDeleteItem = (id) => {
        // Filter out the item with the given ID
        setTyres((prevTyres) => prevTyres.filter((tyre) => tyre.id !== id));
        
        // You may want to also make a DELETE request to your backend API here to persist the deletion.
        // Example:
        fetch(`https://demo-server-757m.onrender.com/shopretreads/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => {
                // Optionally update state or show a notification
            })
            .catch((error) => console.error('Error deleting item:', error));
    };

    const columns = [
        {
            field: "item_details",
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
            flex: 0.25,
        },
        {
            field: "position",
            headerName: "STATUS",
            flex: 0.15,
        },
        {
            field: "tyre_mileage",
            headerName: "TYRE MILEAGE",
            flex: 0.15,
        },
        {
            field: "date",
            headerName: "DATE",
            flex: 0.2,
        },
        {
            field: "action",
            headerName: "ACTION",
            flex: 0.2,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    sx={{backgroundColor:"red"}}
                    color="primary"
                    onClick={() => handleDeleteItem(params.row.id)}
                >
                    FAILED RETREAD
                </Button>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Typography
                textAlign='center'
                fontWeight='bolder'
                fontSize='30px'
            >
                RETREADED SHOP
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
                    },
                    "& .name-column--cell": {},
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "black",
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
                    rows={tyres}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    );
}

export default RetreadedTyreShop;
