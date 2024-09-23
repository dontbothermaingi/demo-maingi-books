import { useEffect, useState } from "react";
import { Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import RetreadTyreShop from './Retreadtyreshop'
import './UsedTyre.css';
import { useNavigate } from "react-router-dom";

function AllUsedTyre() {
    const [items, setItems] = useState([]);
    const [view, setView] = useState('USED_TYRE');
    
    useEffect(() => {
        // Fetch used tyres
        fetch('https://db-demo-u07o.onrender.com/usedtyres')
            .then(response => response.json())
            .then(data => {
                const formatted = data.map(item => ({
                    ...item,
                    tyre_mileage: new Intl.NumberFormat().format(item.tyre_mileage),
                  }));
                setItems(formatted);
            });
    }, []);

    const handleViewChange = (view) => {
        setView(view);
    };

    const handleViewDetails = (tyreId) => {
        navigate(`/tyre-report/${tyreId}`)
    }

    const navigate = useNavigate()


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
            field: "truck_number",
            headerName: "TRUCK NUMBER",
            flex: 0.25,
        },
        {
            field: "serial_number",
            headerName: "SERIAL NUMBER",
            flex: 0.25,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleViewDetails(params.row.serial_number)}
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
            field: "tyre_mileage",
            headerName: "MILEAGE",
            flex: 0.2,
        },
        {
            field: "retread_counter",
            headerName: "RETREAD COUNTER",
            flex: 0.23,
        },
        {
            field: "position",
            headerName: "POSITION",
            flex: 0.2,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.25,
        },
        {
            field: "date",
            headerName: "FITMENT DATE",
            flex: 0.2,
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.25,
            align: "left",
        },
    ];

    return (
        <div>
            <button
                type="button"
                onClick={() => handleViewChange('USED_TYRE')}
                className="button"
            >
                USED TYRES
            </button>
            <button
                type="button"
                onClick={() => handleViewChange('RETREAD_SHOP')}
                className="button"
            >
                RETREAD SHOP
            </button>

            {view === 'USED_TYRE' && 
                <Box m="20px">
                    <Typography
                        textAlign='center'
                        fontWeight='bolder'
                        fontSize='30px'
                    >
                        USED TYRES
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
                        "& .name-column--cell": {
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "black",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                        },
                        "& .MuiCheckbox-root": {
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        },
                        }}
                    >
                        <DataGrid
                            rows={items}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Box>
            }
            {view === 'RETREAD_SHOP' && <RetreadTyreShop />}
        </div>
    );
}

export default AllUsedTyre;
