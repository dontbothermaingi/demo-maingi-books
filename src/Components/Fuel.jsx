import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Fuel(){
    const [pumps,setPumps] = useState([]);
    const navigate = useNavigate()
    const [fuelings,setFuelings] = useState([]);
    const [trucks,setTrucks] = useState([]);
    const [formData,setFormData] = useState({
        pump_name: "",
        pump_location:"",
        truck_number: "",
        litres: "",
        reading: "",
        price:"",
        order:"",
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

            const filtered = data.map(pump=> ({
                ...pump,
                reading: new Intl.NumberFormat().format(pump.reading),
                litres: new Intl.NumberFormat().format(pump.litres),
            }))
            setFuelings(filtered)
        })
    },[])

    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/trucks')
        .then(response => response.json())
        .then((data) => {
            setTrucks(data)
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
                pump_location: selectedPump.pump_location,
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

    const selectedPump = pumps.find(pump => pump.pump_name === formData.pump_name)

    function handleSubmit(event){
        event.preventDefault();
    
        // Find the selected pump from the state
        const selectedPump = pumps.find(pump => pump.pump_name === formData.pump_name);
        if (!selectedPump) {
            console.error("Pump not selected");
            return;
        }
    
        const calculatedReading = selectedPump.reading + parseFloat(formData.litres);

        // Prepare formData with calculated reading
        const updatedFormData = {
            ...formData,
            reading: calculatedReading,
            price: (formData.price * formData.litres)
        };
    
        fetch('https://db-demo-u07o.onrender.com/pumpfuelings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFormData)
        })
        .then(response => response.json())
        .then((data) => {

            fetch('https://db-demo-u07o.onrender.com/pumpfuelings')
            .then(response => response.json())
            .then((data) => {

                const filtered = data.map(pump=> ({
                    ...pump,
                    reading: new Intl.NumberFormat().format(pump.reading),
                    litres: new Intl.NumberFormat().format(pump.litres),
                }))
                setFuelings(filtered)
            })


            fetch('https://db-demo-u07o.onrender.com/pumpnames')
                .then(response => response.json())
                .then((data) => {
                    setPumps(data)
                })
            
            console.log(data);
            // Reset form data
            setFormData({
                pump_name: "",
                truck_number: "",
                litres: "",
                reading: "",
                price: "",
                order: "",
                date: "",
                pump_location:"",
            });
        })
        .catch(error => {
            console.error("Error submitting form:", error);
        });
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
            field: "truck_number",
            headerName: "Truck Number",
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
          field: "order",
          headerName: "Order",
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
                <h2 className="h2">FUEL</h2>
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

                        <div className="bill-input">
                            <label>PUMP LOCATION</label>
                            <input
                                type="text"
                                name="pump_location"
                                placeholder="Pump Location"
                                className="bill-inputfield"
                                value={formData.pump_location}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>

                        <div className="bill-input">
                                <label>VEHICLE NUMBER</label>
                                <select 
                                    type="text"
                                    name="truck_number"
                                    value={formData.truck_number}
                                    placeholder="Vehicle Number"
                                    className="bill-inputfield"
                                    onChange={handleChange}
                                >
                                <option value="">Select Vehicle</option>
                                {trucks.map((truck, index) => (
                                        <option key={index} value={truck.truck_number}>{truck.truck_number}</option>
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
                                <label>FUEL ATTENDANT</label>
                                <input
                                    type="text"
                                    name="order"
                                    placeholder="Fuel Attendant"
                                    className="bill-inputfield"
                                    value={formData.order}
                                    onChange={handleChange}
                                
                                />
                        </div>

                        <div className="bill-input">
                                <label>PRICE</label>
                                <input
                                    type="text"
                                    name="price"
                                    placeholder="Price"
                                    className="bill-inputfield"
                                    value={formData.price}
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
                            <button type="submit" className="button">FUEL</button>
                </form>
            </div>
            <Box m="20px" mt='50px'>
                  <Typography fontWeight="bold" variant="h5" textAlign="center">
                        NUMBER OF FUEL TRANSACTIONS
                  </Typography>
                  <Box
                    margin='auto'
                    mt='20px'
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
                      rows={fuelings}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Box>
                </Box> 
        </div>
     );
}
 
export default Fuel;