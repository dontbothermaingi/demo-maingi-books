import { useEffect, useRef, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useMediaQuery, Typography, Button} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import '../Components/Invoicepdf/Invoicepage.css'; // Import your CSS file
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function VehicleReport() {
    const [trucks, setTrucks] = useState([]);
    const token = localStorage.getItem("access_token");
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [fuelTransactions, setFuelTransactions] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const componentRef = useRef();

    const filterByDateRange = (items, startDate, endDate) => {
        if(!startDate || !endDate) return items;

        return items.filter(item => {
            const itemDate = new Date(item.date)  // Converts the string intoa date object
            return itemDate >= startDate && itemDate <= endDate
        })
    }

    useEffect(() => {
        fetch("https://maingi-demo-server.onrender.com/trucks", {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTrucks(data);
            });
    }, [token]);


      useEffect(() => {

        if (!token || trucks.length === 0) return;

        fetch('https://maingi-demo-server.onrender.com/pumpfuelings', {
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                },
                credentials:'include'
        })
          .then(response => response.json())
          .then(data => {

            const normalisedData = data.map(item => ({
                ...item,
                truck_number: item.truck_number.replace(/\s+/g, '').toUpperCase()
            }))

            const filteredData = filterByDateRange(normalisedData, startDate, endDate)
      
            const grouped = filteredData.reduce((acc, current) => {
                const vehicle = current.truck_number
                const truckId = current.truck_id

                const truckManufacturer = trucks.find(item => item.id === truckId);

                if(!acc[vehicle]){
                    acc[vehicle] = {
                        truck_number: vehicle,
                        total_litres:0,
                        manufacturer: truckManufacturer?.manufacturer || "Unknown"

                    }
                };

                acc[vehicle].total_litres += current.litres
                return acc;
            },{})

            const results = Object.values(grouped).map((item, index) => ({
                id: index + 1,
                ...item
            }));

            const sort = results.sort((a,b) => b.total_litres - a.total_litres);

            setFuelTransactions(Object.values(sort))
            // console.log("Grouped Data", fuelTransactions)
          })
          .catch(error => console.error('Error fetching data:', error));
      }, [token, trucks, endDate, startDate]);


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Box sx={{ padding: 2 }}>
            <Button variant="contained" color="secondary" onClick={handlePrint} sx={{ml:'30px'}}>Print</Button>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display={'flex'} gap={'20px'} mt={'20px'} ml={'30px'}>

                    <Box>
                        <Typography fontFamily={"GT Light"}>Starting Date</Typography>
                        <DatePicker value={startDate} onChange={(date) => setStartDate(date)}/>
                    </Box>

                    <Box>
                        <Typography fontFamily={"GT Light"}>Ending Date</Typography>
                        <DatePicker value={endDate} onChange={(date) => setEndDate(date)}/>
                    </Box>

                </Box>
                
            </LocalizationProvider>

        {isMobile ? (
            <Box>
                <Box>
                    <Box ref={componentRef} padding={2}>
                    <Typography fontWeight={'bold'} fontSize={'20px'} textAlign={'center'} fontFamily={"GT Bold"}>FUEL REPORT</Typography>
                    {startDate && endDate && <Typography fontSize={'15px'} textAlign={'center'} fontFamily={"GT Regular"}>From {new Date(startDate).toLocaleDateString("en-KE", {year:'numeric', month:'long', day:'2-digit', weekday:'long',})} to {new Date(endDate).toLocaleDateString("en-KE", {year:'numeric', month:'long', day:'2-digit', weekday:'long',})}</Typography>}

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontFamily: "GT Medium", fontSize:'15px'}}>Truck Number</TableCell>
                                    <TableCell sx={{fontFamily: "GT Medium", fontSize:'15px'}}>Manufacturer</TableCell>
                                    <TableCell sx={{fontFamily: "GT Medium", fontSize:'15px'}}>Fuel</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fuelTransactions.map((truck) => (
                                    <TableRow key={truck.id}>
                                        <TableCell sx={{fontFamily: "GT Light", fontSize:'13px'}}>{truck.truck_number}</TableCell>
                                        <TableCell sx={{fontFamily: "GT Light", fontSize:'13px'}}>{truck.manufacturer}</TableCell>
                                        <TableCell sx={{fontFamily: "GT Light", fontSize:'13px'}}>{new Intl.NumberFormat().format(truck.fueling?.reduce((total, item) => total + item.litres, 0) || truck.total_litres)} Litres</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Box>
                </Box>
            </Box>
        ):(
            <Box>
                <Box ref={componentRef} padding={4}>
                <Typography fontWeight={'bold'} fontSize={'20px'} textAlign={'center'} fontFamily={"GT Bold"}>FUEL REPORT</Typography>
                {startDate && endDate && <Typography mb={'30px'} fontSize={'20px'} textAlign={'center'} fontFamily={"GT Regular"}>From {new Date(startDate).toLocaleDateString("en-KE", {year:'numeric', month:'long', day:'2-digit', weekday:'long',})} to {new Date(endDate).toLocaleDateString("en-KE", {year:'numeric', month:'long', day:'2-digit', weekday:'long',})}</Typography>}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontFamily: "GT Medium", fontSize:'20px'}}>Truck Number</TableCell>
                                <TableCell sx={{fontFamily: "GT Medium", fontSize:'20px'}}>Manufacturer</TableCell>
                                <TableCell sx={{fontFamily: "GT Medium", fontSize:'20px'}}>Fuel</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fuelTransactions.map((truck) => (
                                <TableRow key={truck.id}>
                                    <TableCell sx={{fontFamily: "GT Light"}}>{truck.truck_number}</TableCell>
                                    <TableCell sx={{fontFamily: "GT Light"}}>{truck.manufacturer}</TableCell>
                                    <TableCell sx={{fontFamily: "GT Light"}}>{new Intl.NumberFormat().format(truck.fueling?.reduce((total, item) => total + item.litres, 0) || truck.total_litres)} Litres</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Box>

            </Box>
        )}
           
        </Box>
    );
}

export default VehicleReport;
