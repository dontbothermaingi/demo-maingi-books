import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PieChart from "./PieChart";
import "./Fitnewtyre.css";
import { useNavigate } from "react-router-dom";

function Tyre() {
    const [type, setType] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [tyreInventory, setTyreInventory] = useState([]);
    const [selectedTyreItem, setSelectedTyreItem] = useState(null);
    const [formData, setFormData] = useState({
        item_details: "",
        size: "",
        truck_number: "",
        serial_number: "",
        starting_mileage: "",
        position: "",
        price: "",
        status: "FITTED",
        quantity: 1,
        date: ""
    });

    // Fetch tyre data and update state
    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/tyres')
            .then(response => response.json())
            .then(data => {
                const sortedItems = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setItems(sortedItems);
                setTyreInventory(data);
            });
    }, []);

    // Fetch truck data and update state
    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/trucks')
            .then(response => response.json())
            .then(data => setTrucks(data));
    }, []);

    // Fetch removed tyre data and update type for PieChart
    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/removetyres')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const receiptsItem = data.reduce((acc, item) => {
                    acc[item.item_details] = (acc[item.item_details] || 0) + item.quantity;
                    return acc;
                }, {});
                const formattedReceipts = Object.entries(receiptsItem).map(([item_details, quantity]) => ({
                    id: item_details,
                    value: quantity
                }));
                setType(formattedReceipts);
            });
    }, []);

    // Update filtered tyres when size or inventory changes
    useEffect(() => {
        if (formData.size) {
            const filteredTyres = tyreInventory.filter(tyre => tyre.size === formData.size);
            setFilteredBanks(filteredTyres);
        } else {
            setFilteredBanks([]);
        }
    }, [formData.size, tyreInventory]);

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
        { axels: "Trailer First Axle Left" },
        { axels: "Trailer First Axle Right" },
        { axels: "Trailer Second Axle Left" },
        { axels: "Trailer Second Axle Right" },
        { axels: "Trailer Third Axle Left" },
        { axels: "Trailer Third Axle Right" },
    ];
    

    // Handle size selection
    function handleSelectSize(event) {
        const selectedSize = event.target.value;
        const selectedItem = tyreInventory.find(item => item.size === selectedSize);
        setSelectedTyreItem(selectedItem);
        setFormData(prevFormData => ({
            ...prevFormData,
            size: selectedSize,
            price: selectedItem ? selectedItem.price : ""
        }));
    }

    // Handle form data changes
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    // Handle form submission
    function handleSubmit(event) {
        
        event.preventDefault();

        fetch('https://db-demo-u07o.onrender.com/removetyres', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, status: 'FITTED', price: formData.price})
        })
            .then(response => response.json())
            .then(() => {

                fetch('https://db-demo-u07o.onrender.com/tyres')
                .then(response => response.json())
                .then(data => {
                    const sortedItems = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setItems(sortedItems);
                    setTyreInventory(data);
                });
                
                event.target.reset();
                setFormData({
                    item_details: "",
                    size: "",
                    truck_number: "",
                    serial_number: "",
                    starting_mileage: "",
                    position: "",
                    price: "",
                    quantity: 1,
                    date: ""
                });
            })
            .catch(error => console.error('Error updating history:', error));
    }

    const navigate = useNavigate();

    // Navigate to tyre control page
    const handleTyreContol = () => {
        navigate('/tyre-control');
    };

    const columns = [
        { field: "item_details", headerName: "ITEM DETAILS", flex: 0.5 },
        { field: "quantity", headerName: "QUANTITY", flex: 0.5 },
        { field: "size", headerName: "SIZE", flex: 0.5 }
    ];

    const tyreSizes = [
        // Tyre sizes including motorcycle tyres
        "145/70R13", "155/65R14", "175/65R14", "185/60R15", "195/60R15",
        "205/55R16", "215/55R16", "225/50R17", "235/45R17", "245/40R18",
        "255/35R18", "265/30R19", "275/30R20", "205/70R15", "215/65R16",
        "225/60R17", "235/55R18", "245/55R19", "255/50R20", "275/45R20",
        "195/75R16", "215/75R16", "225/75R16", "235/75R16", "245/75R16",
        "265/75R16", "275/70R17", "285/70R17", "305/70R16", "315/70R17",
        "345/70R17", "385/65R22.5", "425/65R22.5", "295/80R22.5", "315/80R22.5",
        "345/80R22.5", "385/65R22.5", "425/65R22.5", "235/75R15", "245/75R16",
        "265/75R16", "275/70R17", "285/75R17", "315/75R16", "35x12.50R15",
        "37x12.50R17", "100/90-19", "110/80-19", "120/70-17", "130/70-17",
        "140/70-17", "150/60-17", "160/60-17", "180/55-17", "190/50-17",
        "200/50-17", "120/80-18", "140/80-18", "150/70-18", "160/70-17",
        "170/60-17"
    ];

    return (
        <div>
            <div className="bill-content">
                <button type="button" className="button" onClick={handleTyreContol}>
                    BACK
                </button>
                <div>
                    <h2 className="h2">FIT TYRE</h2>
                    <form className="bill-form" onSubmit={handleSubmit}>
                        <div className="bill-input">
                            <label>Tyre Size</label>
                            <select className="bill-inputfield" onChange={handleSelectSize} name="size" value={formData.size}>
                                <option value="">Select a Size</option>
                                {tyreSizes.map(size => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bill-input">
                            <label>Tyre</label>
                            <select className="bill-inputfield" onChange={handleChange} name="item_details" value={formData.item_details}>
                                <option value="">Select an item</option>
                                {filteredBanks.map((item, index) => (
                                    <option key={index} value={item.item_details}>
                                        {item.item_details}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bill-input">
                            <label>Quantity</label>
                            <input
                                className="bill-inputfield"
                                type="number"
                                name="quantity"
                                placeholder="Quantity Removed"
                                value={formData.quantity}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>

                        <div className="bill-input">
                            <label>Truck Number</label>
                            <select value={formData.truck_number} onChange={handleChange} className="bill-inputfield" name="truck_number">
                                <option value="">Select a truck</option>
                                {trucks.map(truck => (
                                    <option key={truck.id} value={truck.truck_number}>
                                        {truck.truck_number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bill-input">
                            <label>Serial Number</label>
                            <input
                                type="text"
                                name="serial_number"
                                placeholder="Serial Number"
                                className="bill-inputfield"
                                value={formData.serial_number}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="bill-input">
                            <label>Starting Mileage</label>
                            <input
                                type="number"
                                name="starting_mileage"
                                placeholder="Starting Mileage"
                                className="bill-inputfield"
                                value={formData.starting_mileage}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="bill-input">
                            <label>Position</label>
                            <select value={formData.position} onChange={handleChange} name="position" className="bill-inputfield">
                                <option value=''>Select Axle</option>
                                {axel.map((axelOption, index) => (
                                    <option key={index} value={axelOption.axels}>
                                        {axelOption.axels}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bill-input">
                            <label>Fitment Date</label>
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

                        {selectedTyreItem && selectedTyreItem.quantity === 0 && <p>Tyre is out of stock.</p>}
                        <button type="submit" className="button">FIT NEW TYRE</button>
                    </form>
                </div>

                <Box m="20px">
                    <Typography fontWeight='bold' variant="h5" textAlign='center'>
                        BRAND OF TYRES FITTED
                    </Typography>
                    <PieChart chartdata={type} />
                    <Typography fontWeight='bold' variant="h5" textAlign='center'>
                        AVAILABLE NEW TYRES
                    </Typography>
                    <Box
                        width='1000px'
                        ml='300px'
                        height="75vh"
                        sx={{
                            "& .MuiDataGrid-root": { border: "none" },
                            "& .MuiDataGrid-cell": { borderBottom: "none" },
                            "& .name-column--cell": {},
                            "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
                            "& .MuiDataGrid-virtualScroller": {},
                            "& .MuiDataGrid-footerContainer": { borderTop: "none" },
                            "& .MuiCheckbox-root": {},
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {}
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
            </div>
        </div>
    );
}

export default Tyre;
