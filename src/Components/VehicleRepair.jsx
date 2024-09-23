import { Box,IconButton, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close'; 

function VehicleRepair(){

    const [spareSubCategories, setSpareSubCategories] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [repairs, setRepairs] = useState([]);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
            truck_number : "",
            vehicle_type : "",
            manufacturer: "",
            date : "",
            job_description : "",
            repair_number : "",
            items:[]
    })

    const [newItem, setNewItem] = useState({
        spare_subcategory_name : "", 
        spare_category_name : "",
        price: "",
        job_name : "",
        position : "",
        quantity : "",
        mechanic : "",
    })


    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/trucks')
        .then(response => response.json())
        .then((data) => {
            setTrucks(data)
        })
    },[])


    useEffect(()=>{
        fetch('https://db-demo-u07o.onrender.com/sparesubcategories')
        .then(response => response.json())
        .then((data) => {
            setSpareSubCategories(data)
        })
    },[])

    useEffect(() => {
        fetch("https://db-demo-u07o.onrender.com/vehiclemantainances")
          .then((response) => response.json())
          .then((data) => {
            const combined = data.flatMap((vehicle) =>
              vehicle.items.map((item, index) => ({
                ...item,
                ...vehicle,
                id: `${vehicle.id}-${index}`, // Creating a unique id by combining vehicle id and item index
              }))
            );
    
            setRepairs(combined);
          });
      }, []);

    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
    }

    function handleSelectTruck(event) {
        const selectedValue = event.target.value;

        if (selectedValue === "new_vehicle") {
            navigate("/trucks");
            return;
        }

        const selectedTruck = trucks.find(truck => truck.truck_number === selectedValue);

        if (selectedTruck) {
            setFormData(prevFormData => ({
                ...prevFormData,
                truck_number: selectedTruck.truck_number,
                vehicle_type: selectedTruck.vehicle_type,
                manufacturer: selectedTruck.manufacturer,
            }));
        }
    }

    function handleSelectSpare(event){
        const selectedValue = event.target.value

        const selectedSpare = spareSubCategories.find(item => item.spare_subcategory_name === selectedValue)

        if (selectedSpare) {
            setNewItem(prevNewItem => ({
                ...prevNewItem,
                spare_subcategory_name: selectedSpare.spare_subcategory_name,
                price: selectedSpare.price
            }));
        }

    }

    const axel = [
        { axels: "Steering Axle Left" },
        { axels: "Steering Axle Right" },
        { axels: "Lift Axle Left" },
        { axels: "Lift Axle Right" },
        { axels: "First Drive Axle Left" },
        { axels: "First Drive Axle Right" },
        { axels: "Second Drive Axle Left" },
        { axels: "Second Drive Axle Right" },
        { axels: "Tag Axle Left" },
        { axels: "Tag Axle Right" },
        { axels: "Trailer Axle Single Left" },
        { axels: "Trailer Axle Single Right" },
        { axels: "Trailer Axle Tandem Left" },
        { axels: "Trailer Axle Tandem Right" },
        { axels: "Trailer Axle Triple Left" },
        { axels: "Trailer Axle Triple Right" },
    ];
    const selectedSpare = spareSubCategories.find(item => item.spare_subcategory_name === newItem.spare_subcategory_name)

    function addItem() {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, newItem]
        }));
        setNewItem({ job_name: "",position:"", spare_subcategory_name : "", spare_category_name : "", quantity : "", mechanic:"", });
    }

    function handleNewItemChange(event){
        const {name,value} = event.target

        setNewItem(prevNewItem => ({
            ...prevNewItem,
            [name]:value,
        }))
    }

    function handleChange(event){
        const{name,value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value,
        }))
    }

    const repairNumber = repairs.length + 1;

    function handleSubmit(event){
        event.preventDefault()
        fetch('https://db-demo-u07o.onrender.com/vehiclemantainances', {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                ...formData,
                repair_number: repairNumber,
                price: newItem.price
            })
        })
        .then(response => response.json())
        .then((data) => {

                fetch("https://db-demo-u07o.onrender.com/vehiclemantainances")
                  .then((response) => response.json())
                  .then((data) => {
                    const combined = data.flatMap((vehicle) =>
                      vehicle.items.map((item, index) => ({
                        ...item,
                        ...vehicle,
                        id: `${vehicle.id}-${index}`, // Creating a unique id by combining vehicle id and item index
                      }))
                    );
            
                    setRepairs(combined);
                  });


            console.log(data)
            setFormData({
                truck_number : "",
                vehicle_type : "",
                manufatcurer:"",
                date : "",
                job_description : "",
                items:[],
            })
        })
    }

    const handleRepairReport = (repairId) => {
        navigate(`/repair/${repairId}`);
      };

