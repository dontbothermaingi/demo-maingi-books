import { Box, Button, Typography } from "@mui/material";
import ReactToPrint from 'react-to-print';
import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './RepairReport.css'; // Import your CSS file

function RepairReport() {
    const componentRef = useRef();
    const { repairId } = useParams();
    const [repairs, setRepairs] = useState([]);
    const [tableItems, setTableItems] = useState([]);
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        fetch(`https://demo-server-757m.onrender.com/vehiclemantainances/${repairId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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


    return (
        <Box>
            

            <Box ref={componentRef} padding='20px'>
                <Box display='flex' justifyContent={{md:'space-between', xs:'center'}} flexDirection={{md:'row', xs:'column'}} gap='10px' margin='20px'>
                    <Box>
                        <Typography fontFamily={'GT Medium'} fontSize='30px' fontWeight='bold' textAlign="left">
                            {repairs.job_description}
                        </Typography>
                        <Typography fontFamily={'GT Light'} fontSize='20px' textAlign="left">
                            {repairs.vehicle_type}
                        </Typography>
                        <Typography fontFamily={'GT Light'} fontSize='20px' textAlign="left">
                            {repairs.manufacturer}
                        </Typography>
                        <Typography fontFamily={'GT Light'} fontSize='20px' textAlign="left">
                            {repairs.truck_number}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography fontFamily={'GT Medium'} fontSize='30px' fontWeight='bold' textAlign="left">
                            DATE
                        </Typography>
                        <Typography fontFamily={"GT Light"} fontSize='20px' textAlign="left">
                            {new Date(repairs.date).toLocaleDateString("en-Ke", {
                                year:'numeric',
                                month:'long',
                                day:'2-digit',
                                weekday:'long',
                            })}
                        </Typography>
                        <Typography fontFamily={"GT Light"} fontSize='20px' textAlign="left">
                            Repair #{repairs.repair_number}
                        </Typography>
                        <Typography fontFamily={"GT Light"} fontSize='20px' textAlign="left">
                            Cost: {new Intl.NumberFormat("en-KE", {style:'currency', currency:'KES'}).format(cost)}
                        </Typography>
                    </Box>
                </Box>
                
                <Box mt='20px'>
                    <Typography fontFamily={"GT Bold"} fontSize='30px' fontWeight='bold' margin='20px'>
                        Repair Details
                    </Typography>
                    {tableItems.map((repair, index) => (
                        <Box key={index} marginTop='10px' padding='10px' border='1px solid #ccc' borderRadius='4px' margin='20px'>
                            <Typography fontFamily={"GT Medium"} fontSize='20px' fontWeight='bold'>
                                Spare Category: {repair.spare_category_name}
                            </Typography>
                            <Typography fontFamily={"GT Light"} fontSize='18px'>
                                <span style={{fontFamily:'GT Medium'}}>Spare:</span> {repair.spare_subcategory_name}
                            </Typography>
                            <Typography fontFamily={"GT Light"} fontSize='18px'>
                                <span style={{fontFamily:'GT Medium'}}>Mechanic:</span> {repair.mechanic}
                            </Typography>
                            <Typography fontFamily={'GT Light'} fontSize='18px'>
                                <span style={{fontFamily:'GT Medium'}}>Quantity:</span> {repair.quantity}
                            </Typography>
                            <Typography fontFamily={"GT Light"} fontSize='18px'>
                                <span style={{fontFamily:'GT Medium'}}>Job Description:</span> {repair.job_name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box display="flex" justifyContent="center" padding={'20px'}>
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
