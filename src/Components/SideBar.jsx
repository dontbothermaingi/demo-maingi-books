import { useState } from "react";
import { Sidebar } from "react-pro-sidebar";
import { Box, Button, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
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
            <Box display='flex' flexDirection='row' gap='10px' marginLeft='55px' alignItems='center'>
                <Typography variant="body2">{label}</Typography>
            </Box>
        </NavLink>
    );

    const navigate = useNavigate()

    function handleLogout() {
        fetch("https://db-demo-u07o.onrender.com/logout", {
          method: "DELETE",
        }).then(() => onLogout());
        navigate('/login');
      }

    return (
        <Box className="fullHeight">
            <Sidebar
                width="250px"
                backgroundColor="rgb(240, 240, 240)"
                className="sidebar"
                collapsed={false}
            >
                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('dashboard')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'dashboard' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <HomeOutlinedIcon sx={{ marginRight: '10px' }} />
                        DASHBOARD
                        {activeDropdown === 'dashboard' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'dashboard' && (
                        <Box mt={1}>
                            {renderNavLink("/", "Dashboard")}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('trucks')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'trucks' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <LocalShippingOutlinedIcon sx={{ marginRight: '10px' }} />
                            VEHICLES
                        {activeDropdown === 'trucks' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'trucks' && (
                        <Box mt={1}>
                            {renderNavLink("/trucks", "Vehicles")}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('sales')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'sales' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <PeopleOutlinedIcon sx={{ marginRight: '10px' }} />
                        SALES
                        {activeDropdown === 'sales' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
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

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('purchases')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'purchases' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <RequestQuoteIcon sx={{ marginRight: '10px' }} />
                        PURCHASES
                        {activeDropdown === 'purchases' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'purchases' && (
                        <Box mt={1}>
                            {renderNavLink("/vendors", "Vendors")}
                            {renderNavLink("/bill", "Bill")}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('banking')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'banking' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <RequestQuoteIcon sx={{ marginRight: '10px' }} />
                        BANKING
                        {activeDropdown === 'banking' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'banking' && (
                        <Box mt={1}>
                            {renderNavLink("/banking", "Banking")}
                            {renderNavLink("/payments-received", "Payments Received")}
                            {renderNavLink("/payments-made", "Payments Made")}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('diesel')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'diesel' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <LocalGasStation sx={{ marginRight: '10px' }} />
                        FUEL PUMP
                        {activeDropdown === 'diesel' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'diesel' && (
                        <Box mt={1}>
                            {renderNavLink("/fuel-control", "Your Pumps")}
                            {/* {renderNavLink("/pump-b", "Pump B")} */}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('spares')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'spares' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <Build sx={{ marginRight: '10px' }} />
                        SPARES
                        {activeDropdown === 'spares' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'spares' && (
                        <Box mt={1}>
                            {renderNavLink("/spares", "Spares")}
                            {renderNavLink("/vehicle-repair", "Vehicle Repair")}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('stock')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'stock' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <Inventory sx={{ marginRight: '10px' }} />
                        STOCK
                        {activeDropdown === 'stock' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'stock' && (
                        <Box mt={1}>
                            {renderNavLink("/stock-items", "Stock")}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('tyres')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'tyres' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                        }}
                    >
                        <Storefront sx={{ marginRight: '10px' }} />
                        TYRES
                        {activeDropdown === 'tyres' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
                    </Typography>
                    {activeDropdown === 'tyres' && (
                        <Box mt={1}>
                            {renderNavLink("/tyre-control", "New Tyres")}
                            {renderNavLink("/retread-tyres-control", "Retread Tyres")}
                            {renderNavLink("/used-tyres-control", "Used Tyres")}
                        </Box>
                    )}
                </Box>

                <Box p={2}>
                    <Typography
                        onClick={() => handleToggle('reports')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: activeDropdown === 'reports' ? '#1976d2' : 'black',
                            transition: 'color 0.3s',
                            backgroundColor: activeDropdown === 'reports' ? '#e0e0e0' : 'transparent',
                            borderRadius: '4px',
                            // padding: '8px',
                        }}
                    >
                        <ReceiptOutlinedIcon sx={{ marginRight: '10px' }} />
                        REPORTS
                        {activeDropdown === 'reports' ? (
                            <ArrowDropUpOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        ) : (
                            <ArrowDropDownOutlinedIcon sx={{ marginLeft: 'auto' }} />
                        )}
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

                <Box p={2} mt="auto" mb={2}>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutOutlined />}
                        fullWidth
                        onClick={handleLogout}
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

            </Sidebar>
        </Box>
    );
}

export default SideBar;