const columns = [
        {
            field: "truck_number",
            headerName: "VEHICLE NUMBER",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.2,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "vehicle_type",
            headerName: "VEHICLE TYPE",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.27,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
              >
                <Typography
                    variant="h7"
                >
                  {params.value}
                </Typography>
              </Box>
              ),
        },
        // {
        //     field: "manufacturer",
        //     headerName: "MANUFACTURER",
        //     headerAlign: "left",
        //     cellClassName: "name-column--cell",
        //     flex: 0.2,
        //     align: "left",
        //     renderCell: (params) => (
        //         <Box 
        //         sx={{ 
        //           display: 'flex', 
        //           alignItems: 'center', 
        //           cursor: 'pointer', 
        //         }}
        //         onClick={() => handleRepairReport(params.row.repair_number)}
        //       >
        //         <Typography
        //             variant="h7"
        //         >
        //           {params.value}
        //         </Typography>
        //       </Box>
        //       ),
        // },
        {
            field: "job_description",
            headerName: "JOB TYPE",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.2,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "spare_category_name",
            headerName: "SPARE CATEGORY",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.25,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
          field: "spare_subcategory_name",
          headerName: "SPARE NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "mechanic",
            headerName: "MECHANIC",
            flex: 0.15,
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
          field: "quantity",
          headerName: "QUANTITY",
          flex: 0.15,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleRepairReport(params.row.repair_number)}
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
            field: "job_name",
            headerName: "JOB DESCRIPTION",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.4,
            align: "left",
            renderCell: (params) => (
                <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                }}
                onClick={() => handleRepairReport(params.row.repair_number)}
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
            <div className="bill-content">
                <h2 className="h2">VEHICLE REPAIR OR SERVICE</h2>
                <form className="bill-form" onSubmit={handleSubmit}>
                    <div className="bill-input">
                        <label>TRUCK NUMBER</label>
                        <select 
                            type="text"
                            name="truck_number"
                            value={formData.truck_number}
                            placeholder="Vehicle Number"
                            className="bill-inputfield"
                            onChange={handleSelectTruck}
                        >
                          <option value="">Select Vehicle</option>
                          {trucks.map((truck, index) => (
                                <option key={index} value={truck.truck_number}>{truck.truck_number}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bill-input">
                        <label>VEHICLE TYPE</label>
                        <input
                            type="text"
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            placeholder="Vehicle Type"
                            className="bill-inputfield"
                            onChange={handleChange}
                            readOnly
                            
                        />
                    </div>
                    <div className="bill-input">
                        <label>MANUFACTURER</label>
                        <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            placeholder="Manufacturer"
                            className="bill-inputfield"
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className="bill-input">
                        <label>REPAIR/MANTAINANCE DESCRIPTION</label>
                        <select 
                            type="text"
                            name="job_description"
                            value={formData.job_description}
                            placeholder="Job Descrition"
                            className="bill-inputfield"
                            onChange={handleChange}
                        >
                          <option value="">Select Job</option>
                          <option value="REPAIR">REPAIR</option>
                          <option value="SERVICE">SERVICE</option>

                        </select>
                        
                    </div>

                    <div className="bill-input">
                        <label>DATE</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            placeholder="date"
                            className="bill-inputfield"
                            onChange={handleChange}
                        />
                    </div>

                    {newItem.spare_subcategory_name ? <h2 className="OWE">THIS SPARE HAS {new Intl.NumberFormat().format(selectedSpare.quantity)} {selectedSpare.measurement} LEFT.</h2> : ""}


                    <div className="bill-input">
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Repair Description</th>
                                    <th>Vehicle Axle(If Needed)</th>
                                    <th>Spare Name</th>
                                    <th>Quantity</th>
                                    <th>Mechanic</th>
                                    {/* <th>Delete</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.job_name}</td>
                                        <td>{item.position}</td>
                                        <td>{item.spare_subcategory_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.mechanic}</td>
                                        <td>
                                            <IconButton 
                                                color="error"
                                                onClick={() => handleDeleteItem(index)}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                                <tr>

                                    
                                    <td>
                                        <input
                                            type="text"
                                            name="job_name"
                                            value={newItem.job_name}
                                            placeholder="Repair description"
                                            className="bill-inputfield"
                                            onChange={handleNewItemChange}
                                        />
                                    </td>

                                    <td>
                                        <select value={newItem.position} onChange={handleNewItemChange} name="position" className="bill-inputfield">
                                            <option value=''>Select Axle</option>
                                            {axel.map((axelOption, index) => (
                                                <option key={index} value={axelOption.axels}>
                                                    {axelOption.axels}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    

                                    <td>
                                        <select 
                                            type="text"
                                            name="spare_subcategory_name"
                                            value={newItem.spare_subcategory_name}
                                            placeholder="Spare"
                                            className="bill-inputfield"
                                            onChange={handleSelectSpare}
                                        >
                                            <option value="">Select Spare</option>
                                            {spareSubCategories.map((spare, index) => (
                                                    <option key={index} value={spare.spare_subcategory_name}>{spare.spare_subcategory_name}</option>
                                                ))}
                                        </select>
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={newItem.quantity}
                                            placeholder="quantity"
                                            className="bill-inputfield"
                                            onChange={handleNewItemChange}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            name="mechanic"
                                            value={newItem.mechanic}
                                            placeholder="mechanic"
                                            className="bill-inputfield"
                                            onChange={handleNewItemChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                            <button type="button" className="button" onClick={addItem}>Add Repair/Service</button>
                        </div>

                    <button type="submit" className="button">REPAIR</button>
                    
                </form>
            </div>

            <Box m="20px">
                    <Typography
                        textAlign='center'
                        fontSize='30px'
                        fontWeight='bold'
                        >
                            ALL REPAIRS
                    </Typography>          

                    <Box
                    m="40px 0 0 0"
                    width='auto'
                    height="75vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                        border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        // fontSize: "16px", 
                        },
                        "& .name-column--cell": {
                        // color: colors.greenAccent[300],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        // fontSize: "16px", 
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
                        rows={repairs}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                    />
                    </Box>
          </Box>
        </div>
     );
}
 
export default VehicleRepair;