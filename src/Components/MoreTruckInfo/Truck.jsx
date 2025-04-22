import { Typography, Box, useTheme, Button, Divider, useMediaQuery, Card, CardContent, Pagination } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRef, useState } from "react";
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";

function TruckReport ({
  expenseTotal,
  newtyresitems,
  sparesTotal,
  retreadTotal,
  invoiceTotal,
  invoiceItems,
  retreadItems,
  spareitems,
  dieselitems,
  dieselTotal,
  billItems,
  title,
  billTotal,
  barchart,
  barchartretread,
  barchartreceipts,
  barchartbills,
  vehicleType,
  manufacturer,
  trailer,
}) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const componentRef = useRef();
  const [selectedMenuItem, setSelectedMenuItem] = useState('Finacial Overviewer');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeDropdown, setActiveDropdown] = useState('Finacial Overview');

  const [currentNewPage, setCurrentNewPage] = useState(1)
  const [currentRetreadPage, setCurrentRetreadPage] = useState(1)
  const [currentFuelPage, setCurrentFuelPage] = useState(1)
  const [currentRepairPage, setCurrentRepairPage] = useState(1)
  const [currentFuelBillPage, setCurrentFuelBillPage] = useState(1)
  const [currentInvoicePage, setCurrentInvoicePage] = useState(1)


  const itemsPerPage = 16;

  const handleToggle = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

  const formattedSpares = new Intl.NumberFormat().format(sparesTotal);
  const formattedExpense = new Intl.NumberFormat().format(expenseTotal);
  const formattedRetread = new Intl.NumberFormat().format(retreadTotal);
  const formattedDiesel = new Intl.NumberFormat().format(dieselTotal);
  const formattedBill = new Intl.NumberFormat().format(billTotal);
  const formatted = new Intl.NumberFormat().format(invoiceTotal);
  const total = dieselTotal + billTotal
  const formatedTotal = new Intl.NumberFormat().format(total)


  const allExpenses = sparesTotal + expenseTotal + retreadTotal + dieselTotal + billTotal
  const allSales = invoiceTotal


  const formattedAllExpenses = new Intl.NumberFormat().format(allExpenses);
  const formattedAllSales = new Intl.NumberFormat().format(allSales);


  const navigate = useNavigate()

  const handleViewInvoices = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`)
  }

  const handleViewDetails = (billId) => {
    navigate(`/newbills/${billId}`);
  };

  const invoices = [
    { field: "customer_name", headerName: "Customer Name", flex: 0.3,
    renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_id)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ),
   },
    { field: "invoice_number", headerName: "Invoice Number", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "consignee", headerName: "Consignee", flex: 0.3, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "invoice_date", headerName: "Invoice Date", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "item_details", headerName: "ITEM", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "description", headerName: "DESCRIPTION", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "quantity", headerName: "TRIPS", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "rate", headerName: "RATE", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "vat", headerName: "VAT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
    { field: "amount", headerName: "AMOUNT", flex: 0.2, renderCell: (params) => (
      <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer', 
      }}
      onClick={() => handleViewInvoices(params.row.invoice_number)}
    >
      <Typography
          variant="h7"
      >
        {params.value}
      </Typography>
    </Box>
    ), },
  ];

  const billcolumns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
      field: "bill_number",
      headerName: "Bill Number",
      flex: 0.3,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
      field: "bill_date",
      headerName: "Bill Date",
      flex: 0.4,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
      field: "payment_terms",
      headerName: "Payment Terms",
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
        }}
        onClick={() => handleViewDetails(params.row.bill_number)}
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
        field: "status",
        headerName: "Status",
        flex: 0.5,
        renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
        field: "amount",
        headerName: "Amount",
        flex: 0.5,
        renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
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
        field: "due_date",
        headerName: "Due Date",
        flex: 0.5,
        renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.bill_number)}
          >
            <Typography
                variant="h7"
            >
              {params.value}
            </Typography>
          </Box>
          ),
      },
  ] 
  
    const newtyres = [
        // { field: "id", headerName: "ID" },
        {
          field: "item_details",
          headerName: "Name",
          flex: 0.3,
          cellClassName: "name-column--cell",
        },
        {
          field: "serial_number",
          headerName: "Serial Number",
          flex: 0.3
        },
        {
          field: "size",
          headerName: "Size",
          flex: 0.2,
        },
        {
          field: "position",
          headerName: "Position",
          flex: 0.3,
        },
        {
          field: "status",
          headerName: "Status",
          flex: 0.2,
        },
        {
            field: "date",
            headerName: "Fitment Date",
            flex: 0.5,
          },
      ];

      const diesela = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "pump_name",
            headerName: "Pump Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "truck_number",
            headerName: "Truck Number",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "litres",
            headerName: "Litres",
            flex: 1,
        },
        {
            field: "reading",
            headerName: "Reading",
            flex: 1,
        },
        {
          field: "order",
          headerName: "Order",
          flex: 1,
      },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];
      
      const retreadtyres = [
        // { field: "id", headerName: "ID" },
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "serial_number",
          headerName: "Serial Number",
          flex: 1,
        },
        {
          field: "size",
          headerName: "Size",
          flex: 1,
        },
        {
          field: "position",
          headerName: "Position",
          flex: 1,
        },
        {
          field: "status",
          headerName: "Status",
          flex: 1,
        },
        {
            field: "date",
            headerName: "Fitment Date",
            flex: 1,
          },
      ];

      const spare = [
      //   {
      //     field: "truck_number",
      //     headerName: "VEHICLE NUMBER",
      //     headerAlign: "left",
      //     cellClassName: "name-column--cell",
      //     flex: 0.2,
      //     align: "left",
      // },
      // {
      //     field: "vehicle_type",
      //     headerName: "VEHICLE TYPE",
      //     headerAlign: "left",
      //     cellClassName: "name-column--cell",
      //     flex: 0.23,
      //     align: "left",
      // },
      {
          field: "manufacturer",
          headerName: "MANUFACTURER",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
          field: "job_description",
          headerName: "JOB DESCRIPTION",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.2,
          align: "left",
      },
      {
        field: "spare_subcategory_name",
        headerName: "SPARE NAME",
        headerAlign: "left",
        cellClassName: "name-column--cell",
        flex: 0.2,
        align: "left",
      },
      {
          field: "mechanic",
          headerName: "MECHANIC",
          flex: 0.15,
      },
      {
        field: "quantity",
        headerName: "QUANTITY",
        flex: 0.15,
      },
      ];

      const totalPages = Math.ceil(newtyresitems.length / itemsPerPage)
      const displayedItems = newtyresitems.slice((currentNewPage - 1) * itemsPerPage, currentNewPage * itemsPerPage)

      const totalRetreadPages = Math.ceil(retreadItems.length / itemsPerPage)
      const displayedRetreadItems = retreadItems.slice((currentRetreadPage - 1) * itemsPerPage, currentRetreadPage * itemsPerPage)

      const totalSparePages = Math.ceil(spareitems.length / itemsPerPage)
      const displayedSpareItems = spareitems.slice((currentRepairPage - 1) * itemsPerPage, currentRepairPage * itemsPerPage)

      const totalFuelPages = Math.ceil(dieselitems.length / itemsPerPage)
      const displayedFuelItems = dieselitems.slice((currentFuelPage - 1) * itemsPerPage, currentFuelPage * itemsPerPage)

      const totalInvoicePages = Math.ceil(invoiceItems.length / itemsPerPage)
      const displayedInvoiceItems = invoiceItems.slice((currentInvoicePage - 1) * itemsPerPage, currentInvoicePage * itemsPerPage)

      const totalFuelBillPages = Math.ceil(billItems.length / itemsPerPage)
      const displayedFuelBillItems = billItems.slice((currentFuelBillPage - 1) * itemsPerPage, currentFuelBillPage * itemsPerPage)
  
      const handleNewPageChange = (event, value) => {
          setCurrentNewPage(value);
      };

      const handleRetreadPageChange = (event, value) => {
        setCurrentRetreadPage(value);
      };

      const handleFuelPageChange = (event, value) => {
        setCurrentFuelPage(value);
      };

      const handleRepairPageChange = (event, value) => {
        setCurrentRepairPage(value);
      };

      const handleFuelBillPageChange = (event, value) => {
        setCurrentFuelBillPage(value);
      };

      const handleInvoicePageChange = (event, value) => {
        setCurrentInvoicePage(value);
      };

      function renderAccountType(){
        switch(selectedMenuItem){
          case 'Finacial Overviewer':
            return (

              <Box>
                <Divider orientation="horizontal" sx={{margin:'20px'}}/>
                <Box display="flex" flexDirection="column" alignItems="center" sx={{ p: 3, } }>
                      {/* Main Title */}
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                        Financial Overview
                      </Typography>

                      {/* Container for Both Sides */}
                      <Box display="flex" flexDirection={{xs:'column', md:'row'}} alignItems="flex-start" gap={'30px'}>
                        
                        {/* Left Side - Expenses */}
                        <Card sx={{ flex: 1, p: 2, width:'250px'}}>
                          {/* Title for Expenses Section */}
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Expenses
                          </Typography>

                          <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Diesel</Typography>
                            <Typography variant="subtitle1">{formatedTotal}</Typography>
                          </Box>

                          <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">New Tyres</Typography>
                            <Typography variant="subtitle1">{formattedExpense}</Typography>
                          </Box>

                          <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Retread Tyres</Typography>
                            <Typography variant="subtitle1">{formattedRetread}</Typography>
                          </Box>

                          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Spares</Typography>
                            <Typography variant="subtitle1">{formattedSpares}</Typography>
                          </Box>

                          {/* Total for Expenses */}
                          <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: '1px solid grey' }}>
                            <Typography variant="subtitle1" fontWeight="bold">Total Expenses</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{formattedAllExpenses}</Typography>
                          </Box>
                        </Card>

                        {/* Vertical Divider */}
                        <Divider orientation="vertical" flexItem sx={{ mx: 2, borderRightWidth: 2 }} />

                      {/* Right Side - Sales */}
                      <Card sx={{ flex: 1, p: 2, width:'250px' }}>
                        {/* Title for Sales Section */}
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                          Sales
                        </Typography>

                        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">Sales</Typography>
                          <Typography variant="subtitle1">{formatted}</Typography>
                        </Box>

                        {/* Total for Sales */}
                        <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: '1px solid grey' }}>
                          <Typography variant="subtitle1" fontWeight="bold">Total Sales</Typography>
                          <Typography variant="subtitle1" fontWeight="bold">{formattedAllSales}</Typography>
                        </Box>
                      </Card>
                    </Box>
                </Box>
              </Box>
            )
          case 'Ftted New Tyres':
            return (
              <Box overflow={'auto'}>

                      <Divider orientation="horizontal" sx={{margin:'20px'}}/>

                      <Box
                                    display={'grid'}
                                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
                                    gap="10px"
                                    margin="0 10px"
                                >

                                    {displayedItems.map((item) => (
                                        <Card
                                            key={item.id}
                                            sx={{
                                                borderRadius: '15px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: 'auto', // Adjust height for better flexibility
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                padding: '10px',
                                                backgroundColor: '#fff',
                                                transition: 'transform 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.03)',
                                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Tyre Name:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.item_details}</Typography>
                                                    </Box>

                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Size:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.size}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Truck Number:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.truck_number}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Serial Number:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.serial_number}</Typography>
                                                    </Box>
                                                        
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Position:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.position}</Typography>
                                                    </Box>
                                                    
                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Status:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.status}</Typography>
                                                    </Box>
                                                    

                                                    <Box display={'flex'} gap={'7px'}>
                                                        <Typography>Date:</Typography>
                                                        <Typography fontWeight={'bold'}>{item.date}</Typography>
                                                    </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Box display="flex" justifyContent="center" mt="20px">
                                            <Pagination count={totalPages} page={currentNewPage} onChange={handleNewPageChange} color="secondary" />
                                    </Box>
                      </Box>

                      <Typography variant="h6" color="black" fontWeight="bold" m="20px" textAlign={'center'}>
                                  Total New Tyre Expense: {formattedExpense}
                      </Typography>
              </Box>
            )
          case 'Fitted Retread Tyres':
            return (

              <Box overflow={'auto'}>
                      <Divider orientation="horizontal" sx={{margin:'20px'}}/>

                      <Box
                                          display={'grid'}
                                          gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
                                          gap="10px"
                                          margin="0 10px"
                                      >

                                          {displayedRetreadItems.map((item) => (
                                              <Card
                                                  key={item.id}
                                                  sx={{
                                                      borderRadius: '15px',
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      height: 'auto', // Adjust height for better flexibility
                                                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                      padding: '10px',
                                                      backgroundColor: '#fff',
                                                      transition: 'transform 0.3s ease-in-out',
                                                      '&:hover': {
                                                          transform: 'scale(1.03)',
                                                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                      },
                                                  }}
                                              >
                                                  <CardContent>
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Tyre Name:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.name}</Typography>
                                                          </Box>

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Size:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.size}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Truck Number:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.truck_number}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Serial Number:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.serial_number}</Typography>
                                                          </Box>
                                                              
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Position:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.position}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Status:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.status}</Typography>
                                                          </Box>
                                                          

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Date:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.date}</Typography>
                                                          </Box>
                                                  </CardContent>
                                              </Card>
                                          ))}
                                          <Box display="flex" justifyContent="center" mt="20px">
                                                  <Pagination count={totalRetreadPages} page={currentRetreadPage} onChange={handleRetreadPageChange} color="secondary" />
                                          </Box>
                      </Box>

                      <Typography variant="h6" color="black" fontWeight="bold" m="20px" textAlign={'center'}>
                          Total Retread Tyres: {formattedRetread}
                      </Typography>
              </Box>
            )
          case 'Repairs':
            return (

              <Box overflow={'auto'}>

                  <Divider orientation="horizontal" sx={{margin:'20px'}}/>

                  <Box
                                          display={'grid'}
                                          gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
                                          gap="10px"
                                          margin="0 10px"
                                      >

                                          {displayedSpareItems.map((item) => (
                                              <Card
                                                  key={item.id}
                                                  sx={{
                                                      borderRadius: '15px',
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      height: 'auto', // Adjust height for better flexibility
                                                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                      padding: '10px',
                                                      backgroundColor: '#fff',
                                                      transition: 'transform 0.3s ease-in-out',
                                                      '&:hover': {
                                                          transform: 'scale(1.03)',
                                                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                      },
                                                  }}
                                              >
                                                  <CardContent>
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Manufacturer:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.manufacturer}</Typography>
                                                          </Box>

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Job Descrption:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.job_description}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Spare Name:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.spare_subcategory_name}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Mechanic:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.mechanic}</Typography>
                                                          </Box>
                                                              
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Quantity:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.quantity}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Status:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.status}</Typography>
                                                          </Box>
                                                          

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Date:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.date}</Typography>
                                                          </Box>
                                                  </CardContent>
                                              </Card>
                                          ))}
                                          <Box display="flex" justifyContent="center" mt="20px">
                                                  <Pagination count={totalSparePages} page={currentRepairPage} onChange={handleRepairPageChange} color="secondary" />
                                          </Box>
                  </Box>

                  <Typography variant="h6" color="black" fontWeight="bold" m="20px" textAlign={'center'}>
                        Total Spare Expenses: {formattedSpares}
                  </Typography>

              </Box>
            )
          case 'Fuel Transactions':
            return (

              <Box overflow={'auto'}>
                  <Divider orientation="horizontal" sx={{margin:'20px'}}/>
                  
                  <Box
                                          display={'grid'}
                                          gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
                                          gap="10px"
                                          margin="0 10px"
                                      >

                                          {displayedFuelItems.map((item) => (
                                              <Card
                                                  key={item.id}
                                                  sx={{
                                                      borderRadius: '15px',
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      height: 'auto', // Adjust height for better flexibility
                                                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                      padding: '10px',
                                                      backgroundColor: '#fff',
                                                      transition: 'transform 0.3s ease-in-out',
                                                      '&:hover': {
                                                          transform: 'scale(1.03)',
                                                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                      },
                                                  }}
                                              >
                                                  <CardContent>
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Pump Name:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.pump_name}</Typography>
                                                          </Box>

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Truck Number:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.truck_number}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Litres:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.litres}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Reading:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.reading}</Typography>
                                                          </Box>
                                                              
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Order:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.order}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Date:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.date}</Typography>
                                                          </Box>

                                                  </CardContent>
                                              </Card>
                                          ))}
                                          <Box display="flex" justifyContent="center" mt="20px">
                                                  <Pagination count={totalFuelPages} page={currentFuelPage} onChange={handleFuelPageChange} color="secondary" />
                                          </Box>
                  </Box>

                  <Typography variant="h6" color="black" fontWeight="bold" m="20px" textAlign={'center'}>
                        Total Diesel Expenses: {formattedDiesel}
                  </Typography>

              </Box>
            )
          case 'Invoices':
            return (

              <Box overflow={'auto'}>

                  <Divider orientation="horizontal" sx={{margin:'20px'}}/>

                  <Box
                                          display={'grid'}
                                          gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
                                          gap="10px"
                                          margin="0 10px"
                                      >

                                          {displayedInvoiceItems.map((item) => (
                                              <Card
                                                  key={item.id}
                                                  onClick={() => handleViewInvoices(item.invoice_number)}
                                                  sx={{
                                                      borderRadius: '15px',
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      height: 'auto', // Adjust height for better flexibility
                                                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                      padding: '10px',
                                                      backgroundColor: '#fff',
                                                      transition: 'transform 0.3s ease-in-out',
                                                      '&:hover': {
                                                          transform: 'scale(1.03)',
                                                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                      },
                                                  }}
                                              >
                                                  <CardContent>
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Customer Name:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.customer_name}</Typography>
                                                          </Box>

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Invoice Number:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.invoice_number}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Date:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.invoice_date}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Item Details:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.item_details}</Typography>
                                                          </Box>
                                                              
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Description:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.description}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Amount:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.amount}</Typography>
                                                          </Box>

                                                  </CardContent>
                                              </Card>
                                          ))}
                                          <Box display="flex" justifyContent="center" mt="20px">
                                                  <Pagination count={totalInvoicePages} page={currentInvoicePage} onChange={handleInvoicePageChange} color="secondary" />
                                          </Box>
                  </Box>

                  <Typography variant="h6" color="black" fontWeight="bold" m="20px" textAlign={'center'}>
                      Total Sales: {formatted}
                  </Typography>
              </Box>
            )
          case 'Fuel Bills':
            return (
              <Box overflow={'auto'}>

                  <Divider orientation="horizontal" sx={{margin:'20px'}}/>

                  <Box
                                          display={'grid'}
                                          gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(1,1fr)'}}
                                          gap="10px"
                                          margin="0 10px"
                                      >

                                          {displayedFuelBillItems.map((item) => (
                                              <Card
                                                  key={item.id}
                                                  onClick={() => handleViewDetails(item.bill_number)}
                                                  sx={{
                                                      borderRadius: '15px',
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      height: 'auto', // Adjust height for better flexibility
                                                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                      padding: '10px',
                                                      backgroundColor: '#fff',
                                                      transition: 'transform 0.3s ease-in-out',
                                                      '&:hover': {
                                                          transform: 'scale(1.03)',
                                                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                      },
                                                  }}
                                              >
                                                  <CardContent>
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Vendor Name:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.vendor_name}</Typography>
                                                          </Box>

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Bill Number:</Typography>
                                                              <Typography fontWeight={'bold'}>#{item.bill_number}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Status:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.status}</Typography>
                                                          </Box>

                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Date:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.bill_date}</Typography>
                                                          </Box>
                                                          
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Amount:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.amount}</Typography>
                                                          </Box>
                                                              
                                                          <Box display={'flex'} gap={'7px'}>
                                                              <Typography>Due Date:</Typography>
                                                              <Typography fontWeight={'bold'}>{item.due_date}</Typography>
                                                          </Box>
                                                          
                                                      
                                                  </CardContent>
                                              </Card>
                                          ))}
                                          <Box display="flex" justifyContent="center" mt="20px">
                                                  <Pagination count={totalFuelBillPages} page={currentFuelBillPage} onChange={handleFuelBillPageChange} color="secondary" />
                                          </Box>
                  </Box>

                  <Typography variant="h6" color="black" fontWeight="bold" m="20px" textAlign={'center'}>
                        Total Bill: {formattedBill}
                  </Typography>
              </Box>
            )
          
          default:
            return null;

          
        }
      }

    return ( 
        <Box>

          {isMobile ? (
            <Box>

              <Box display="flex" justifyContent="center" flexDirection='column' alignItems='center' mb='30px'>
                      <Box>
                          <Typography fontSize={{md:'35px', xs:'24px'}} color="black" ml="23px" mt="9px" fontFamily={"GT Bold"} style={{ textDecoration: 'underline' }} >
                            {manufacturer}
                          </Typography>
                      </Box>

                      <Box>
                          <Typography fontSize={{md:'27px', xs:'20px'}} color="black" ml="23px" mt="9px" fontWeight="bold" >
                            {vehicleType}
                          </Typography>
                      </Box>

                      <Box>
                          <Typography fontSize={{md:'27px', xs:'20px'}}  color="black" ml="23px" mt="9px" fontWeight="bold">
                            {title} / {trailer}
                          </Typography>
                      </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: "8px",
                  border: '1px solid #ccc'
                }}  
                display='flex' 
                flexDirection={'column'} 
                padding='10px' 
                mb={'20px'}
                mt={'20px'}
                overflow={'auto'}
              
              >
                <Box
                    onClick={() => handleToggle('Finacial Overview')}
                    
                >
                  <Typography 
                       onClick={() => setSelectedMenuItem('Finacial Overviewer')} 
                       fontWeight={'bold'}
                       fontSize={'20px'}
                       textAlign={'center'}
                  >
                    Financial Overview
                  </Typography>

                </Box>
                <Box>
                  {activeDropdown === 'Finacial Overview' && (
                    renderAccountType()
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: "8px",
                  border: '1px solid #ccc'
                }}  
                display='flex' 
                flexDirection={'column'} 
                padding='10px' 
                mb={'20px'}
                overflow={'auto'}
              
              >
                <Box
                    onClick={() => handleToggle('Ftted New Tyres')}
                    
                >
                  <Typography 
                       onClick={() => setSelectedMenuItem('Ftted New Tyres')} 
                       fontWeight={'bold'}
                       fontSize={'20px'}
                       textAlign={'center'}
                  >
                    Fitted New Tyres
                  </Typography>

                </Box>
                <Box>
                  {activeDropdown === 'Ftted New Tyres' && (
                    renderAccountType()
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: "8px",
                  border: '1px solid #ccc'
                }}  
                display='flex' 
                flexDirection={'column'} 
                padding='10px' 
                mb={'20px'}
                overflow={'auto'}
              
              >
                <Box
                    onClick={() => handleToggle('Fitted Retread Tyres')}
                    
                >
                  <Typography 
                       onClick={() => setSelectedMenuItem('Fitted Retread Tyres')} 
                       fontWeight={'bold'}
                       fontSize={'20px'}
                       textAlign={'center'}
                  >
                    Fitted Retread Tyres
                  </Typography>

                </Box>
                <Box>
                  {activeDropdown === 'Fitted Retread Tyres' && (
                    renderAccountType()
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: "8px",
                  border: '1px solid #ccc'
                }}  
                display='flex' 
                flexDirection={'column'} 
                padding='10px' 
                mb={'20px'}
                overflow={'auto'}
              
              >
                <Box
                    onClick={() => handleToggle('Repairs')}
                    
                >
                  <Typography 
                       onClick={() => setSelectedMenuItem('Repairs')} 
                       fontWeight={'bold'}
                       fontSize={'20px'}
                       textAlign={'center'}
                  >
                    Repairs
                  </Typography>

                </Box>
                <Box>
                  {activeDropdown === 'Repairs' && (
                    renderAccountType()
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: "8px",
                  border: '1px solid #ccc'
                }}  
                display='flex' 
                flexDirection={'column'} 
                padding='10px' 
                mb={'20px'}
                overflow={'auto'}
              
              >
                <Box
                    onClick={() => handleToggle('Fuel Transactions')}
                    
                >
                  <Typography 
                       onClick={() => setSelectedMenuItem('Fuel Transactions')} 
                       fontWeight={'bold'}
                       fontSize={'20px'}
                       textAlign={'center'}
                  >
                    Fuel Transactions
                  </Typography>

                </Box>
                <Box>
                  {activeDropdown === 'Fuel Transactions' && (
                    renderAccountType()
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: "8px",
                  border: '1px solid #ccc'
                }}  
                display='flex' 
                flexDirection={'column'} 
                padding='10px' 
                mb={'20px'}
                overflow={'auto'}
              
              >
                <Box
                    onClick={() => handleToggle('Invoices')}
                    
                >
                  <Typography 
                       onClick={() => setSelectedMenuItem('Invoices')} 
                       fontWeight={'bold'}
                       fontSize={'20px'}
                       textAlign={'center'}
                  >
                    Invoices
                  </Typography>

                </Box>
                <Box>
                  {activeDropdown === 'Invoices' && (
                    renderAccountType()
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: "8px",
                  border: '1px solid #ccc'
                }}  
                display='flex' 
                flexDirection={'column'} 
                padding='10px' 
                overflow={'auto'}
              
              >
                <Box
                    onClick={() => handleToggle('Fuel Bills')}
                    
                >
                  <Typography 
                       onClick={() => setSelectedMenuItem('Fuel Bills')} 
                       fontWeight={'bold'}
                       fontSize={'20px'}
                       textAlign={'center'}
                  >
                    Fuel Bills
                  </Typography>

                </Box>
                <Box>
                  {activeDropdown === 'Fuel Bills' && (
                    renderAccountType()
                  )}
                </Box>
              </Box>

            </Box>

          ):(
            <Box  margin={'20px'}>
                  <Box ref={componentRef} backgroundColor="white" m="30px" borderRadius="10px">
                      <Box display="flex" justifyContent="center" flexDirection='column' alignItems='center' mb='30px'>
                      <Box>
                          <Typography fontSize={'35px'} color="black" ml="23px" mt="9px" fontWeight="bold" style={{ textDecoration: 'underline' }} >
                            {manufacturer}
                          </Typography>
                      </Box>

                      <Box>
                          <Typography fontSize={'27px'} color="black" ml="23px" mt="9px" fontWeight="bold" >
                            {vehicleType}
                          </Typography>
                      </Box>

                      <Box>
                          <Typography variant="h4" color="black" ml="23px" mt="9px" fontWeight="bold">
                            {title} / {trailer}
                          </Typography>
                      </Box>
                      </Box>

                  
                      <Box>
                      <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
                            FITTED NEW TYRES
                      </Typography>
                        {barchartbills}
                        <Box>
                          <Box
                            ml="20px"
                            height="35vh"
                            sx={{
                              "& .MuiDataGrid-root": {
                                border: "none",
                              },
                              "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                                color: "black",
                                fontSize: "15px",
                              },
                              "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "white",
                                borderBottom: "none",
                                fontSize: "15px",
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: "white",
                              },
                              "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: "white",
                                color: "black",
                              },
                              "& .MuiCheckbox-root": {
                                color: "black",
                              },
                              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: "black",
                              },
                            }}
                          >
                            <DataGrid rows={newtyresitems} columns={newtyres} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
                          </Box>
                          <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                            Total New Tyre Expense: {formattedExpense}
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                    <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
                              FITTED RETREAD TYRES
                      </Typography>
                          {barchartretread}
                          <Box>
                            <Box
                              m="40px 0 0 0"
                              ml="20px"
                              mr="20px"
                              height="35vh"
                              sx={{
                                "& .MuiDataGrid-root": {
                                  border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                  borderBottom: "none",
                                  color: "black",
                                  fontSize: "15px",
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                  backgroundColor: "white",
                                  borderBottom: "none",
                                  fontSize: "15px",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                  backgroundColor: "white",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                  borderTop: "none",
                                  backgroundColor: "white",
                                  color: "black",
                                },
                                "& .MuiCheckbox-root": {
                                  color: "black",
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                  color: "black",
                                },
                              }}
                            >
                              <DataGrid rows={retreadItems} columns={retreadtyres} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
                            </Box>
                            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">
                              Total Retread Tyres: {formattedRetread}
                            </Typography>
                          </Box>
                      </Box>

                      <Box>
                    <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
                              REPAIRS
                      </Typography>

                          {barchartreceipts}

                          <Box>
                            <Box
                              m="40px 0 0 0"
                              ml="20px"
                              mr="20px"
                              height="35vh"
                              sx={{
                                "& .MuiDataGrid-root": {
                                  border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                  borderBottom: "none",
                                  color: "black",
                                  fontSize: "15px",
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                  backgroundColor: "white",
                                  borderBottom: "none",
                                  fontSize: "15px",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                  backgroundColor: "white",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                  borderTop: "none",
                                  backgroundColor: "white",
                                  color: "black",
                                },
                                "& .MuiCheckbox-root": {
                                  color: "black",
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                  color: "black",
                                },
                              }}
                            >
                              <DataGrid rows={spareitems} columns={spare} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
                            </Box>
                            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">
                              Total Spare Expenses: {formattedSpares}
                            </Typography>
                          </Box>
                      </Box>

                      <Box>
                    <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
                              FUEL TRANSACTIONS
                      </Typography>

                          {barchart}

                          <Box>
                            <Box
                              m="40px 0 0 0"
                              ml="20px"
                              mr="20px"
                              height="35vh"
                              sx={{
                                "& .MuiDataGrid-root": {
                                  border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                  borderBottom: "none",
                                  color: "black",
                                  fontSize: "15px",
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                  backgroundColor: "white",
                                  borderBottom: "none",
                                  fontSize: "15px",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                  backgroundColor: "white",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                  borderTop: "none",
                                  backgroundColor: "white",
                                  color: "black",
                                },
                                "& .MuiCheckbox-root": {
                                  color: "black",
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                  color: "black",
                                },
                              }}
                            >
                              <DataGrid rows={dieselitems} columns={diesela} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
                            </Box>
                            <Typography variant="h6" color="black" fontWeight="bold" mb="20px">
                              Total Diesel Expenses: {formattedDiesel}
                            </Typography>
                          </Box>
                      </Box>

                      <Box>
                      <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
                            INVOICES
                      </Typography>
                                {barchart}
                        <Box>
                          <Box
                            m="40px 0 0 0"
                            ml="20px"
                            mr="20px"
                            height="35vh"
                            sx={{
                              "& .MuiDataGrid-root": {
                                border: "none",
                              },
                              "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                                color: "black",
                                fontSize: "15px",
                              },
                              "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "white",
                                borderBottom: "none",
                                fontSize: "15px",
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: "white",
                              },
                              "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: "white",
                                color: "black",
                              },
                              "& .MuiCheckbox-root": {
                                color: "black",
                              },
                              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: "black",
                              },
                            }}
                          >
                            <DataGrid rows={invoiceItems} columns={invoices} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
                          </Box>
                          <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                            Total Sales: {formatted}
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                      <Typography fontSize="25px" fontWeight="bold" ml="20px" display='flex' justifyContent='center'>
                            FUEL BILLS
                      </Typography>
                                {barchart}
                        <Box>
                          <Box
                            m="40px 0 0 0"
                            ml="20px"
                            mr="20px"
                            height="35vh"
                            sx={{
                              "& .MuiDataGrid-root": {
                                border: "none",
                              },
                              "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                                color: "black",
                                fontSize: "15px",
                              },
                              "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "white",
                                borderBottom: "none",
                                fontSize: "15px",
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: "white",
                              },
                              "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: "white",
                                color: "black",
                              },
                              "& .MuiCheckbox-root": {
                                color: "black",
                              },
                              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: "black",
                              },
                            }}
                          >
                            <DataGrid rows={billItems} columns={billcolumns} components={{ Toolbar: GridToolbar }} getRowId={(row) => row.id} />
                          </Box>
                          <Typography variant="h6" color="black" fontWeight="bold" mb="30px">
                            Total Bill: {formattedBill}
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" flexDirection="column" alignItems="center" sx={{ p: 3 }}>
                          {/* Main Title */}
                          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                            Financial Overview
                          </Typography>

                          {/* Container for Both Sides */}
                          <Box display="flex" flexDirection="row" alignItems="flex-start" sx={{ width: '100%', maxWidth: 800 }}>
                            
                            {/* Left Side - Expenses */}
                            <Box sx={{ flex: 1, p: 2 }}>
                              {/* Title for Expenses Section */}
                              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                Expenses
                              </Typography>

                              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Diesel</Typography>
                                <Typography variant="subtitle1">{formatedTotal}</Typography>
                              </Box>

                              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">New Tyres</Typography>
                                <Typography variant="subtitle1">{formattedExpense}</Typography>
                              </Box>

                              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Retread Tyres</Typography>
                                <Typography variant="subtitle1">{formattedRetread}</Typography>
                              </Box>

                              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Spares</Typography>
                                <Typography variant="subtitle1">{formattedSpares}</Typography>
                              </Box>

                              {/* Total for Expenses */}
                              <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: '1px solid grey' }}>
                                <Typography variant="subtitle1" fontWeight="bold">Total Expenses</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{formattedAllExpenses}</Typography>
                              </Box>
                            </Box>

                            {/* Vertical Divider */}
                            <Divider orientation="vertical" flexItem sx={{ mx: 2, borderRightWidth: 2 }} />

                          {/* Right Side - Sales */}
                          <Box sx={{ flex: 1, p: 2 }}>
                            {/* Title for Sales Section */}
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                              Sales
                            </Typography>

                            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">Sales</Typography>
                              <Typography variant="subtitle1">{formatted}</Typography>
                            </Box>

                            {/* Total for Sales */}
                            <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: '1px solid grey' }}>
                              <Typography variant="subtitle1" fontWeight="bold">Total Sales</Typography>
                              <Typography variant="subtitle1" fontWeight="bold">{formattedAllSales}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                  </Box>

                  <Box display="flex" justifyContent="center">
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            '&:hover': {
                              backgroundColor: colors.blueAccent[500],
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
          )}
           
    </Box>
     );
}
 
export default TruckReport;