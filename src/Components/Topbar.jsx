import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, InputBase, Drawer, List,useMediaQuery, Button, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import LocalGasStation from '@mui/icons-material/LocalGasStation';
import Build from '@mui/icons-material/Build';
import Inventory from '@mui/icons-material/Inventory';
import Storefront from '@mui/icons-material/Storefront';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';

function TopBar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const access_token = localStorage.getItem('access_token')

  useEffect(() => {
      fetch('https://demo-server-757m.onrender.com/check_session', {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Authorization': `Bearer ${access_token}`
          }
      })
      .then(response => {
          if (response.status === 401) {
              navigate('/login');
          } else if (response.ok) {
              return response.json();  // Fixed this line to call .json() as a method
          }
      })
      .then(data => {
          if (data) {  // Check if data is received
              setIsAuthenticated(true);
          }
      })
      .catch(error => {
          console.error('Error fetching session:', error);
      });
  }, [navigate, access_token]);


  const handleToggle = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  function closeDrawer(){
    setDrawerOpen(false)
  }

  const handleUserEdit = () => {
    navigate('/user-accounts')
  };

  const handleDashboard = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };


  const renderNavLink = (to, label) => (
    <NavLink
      exact
      to={to}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <ListItemButton onClick={closeDrawer}>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontFamily: 'GT Light', fontSize: '12px' }}
        />
      </ListItemButton>
    </NavLink>
  );
  

  return (
    <Box>
      <Box>
        {isMobile ? (
          <Box display="flex" justifyContent="space-between" p={2} alignItems={'center'}>

            <Box>
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box>
              <Typography onClick={handleDashboard} fontWeight="bold" fontSize="20px" ml={2}>
                MAINGI BOOKS
              </Typography>
            </Box>

            <Box>
              {isAuthenticated ? (
                <IconButton sx={{ color: 'black' }} onClick={handleUserEdit}>
                    <PersonOutlinedIcon />
                </IconButton>
              ):(
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={handleLogin}
                >
                  LOGIN
                </Button>
              )}
            </Box>
           
          </Box>
        ) : (
          <>
          <Box display={'flex'} justifyContent="space-between" p={2}>
            <Box display="flex" backgroundColor="#f2f0f0" borderRadius="3px">
              <InputBase sx={{ ml: 2, flex: 1, color: 'black' }} placeholder="Search" />
              <IconButton type="button" sx={{ p: 1, color: 'black' }}>
                <SearchIcon />
              </IconButton>
            </Box>

            <Box>
              <Typography fontWeight="bold" fontSize="30px">MAINGI BOOKS</Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <IconButton sx={{ color: 'black' }}>
                <NotificationsOutlinedIcon />
              </IconButton>
              <IconButton sx={{ color: 'black' }}>
                <SettingsOutlinedIcon />
              </IconButton>
              <IconButton sx={{ color: 'black' }} onClick={handleUserEdit}>
                <PersonOutlinedIcon />
              </IconButton>
            </Box>

            </Box>
          </>
        )}
        
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <List sx={{ overflow: 'auto' }}>
              {[
                  { id: 'dashboard', icon: <HomeOutlinedIcon />, label: 'DASHBOARD', links: [{ path: "/", label: "Dashboard" }] },
                  { id: 'trucks', icon: <LocalShippingOutlinedIcon />, label: 'VEHICLES', links: [{ path: "/trucks", label: "Vehicles" },{path:"/truck-invoices", label:'Fuel Report'}] },
                  { id: 'sales', icon: <PeopleOutlinedIcon />, label: 'SALES', links: [{ path: "/customers", label: "Customers" }, { path: "/invoice", label: "Invoices" }, { path: "/credit-note", label: "Credit Note" }, { path: "/quotes", label: "Quote" }, { path: "/delivery-notes", label: "Delivery Note" }] },
                  { id: 'purchases', icon: <RequestQuoteIcon />, label: 'PURCHASES', links: [{ path: "/vendors", label: "Vendors" }, { path: "/bill", label: "Bill" }] },
                  { id: 'banking', icon: <RequestQuoteIcon />, label: 'BANKING', links: [{ path: "/banking", label: "Banking" }, { path: "/payments-received", label: "Payments Received" }, { path: "/payments-made", label: "Payments Made" }] },
                  { id: 'diesel', icon: <LocalGasStation />, label: 'FUEL PUMP', links: [{ path: "/fuel-control", label: "Your Pumps" }] },
                  { id: 'spares', icon: <Build />, label: 'SPARES', links: [{ path: "/spares", label: "Spares" }, { path: "/vehicle-repair", label: "Vehicle Repair" }] },
                  { id: 'stock', icon: <Inventory />, label: 'STOCK', links: [{ path: "/stock-items", label: "Stock" }] },
                  { id: 'tyres', icon: <Storefront />, label: 'TYRES', links: [{ path: "/tyre-control", label: "New Tyres" }, { path: "/retread-tyres-control", label: "Retread Tyres" }, { path: "/used-tyres-control", label: "Used Tyres" }] },
                  { id: 'reports', icon: <ReceiptOutlinedIcon />, label: 'REPORTS', links: [{ path: "/balance-sheet", label: "Balance Sheet" }, { path: "/trading-profit-loss-account", label: "Trading, Profit and Loss Account" }, { path: "/cash-book", label: "Cash Book" }, { path: "/sales-report", label: "Sales" }, { path: "/expenses-reports", label: "Expenses Report" }, { path: "/vat-payable", label: "Vat Payable" }, { path: "/all-invoices-report", label: "Detailed Report" }, { path: "/account-receivables-report", label: "Account Receivables" }, { path: "/account-payables-report", label: "Account Payables" }, { path: "/credit-notes-report", label: "Credit Note Report" }, { path: "/payments-made-report", label: "Payments Made Report" }, { path: "/payments-received-report", label: "Payments Received Report" }, { path: "/pump-reports", label: "Pump Report" }, {path:"/truck-invoices", label:'Fuel Report'}, { path: "/fuel-transactions", label: "Fuel Transactions" }, { path: "/repairs-made", label: "Repairs Made" }] }
              ].map((item) => (
                  <Box key={item.id}>
                      <Typography
                          onClick={() => handleToggle(item.id)}
                          sx={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              fontFamily:'GT Regular',
                              width:'150px',
                              margin:'20px',
                              fontWeight: 'bold',
                              backgroundColor: activeDropdown === item.id ? '#4a148c' : 'white',
                              color: activeDropdown === item.id ? '#fff' : '#000',
                              borderRadius: '8px',
                              padding: '10px',
                              transition: 'all 0.3s',
                              '&:hover': { backgroundColor: '#7e57c2', color: '#fff' }
                          }}
                      >
                          {item.icon}
                          <span style={{ marginLeft: '10px' }}>{item.label}</span>
                      </Typography>
                      {activeDropdown === item.id && (
                          <Box sx={{ marginLeft: '20px' }}>
                              {item.links.map((link, index) => (
                                  renderNavLink(link.path, link.label, index)
                              ))}
                          </Box>
                      )}
                  </Box>
              ))}
          </List>
      </Drawer>

    </Box>
  );
}

export default TopBar;
