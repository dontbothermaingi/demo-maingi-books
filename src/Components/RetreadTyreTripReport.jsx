import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import ReactToPrint from 'react-to-print';
import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './RetreadTyreTripReport.css'; // Import your CSS file

function RetreadTyreTripReport() {
    const componentRef = useRef();
    const { repairId } = useParams();
    const navigate = useNavigate();
    const [repairs, setRepairs] = useState([]);
    const [tableItems, setTableItems] = useState([]);

    useEffect(() => {
        fetch(`https://db-demo-u07o.onrender.com/retreadshoptrips/${repairId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Data received:", data);
                const repairItems = data.items.map((item) => ({
                    ...data,
                    ...item,
                }));
                setRepairs(data);
                setTableItems(repairItems);
            })
            .catch(error => {
                console.error("Error fetching repairs:", error);
            });
    }, [repairId]);

    const handleCustomBill = () => {
        navigate(`/retread-tyre-shop`);
    };

    return (
        <div>
            <button
                type="button"
                className="button"
                onClick={() => handleCustomBill()}
            >
                BACK
            </button>
            <Box ref={componentRef} className="a4-print" padding='20px'>
                <Box display='flex' justifyContent='space-between' gap='10px' margin='20px'>
                    <Box>
                        <Typography fontSize='40px' fontWeight='bold' textAlign="left">
                            RETREAD TYRE TRIP
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            {repairs.vendor_name}
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            {repairs.vendor_email}
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            {repairs.vendor_phone}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography fontSize='40px' fontWeight='bold' textAlign="left">
                            DATE
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            {repairs.date}
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            Trip #{repairs.id}
                        </Typography>
                    </Box>
                </Box>
                
                <Box mt='20px'>
                    <Typography fontSize='30px' fontWeight='bold' margin='20px'>
                        Tyre Information
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography fontWeight='bold'>Serial Number</Typography></TableCell>
                                    <TableCell><Typography fontWeight='bold'>Tyre Brand</Typography></TableCell>
                                    <TableCell><Typography fontWeight='bold'>Tyre Size</Typography></TableCell>
                                    <TableCell><Typography fontWeight='bold'>Tyre Mileage</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableItems.map((repair, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{repair.serial_number}</TableCell>
                                        <TableCell>{repair.item_details}</TableCell>
                                        <TableCell>{repair.size}</TableCell>
                                        <TableCell>{repair.tyre_mileage}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            <Box display="flex" justifyContent="center" mt="20px">
                <ReactToPrint
                    trigger={() => (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                backgroundColor: '#1976d2',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                                padding: "10px 20px",
                                fontSize: "16px",
                                fontWeight: "bold",
                            }}
                        >
                            Print
                        </Button>
                    )}
                    content={() => componentRef.current}
                />
            </Box>
        </div>
    );
}

export default RetreadTyreTripReport;
