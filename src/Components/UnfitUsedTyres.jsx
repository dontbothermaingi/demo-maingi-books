import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './Unfitretreadtyre.css'
import { useNavigate } from "react-router-dom";

function UnfitUsedTyres() {
    const [fittedTyres, setFittedTyres] = useState([]);
    const [items, setItems] = useState([]);
    const [serialNumberInput, setSerialNumberInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const token = localStorage.getItem('access_token')
    const [formData, setFormData] = useState({
        name: "",
        serial_number: "",
        starting_mileage: "",
        size: "",
        truck_number: "",
        reason: "",
        final_mileage: "",
        tyre_mileage: "",
        position: "",
        date: "",
        condition:"",
    });

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/fitusedtyres',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
            .then(response => response.json())
            .then(data => {
                const fittedTyre = data.filter((tyre) => tyre.status === 'FITTED');
                setFittedTyres(data);
                setItems(fittedTyre);
            });
    }, [token]);

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
        const fitted = fittedTyres.filter(
            tyre => tyre.status === 'FITTED' && tyre.serial_number.toLowerCase().includes(input.toLowerCase())
        );
        setSuggestions(fitted);
    }

    function handleSelectTyre(tyre) {
        setSerialNumberInput(tyre.serial_number);
        setSuggestions([]);
        setFormData(prevFormData => ({
            ...prevFormData,
            serial_number: tyre.serial_number,
            truck_number: tyre.truck_number,
            size: tyre.size,
            name: tyre.item_details,
            starting_mileage: tyre.starting_mileage,
            position: tyre.position,
        }));
    }

    function resetForm() {
        setFormData({
            name: "",
            serial_number: "",
            starting_mileage: "",
            size: "",
            truck_number: "",
            reason: "",
            final_mileage: "",
            tyre_mileage: "",
            position: "",
            date: "",
        });
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
            const newFormData = { ...formData, tyre_mileage: parseInt(tyreMileage) };
    
            fetch('https://db-demo-u07o.onrender.com/unfitusedtyres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials:'include',
                body: JSON.stringify(newFormData)
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
                event.target.reset();
                fetch('https://db-demo-u07o.onrender.com/fitusedtyres',{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    },
                    credentials:'include'
                })
                .then(response => response.json())
                .then(data => {
                    const fittedTyre = data.filter((tyre) => tyre.status === 'FITTED');
                    setItems(fittedTyre);
                });
                resetForm();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert("Please enter valid starting and final mileage values.");
        }
    }

    const navigate = useNavigate()

    const handleRetreadControl = () => {
        navigate('/used-tyres-control');
    };

    const columns = [
        { field: "item_details", headerName: "ITEM DETAILS", flex: 0.2, cellClassName: "name-column--cell" },
        { field: "size", headerName: "SIZE", headerAlign: "left", flex: 0.2, align: "left" },
        { field: "truck_number", headerName: "TRUCK NUMBER", flex: 0.3 },
        { field: "serial_number", headerName: "SERIAL NUMBER", flex: 0.3 },
        { field: "starting_mileage", headerName: "STARTING MILEAGE", flex: 0.3 },
        { field: "position", headerName: "POSITION", flex: 0.3 },
        { field: "date", headerName: "FITMENT DATE", flex: 0.2 },
    ];

    return (
        <div>
            <button
               type="button"
               className="button"
               onClick={()=> handleRetreadControl()}
            >
                BACK
            </button>

            <div className="bill-content">
                <h2 className="h2">UNFIT USED TYRE</h2>
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
                    
                    <div className="results-lists">
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
                        name="name"
                        placeholder="Name"
                        className="bill-inputfield"
                        value={formData.name}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        className="input"
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
                        <label>Condition</label>
                        <select
                            type="text"
                            className="bill-inputfield"
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            required
                        >

                            <option value="">Select Condition</option>
                            <option value="Good">Good</option>
                            <option value="Bad">Bad</option>
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
                            <label>Date</label>
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
                  fontSize='30px'
                  fontWeight='bold'
                >
                    FITTED USED TYRES
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
                        getRowId={(row) => `${row.truck_number}-${row.size}-${row.item_details}-${row.position}-${row.date}-${row.serial_number}-${row.starting_mileage}`}
                        />
                    </Box>
            </Box>

        </div>
    );
}

export default UnfitUsedTyres;
