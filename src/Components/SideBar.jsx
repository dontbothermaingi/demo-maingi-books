import { useState } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RequestQuoteIcon from "@mui/icons-material/RequestQuoteOutlined";
import LocalGasStation from "@mui/icons-material/LocalGasStation";
import {Build, Inventory, LogoutOutlined, Storefront } from "@mui/icons-material";
import './Navbar.css';

function SideBar({ onLogout }) {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleToggle = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const renderNavLink = (to, label) => (
        <NavLink exact to={to} className="navlink" activeClassName="active">
            <Box display='flex' flexDirection='row' gap='10px' textAlign={'center'} alignItems='left' justifyContent={'center'}>
                <Typography variant="body2">{label}</Typography>
            </Box>
        </NavLink>
    );

    const navigate = useNavigate()

    function handleSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem('access_token');
        fetch('https://db-demo-u07o.onrender.com/logout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Logout failed');
                }
            })
            .then(() => {
                onLogout();
                navigate('/login');
            })
            .catch(error => {
                console.error("Error during logout:", error);
            });
    }

    return (
        <Box>
            <Box
                height={'96vh'}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}
                sx={{backgroundColor: '#f5f5f5', padding: '16px', }}
                width={{md:'230px'}}
            >
               

                <Box display={'flex'} flexDirection={'column'}>
                    <Box>
                        <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>MAINGI BOOKS</Typography>
                    </Box>

                    <Divider orientation="horizontal" sx={{mt:'30px'}}/>
                </Box>

                <Box overflow={'auto'} >
                        <Box>
                            <Typography
                                onClick={() => handleToggle('dashboard')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'dashboard' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'dashboard' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <HomeOutlinedIcon sx={{ marginRight: '10px' }} />
                                DASHBOARD
                                
                            </Typography>
                            {activeDropdown === 'dashboard' && (
                                <Box mt={1}>
                                    {renderNavLink("/", "Dashboard")}
                                </Box>
                            )}
                        </Box>

                        <Box >
                            <Typography
                                onClick={() => handleToggle('trucks')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'trucks' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'trucks' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <LocalShippingOutlinedIcon sx={{ marginRight: '10px' }} />
                                    VEHICLES
                            
                            </Typography>
                            {activeDropdown === 'trucks' && (
                                <Box mt={1}>
                                    {renderNavLink("/trucks", "Vehicles")}
                                </Box>
                            )}
                        </Box>

                        <Box >
                            <Typography
                                onClick={() => handleToggle('sales')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'sales' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'sales' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <PeopleOutlinedIcon sx={{ marginRight: '10px' }} />
                                SALES
                            
                            </Typography>
                            {activeDropdown === 'sales' && (
                                <Box mt={1}>
                                    {renderNavLink("/customers", "Customers")}
                                    {renderNavLink("/invoice", "Invoices")}
                                    {renderNavLink("/credit-note", "Credit Note")}
                                    {renderNavLink("/quotes", "Quote")}
                                    {renderNavLink("/delivery-notes", "Delivery Note")}
                                </Box>
                            )}
                        </Box>

                        <Box >
                            <Typography
                                onClick={() => handleToggle('purchases')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'purchases' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'purchases' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <RequestQuoteIcon sx={{ marginRight: '10px' }} />
                                PURCHASES
                                
                            </Typography>
                            {activeDropdown === 'purchases' && (
                                <Box mt={1}>
                                    {renderNavLink("/vendors", "Vendors")}
                                    {renderNavLink("/bill", "Bill")}
                                </Box>
                            )}
                        </Box>

                        <Box >
                            <Typography
                                onClick={() => handleToggle('banking')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'banking' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'banking' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <RequestQuoteIcon sx={{ marginRight: '10px' }} />
                                BANKING
                            
                            </Typography>
                            {activeDropdown === 'banking' && (
                                <Box mt={1}>
                                    {renderNavLink("/banking", "Banking")}
                                    {renderNavLink("/payments-received", "Payments Received")}
                                    {renderNavLink("/payments-made", "Payments Made")}
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography
                                onClick={() => handleToggle('diesel')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'diesel' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'diesel' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <LocalGasStation sx={{ marginRight: '10px' }} />
                                FUEL PUMP
                                
                            </Typography>
                            {activeDropdown === 'diesel' && (
                                <Box mt={1}>
                                    {renderNavLink("/fuel-control", "Your Pumps")}
                                    {/* {renderNavLink("/pump-b", "Pump B")} */}
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography
                                onClick={() => handleToggle('spares')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'spares' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'spares' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <Build sx={{ marginRight: '10px' }} />
                                SPARES
                                
                            </Typography>
                            {activeDropdown === 'spares' && (
                                <Box mt={1}>
                                    {renderNavLink("/spares", "Spares")}
                                    {renderNavLink("/vehicle-repair", "Vehicle Repair")}
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography
                                onClick={() => handleToggle('stock')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'stock' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'stock' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <Inventory sx={{ marginRight: '10px' }} />
                                STOCK
                                
                            </Typography>
                            {activeDropdown === 'stock' && (
                                <Box mt={1}>
                                    {renderNavLink("/stock-items", "Stock")}
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography
                                onClick={() => handleToggle('tyres')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'tyres' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'tyres' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <Storefront sx={{ marginRight: '10px' }} />
                                TYRES
                                
                            </Typography>
                            {activeDropdown === 'tyres' && (
                                <Box mt={1}>
                                    {renderNavLink("/tyre-control", "New Tyres")}
                                    {renderNavLink("/retread-tyres-control", "Retread Tyres")}
                                    {renderNavLink("/used-tyres-control", "Used Tyres")}
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography
                                onClick={() => handleToggle('reports')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width:'150px',
                                    margin:'20px',
                                    fontWeight: 'bold',
                                    backgroundColor: activeDropdown === 'reports' ? '#4a148c' : '#f5f5f5',
                                    color: activeDropdown === 'reports' ? '#fff' : '#000',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                                }}
                            >
                                <ReceiptOutlinedIcon sx={{ marginRight: '10px' }} />
                                REPORTS
                                
                            </Typography>
                            {activeDropdown === 'reports' && (
                                <Box mt={1}>
                                    {renderNavLink("/balance-sheet", "Balance Sheet")}
                                    {renderNavLink("/trading-profit-loss-account", "Trading, Profit and Loss Account")}
                                    {renderNavLink("/cash-book", "Cash Book")}
                                    {renderNavLink("/sales-report", "Sales")}
                                    {renderNavLink("/expenses-reports", "Expenses Report")}
                                    {renderNavLink("/customer-balance-report", "Customer Balances")}
                                    {renderNavLink("/vat-payable", "Vat Payable")}
                                    {renderNavLink("/all-invoices-report", "Detailed Report")}
                                    {renderNavLink("/account-receivables-report", "Account Receivables")}
                                    {renderNavLink("/account-payables-report", "Account Payables")}
                                    {renderNavLink("/credit-notes-report", "Credit Note Report")}
                                    {renderNavLink("/payments-made-report", "Payments Made Report")}
                                    {renderNavLink("/payments-received-report", "Payments Received Report")}
                                    {renderNavLink("/pump-reports", "Pump Report")}
                                    {renderNavLink("/fuel-transactions", "Fuel Transactions")}
                                    {renderNavLink("/repairs-made", "Repairs Made")}

                                </Box>
                            )}
                        </Box>
                </Box>

                <Box>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutOutlined />}
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'error.dark',
                            },
                            '&:focus': {
                                outline: 'none',
                                boxShadow: '0 0 0 2px rgba(255, 0, 0, 0.5)',
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Box>

            </Box>
        </Box>
    );
}

export default SideBar;
