import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './Unfitnewtyres.css'
import { useNavigate } from "react-router-dom";

function OldTyres() {
    const [fittedTyres, setFittedTyres] = useState([]);
    const [serialNumberInput, setSerialNumberInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [formData, setFormData] = useState({
        item_details: "",
        serial_number: "",
        starting_mileage: "",
        size: "",
        truck_number: "",
        retread_counter: 0,
        reason: "",
        final_mileage: "",
        position: "",
        tyre_mileage:"",
        date: "",
    });

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/removetyres')
            .then(response => response.json())
            .then(data => {
                const fitted = data.filter((tyre) => tyre.status === 'FITTED' )
                setFittedTyres(fitted);
            });
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSerialNumberInput(event) {
        const input = event.target.value;
        setSerialNumberInput(input);
        const filteredTyres = fittedTyres.filter(tyre => tyre.serial_number.toLowerCase().includes(input.toLowerCase()));
        setSuggestions(filteredTyres);
    }

    function handleSelectTyre(tyre) {
        setSerialNumberInput(tyre.serial_number);
        setSuggestions([]);
        setFormData(prevFormData => ({
            ...prevFormData,
            serial_number: tyre.serial_number,
            truck_number: tyre.truck_number,
            size: tyre.size,
            item_details: tyre.item_details,
            starting_mileage: tyre.starting_mileage,
            position: tyre.position,
        }));
    }

    function handleOldSubmit(event) {
        event.preventDefault();

        const { starting_mileage, final_mileage } = formData;
        const starting = parseFloat(starting_mileage);
        const final = parseFloat(final_mileage);
        if (!isNaN(starting) && !isNaN(final)) {
            let tyreMileage = final - starting;
            if (tyreMileage < 0) {
                tyreMileage = Math.abs(tyreMileage);
            }
            const newFormData = { ...formData, tyre_mileage: tyreMileage };

            fetch('https://db-demo-u07o.onrender.com/usedtyres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newFormData,
                    retread_counter: 0,
                })
            })
                .then(response => {
                    if (response.ok) {
                        alert("Inventory updated successfully.");
                        return response.json();
                    }
                    throw new Error('Failed to add inventory');
                })
                .then(data => {

                    // Second PATCH request to update the status of the tyre in removetyres
                    console.log('Updating tyre status for serial number:', formData.serial_number);
                    
                    fetch(`https://db-demo-u07o.onrender.com/removetyres/${formData.serial_number}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            status: "UNFITTED"
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            alert("Inventory updated successfully.");
                            return response.json();
                        } else {
                            throw new Error('Failed to update tyre status');
                        }
                    })
                    .then(data => {

                        fetch('https://db-demo-u07o.onrender.com/removetyres')
                        .then(response => response.json())
                        .then(data => {
                            const fitted = data.filter((tyre) => tyre.status === 'FITTED' )
                            setFittedTyres(fitted);
                        });

                        console.log(data); // Handle successful update if needed
                        event.target.reset();
                        setFormData({
                            item_details: "",
                            serial_number: "",
                            starting_mileage: "",
                            size: "",
                            reason: "",
                            truck_id: "",
                            final_mileage: "",
                            tyre_mileage: "",
                            position: "",
                            date: "",
                        });
                    })
                    .catch(error => {
                        console.error('Error updating tyre status:', error);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            alert("Please enter valid starting and final mileage values.");
        }
    }

    // Navigate to tyre control page
    const handleTyreContol = () => {
        navigate('/tyre-control');
    };

    const navigate = useNavigate()

    const columns = [
        // { field: "id", headerName: "ID", flex: 0.5 },
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
          flex: 0.3,
        },
        {
            field: "serial_number",
            headerName: "SERIAL NUMBER",
            flex: 0.3,
        },
        {
            field: "starting_mileage",
            headerName: "STARTING MILEAGE",
            flex: 0.3,
        },
        {
            field: "position",
            headerName: "POSITION",
            flex: 0.3,
        },
        // {
        //     field: "reason",
        //     headerName: "REASON",
        //     flex: 0.3,
        // },
        // {
        //     field: "final_mileage",
        //     headerName: "FINAL MILEAGE",
        //     flex: 0.2,
        // },
        {
            field: "status",
            headerName: "Status",
            flex: 0.2,
        },
        {
            field: "date",
            headerName: "FITMENT DATE",
            flex: 0.2,
        },
        
      ];

    return (
        <div>
            <div className="bill-content">
                <button type="button" className="button" onClick={handleTyreContol}>
                    BACK
                </button>
                <h2 className="h2">REMOVE TYRE FROM TRUCK</h2>
                <form className="bill-form" onSubmit={handleOldSubmit}>

                    <div className="bill-input">
                        <label>Serial Number</label>
                        <input
                            type="text"
                            name="serial_number"
                            placeholder="Serial Number"
                            className="bill-inputfield"
                            value={serialNumberInput}
                            onChange={handleSerialNumberInput}
                            required
                        />
                    </div>


                    <div className="bill-input">
                        {suggestions.map((tyre, index) => (
                            <div className="results" key={index}>
                                <li onClick={() => handleSelectTyre(tyre)}>
                                    {tyre.serial_number}
                                </li>
                            </div>
                        ))}
                    </div>

                    <div className="bill-input">
                        <label>Tyre</label>
                    <input
                        type="text"
                        name="item_details"
                        placeholder="Name"
                        className="bill-inputfield"
                        value={formData.item_details}
                        readOnly
                    />
                    </div>

                    <div className="bill-input">
                        <label>Truck Number</label>
                    <input
                        type="text"
                        name="truck_number"
                        placeholder="Truck Number"
                        className="bill-inputfield"
                        value={formData.truck_number}
                        readOnly
                    />
                    </div>

                    <div className="bill-input">
                        <label>Tyre Size</label>
                    <input
                        type="text"
                        name="size"
                        placeholder="Tyre Size"
                        className="bill-inputfield"
                        value={formData.size}
                        readOnly
                    />
                    </div>

                    <div className="bill-input">
                        <label>Starting Mileage</label>
                    <input
                        className="bill-inputfield"
                        type="number"
                        placeholder="Starting Mileage"
                        name="starting_mileage"
                        value={formData.starting_mileage}
                        onChange={handleChange}
                        readOnly
                    />
                    </div>

                    <div className="bill-input">
                        <label>Reason</label>
                    <select
                        type="text"
                        className="bill-inputfield"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                    >

                        <option value="">Select Reason</option>
                        <option value="Tire Wear and Tread Depth">Tire Wear and Tread Depth</option>
                        <option value="Damage or Punctures">Damage or Punctures</option>
                        <option value="Burst">Burst</option>
                    </select>
                    </div>

                    <div className="bill-input">
                        <label>Final Mileage</label>
                    <input
                        type="number"
                        name="final_mileage"
                        placeholder="Final Mileage"
                        className="bill-inputfield"
                        value={formData.final_mileage}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="bill-input">
                        <label>Unfitment Date</label>
                    <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        className="bill-inputfield"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    </div>


                    <button type="submit" className="button">Remove</button>
                </form>
            </div>

            <Box m="20px">
                <Typography
                     textAlign='center'
                     fontWeight='bolder'
                     fontSize='30px'
                >
                    FITTED NEW TYRES
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
                        // backgroundColor: "#a4a9fc",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "black",
                        
                        // borderBottom: "none",
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
                    rows={fittedTyres}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => `${row.truck_number}-${row.size}-${row.item_details}-${row.position}-${row.date}-${row.serial_number}-${row.starting_mileage}`}
                    />
                </Box>
            </Box>

        </div>
    );
}

export default OldTyres;
