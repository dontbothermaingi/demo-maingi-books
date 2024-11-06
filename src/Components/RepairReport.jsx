import { Box, Button, Typography } from "@mui/material";
import ReactToPrint from 'react-to-print';
import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './RepairReport.css'; // Import your CSS file

function RepairReport() {
    const componentRef = useRef();
    const { repairId } = useParams();
    const navigate = useNavigate();
    const [repairs, setRepairs] = useState([]);
    const [tableItems, setTableItems] = useState([]);
    const token = localStorage.getItem('access_token')
    

    useEffect(() => {
        fetch(`https://db-demo-u07o.onrender.com/vehiclemantainances/${repairId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
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
    }, [repairId,token]);

    const cost = tableItems.reduce((total,item) => item.price + total, 0)

    const handleCustomBill = () => {
        navigate(`/trucks`);
    };

    return (
        <Box>
            <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={() => handleCustomBill()}
            >
                BACK
            </Button>

            <Box ref={componentRef} className="a4-print" padding='20px'>
                <Box display='flex' justifyContent='space-between' gap='10px' margin='20px'>
                    <Box>
                        <Typography fontSize='40px' fontWeight='bold' textAlign="left">
                            {repairs.job_description}
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            {repairs.vehicle_type}
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            {repairs.manufacturer}
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            {repairs.truck_number}
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
                            Repair #{repairs.repair_number}
                        </Typography>
                        <Typography fontSize='25px' textAlign="left">
                            Cost: {cost}
                        </Typography>
                    </Box>
                </Box>
                
                <Box mt='20px'>
                    <Typography fontSize='30px' fontWeight='bold' margin='20px'>
                        Repair Details
                    </Typography>
                    {tableItems.map((repair, index) => (
                        <Box key={index} marginTop='10px' padding='10px' border='1px solid #ccc' borderRadius='4px' margin='20px'>
                            <Typography fontSize='20px' fontWeight='bold'>
                                Spare Category: {repair.spare_category_name}
                            </Typography>
                            <Typography fontSize='18px'>
                                Spare Name: {repair.spare_subcategory_name}
                            </Typography>
                            <Typography fontSize='18px'>
                                Mechanic: {repair.mechanic}
                            </Typography>
                            <Typography fontSize='18px'>
                                Quantity: {repair.quantity}
                            </Typography>
                            <Typography fontSize='18px'>
                                Job Description: {repair.job_name}
                            </Typography>
                        </Box>
                    ))}
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
        </Box>
    );
}

export default RepairReport;
