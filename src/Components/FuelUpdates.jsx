import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FuelUpdates(){
    const [pumps,setPumps] = useState([]);
    const navigate = useNavigate()
    const [fuelings,setFuelings] = useState([]);
    const [updates,setUpdates] = useState([]);
    const [formData,setFormData] = useState({
        pump_name: "",
        litres: "",
        reading: "",
        date: "",
    })

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/pumpnames')
        .then(response => response.json())
        .then((data) => {
            setPumps(data)
        })
    },[])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/pumpfuelings')
        .then(response => response.json())
        .then((data) => {
            setFuelings(data)
        })
    },[])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/pumpupdates')
        .then(response => response.json())
        .then((data) => {
            const filteredUpdates = data.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))
            setUpdates(filteredUpdates)
        })
    },[])

    function handleSelectPump(event) {
        const selectedValue = event.target.value;

        if (selectedValue === "new_vehicle") {
            navigate("/trucks");
            return;
        }

        const selectedPump = pumps.find(pump => pump.pump_name === selectedValue);

        if (selectedPump) {
            setFormData(prevFormData => ({
                ...prevFormData,
                pump_name: selectedPump.pump_name,
                initial_reading: selectedPump.initial_reading,
            }));
        }
    }

    function handleChange(event){
        const{name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    const selectedPump = pumps.find(pump => pump.pump_name === formData.pump_name);


    function handleSubmit(event){
        event.preventDefault()

        // Find the selected pump from the state
        const selectedPump = pumps.find(pump => pump.pump_name === formData.pump_name);
        if (!selectedPump) {
            console.error("Pump not selected");
            return;
        }
    
        // Get the fuelings related to the selected pump
        const pumpFuelings = fuelings.filter(fueling => fueling.pump_name === formData.pump_name);
    
        let calculatedReading;
        if (pumpFuelings.length === 0) {
            // No previous fuelings, use initial reading of the pump
            calculatedReading = selectedPump.initial_reading;
        } else {
            // Get the last reading from the fuelings
            const lastFueling = pumpFuelings[pumpFuelings.length - 1];
            calculatedReading = lastFueling.reading;
        }

        fetch('https://db-demo-u07o.onrender.com/pumpupdates', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                ...formData,
                reading: calculatedReading
            })
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            setFormData({
                pump_name:"",
                litres: "",
                reading: "",
                date: "",
            })
        })
    }

    const handleCustomBill = () => {
        navigate(`/fuel-control`);
      };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "Pump Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "litres",
            headerName: "Litres",
            flex: 1,
        },
        {
            field: "reading",
            headerName: "Reading",
            flex: 1,
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
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
                <h2 className="h2">UPDATE PUMP</h2>
                <form className="bill-form" onSubmit={handleSubmit}>

                        <div className="bill-input">
                                <label>PUMP NAME</label>
                                <select 
                                    type="text"
                                    name="pump_name"
                                    value={formData.pump_name}
                                    placeholder="Pump Name"
                                    className="bill-inputfield"
                                    onChange={handleSelectPump}
                                >
                                <option value="">Select Pump</option>
                                {pumps.map((pump, index) => (
                                        <option key={index} value={pump.pump_name}>{pump.pump_name}</option>
                                    ))}
                                </select>
                        </div>

                        {formData.pump_name ? <h2 className="OWE">THIS PUMP HAS {new Intl.NumberFormat().format(selectedPump.litres)} LITRES OF FUEL.</h2> : ""}


                        <div className="bill-input">
                                <label>LITRES</label>
                                <input
                                    type="text"
                                    name="litres"
                                    placeholder="Litres"
                                    className="bill-inputfield"
                                    value={formData.litres}
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
            <Box m="20px">
                  <Typography fontWeight="bold" variant="h5" textAlign="center">
                        PUMPS
                  </Typography>
                  <Box
                    m="40px 0 0 0"
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
                      rows={updates}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Box>
                </Box> 
        </div>
     );
}
 
export default FuelUpdates;