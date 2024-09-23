import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateFuelPump(){
    const [pumps, setPumps] = useState([]);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        pump_name: "",
        litres: "",
        pump_location:"",
        fuel_type: "",
        initial_reading: "",
        reading:"",
        date: "",
    });

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

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch('https://db-demo-u07o.onrender.com/pumpnames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                reading: formData.initial_reading,
                litres: 0,
            })
        })
        .then(response => response.json())
        .then((data) => {

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

            
            console.log(data);
            setFormData({
                pump_name: "",
                pump_location:"",
                litres: "",
                initial_reading: "",
                fuel_type:"",
                reading:"",
                date: "",
            });
        })
        .catch(error => {
            console.error("Error submitting form:", error);
        });
    }

    const handleCustomBill = () => {
        navigate(`/fuel-control`);
      };

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
            <button
                        type="button"
                        className="button"
                        onClick={()=> handleCustomBill()}
                    >
                        BACK
            </button>
            <div className="bill-content">
                <h2 className="h2">CREATE NEW PUMP</h2>
                <form className="bill-form" onSubmit={handleSubmit}>
                    <div className="bill-input">
                        <label>PUMP NAME</label>
                        <input
                            type="text"
                            name="pump_name"
                            placeholder="Pump Name"
                            className="bill-inputfield"
                            value={formData.pump_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="bill-input">
                        <label>INITIAL READING</label>
                        <input
                            type="number"
                            name="initial_reading"
                            placeholder="Pump Reading"
                            className="bill-inputfield"
                            value={formData.initial_reading}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="bill-input">
                        <label>FUEL TYPE</label>
                        <select
                          type="number"
                          name="fuel_type"
                          placeholder="Fuel Type"
                          className="bill-inputfield"
                          value={formData.fuel_type}
                          onChange={handleChange}
                        >
                            <option value="">Select Fuel</option>
                            <option value="PETROL">PETROL</option>
                            <option value="DIESEL">DIESEL</option>

                        </select>
                    </div>

                    <div className="bill-input">
                        <label>PUMP LOCATION</label>
                        <input
                            type="text"
                            name="pump_location"
                            placeholder="Pump Location"
                            className="bill-inputfield"
                            value={formData.pump_location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="bill-input">
                        <label>DATE</label>
                        <input
                            type="date"
                            name="date"
                            placeholder="Date"
                            className="bill-inputfield"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <button type="submit" className="button">Submit</button>
                </form>
            </div>
            
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

export default CreateFuelPump;
