import { Box,Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "./Header";
import StatBox from "./StatBox";
import BarChartDashboard from "./BarchartDashboard";
import PieChart from "./PieChart";
import { useState, useEffect } from "react";
import { LocalGasStation } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [billTotal, setBillTotal] = useState([]);
  const [tyres, setTyres] = useState([]);
  const [spare, setSpare] = useState([]);
  const [invoiceTotal, setInvoiceTotal] = useState([]);
  const [diesel,setDiesel] = useState([])
  const [invoicesNumber, setInvoicesNumber] = useState([]);
  const [customer,setCustomer] = useState([]);
  const [vendor, setVendor] = useState([])
  const [accounts, setAccounts] = useState([]);
  const [expense, setExpense] = useState([])

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/totals')
      .then(response => response.json())
      .then(data => {
        // Convert the accumulated data into the desired format
        const formattedBill = data.map(item => ({
            account_name: item.account_name,
            amount: item.amount
          }));

        setAccounts(formattedBill);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/expenses')
      .then(response => response.json())
      .then(data => {
        const formattedBill = data.map(item => ({
          id: item.expense_name,
          value: item.expense_amount
        }));
        console.log('Formatted Pie Chart Data:', formattedBill); // Add this line
        setExpense(formattedBill);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/sparesubcategories')
      .then(response => response.json())
      .then(data => {setSpare(data)})
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/tyres')
      .then(response => response.json())
      .then(data => {setTyres(data)})
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/invoices')
      .then(response => response.json())
      .then(data => {
          const invoiceItems = data.flatMap(invoice =>
            invoice.items.map(item => ({
              ...invoice,
              ...item,
            }))
          );

          setInvoiceTotal(invoiceItems)
        setInvoicesNumber(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/newbills')
      .then(response => response.json())
      .then(data => {
        const receiptItems = data.flatMap(receipt =>
            receipt.items.map(item => ({
              ...receipt,
              ...item,
            }))
          );

          setBillTotal(receiptItems)
        setInvoicesNumber(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
 
  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/pumpnames')
      .then(response => response.json())
      .then(data => {

        const total = data.reduce((total,pump) => total + pump.litres,0)
        setDiesel(total);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const totalDiesel = new Intl.NumberFormat().format(diesel);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/invoices')
      .then(response => response.json())
      .then(data => {
        setInvoicesNumber(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/customers')
      .then(response => response.json())
      .then(data => {
        setCustomer(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('https://db-demo-u07o.onrender.com/vendors')
      .then(response => response.json())
      .then(data => {
        setVendor(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);  

  const calculateTotal = (items) => items.reduce((total, item) => total + item.amount, 0);

  const TotalRevenue =  new Intl.NumberFormat().format(calculateTotal(invoiceTotal))
  const TotalExpenses =  new Intl.NumberFormat().format(calculateTotal(billTotal))


  const navigate = useNavigate()

  const handleViewInvoices = (customerId) => {
    navigate(`/invoice`);
  }

  const handleViewDiesel = (customerId) => {
    navigate(`/fuelings`);
  }

  const handleViewCustomers = (customerId) => {
        navigate(`/customers`);
    };
  const handleViewVendors = (customerId) => {
        navigate(`/vendors`);
    };

    const columns = [
        {
          field: "spare_subcategory_name",
          headerName: "SPARE NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.4,
          align: "left",
        },
        {
          field: "quantity",
          headerName: "QUANTITY",
          flex: 0.2,
        },
    ];

    const tyre = [
        {
          field: "item_details",
          headerName: "ITEM",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
        },
        {
          field: "size",
          headerName: "TYRE SIZE",
          flex: 0.2,
        },
        {
          field: "quantity",
          headerName: "QUANTITY",
          flex: 0.1,
        },
    ];
  
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        marginRight='20px'
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          onClick={handleViewDiesel}
          borderRadius='10px'
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title= {totalDiesel}
            subtitle="DIESEL"
            // progress="0.75"
            // increase="+14%"
            icon={
              <LocalGasStation
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius='10px'
          display="flex"
          alignItems="center"
          onClick = {handleViewInvoices}
          justifyContent="center"
        >
          <StatBox
            title={invoicesNumber}
            subtitle="INVOICES"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], variant:'h4' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius='10px'
          display="flex"
          alignItems="center"
          onClick = {handleViewCustomers}
          justifyContent="center"
        >
          <StatBox
            title={customer}
            subtitle="CUSTOMERS"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius='10px'
          onClick = {handleViewVendors}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={vendor}
            subtitle="VENDORS"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 7"
          borderRadius='10px'
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        //   height='400px'
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ${TotalRevenue}
              </Typography>
            </Box>
          </Box>
          <Box height="250px" ml='30px' >
            <BarChartDashboard chartdata={accounts} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          borderRadius='10px'
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        //   height='400px'
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Expenses
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ${TotalExpenses}
              </Typography>
            </Box>
          </Box>
          <Box height="250px" ml='30px' >
              <PieChart chartdata={expense} isDashboard={true} />
          </Box>
        </Box>

        

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          borderRadius='10px'
          backgroundColor={colors.primary[400]}
          p="30px"
        //   height='500px'
        >
          <Typography variant="h5" fontWeight="600">
            Spares
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Box m="20px">
                <Box
                    // m="40px 0 0 0"
                    height="55vh"
                    sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        // fontSize: "16px",  // Increase the font size of the data
                    },
                    "& .name-column--cell": {
                        // color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        // fontSize: "16px",  // Increase the font size of the header
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
                    rows={spare}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => `${row.item_details}-${row.quantity}`}
                    />
                </Box>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          borderRadius='10px'
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
           Tyres
          </Typography>
          <Box height="250px" mt="-20px">
          <Box m="20px">
                <Box
                    m="40px 0 0 0"
                    height="55vh"
                    sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        // fontSize: "16px",  // Increase the font size of the data
                    },
                    "& .name-column--cell": {
                        // color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        // fontSize: "16px",  // Increase the font size of the header
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
                    rows={tyres}
                    columns={tyre}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => `${row.item_details}-${row.quantity}`}
                    />
                </Box>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          padding="30px"
        //   height='500px'
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
