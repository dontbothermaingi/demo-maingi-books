import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Accountdetails.css';
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function AccountDetails() {
    const { accountId } = useParams();
    const [stockitems, setStockItems] = useState([]);
    const [expense, setExpense] = useState([])
    const [bill, setBills] = useState([])
    const [receipt, setReceipts] = useState([])
    const [invoices, setInvoices] = useState([])
    const [details, setDetails] = useState(null);

    useEffect(() => {
        fetch(`https://maingi-demo-server.onrender.com/accounts/${accountId}`)
            .then(response => response.json())
            .then(data => {
                setDetails(data);
            })
            .catch(error => console.error('Error fetching account details:', error));
    }, [accountId]);

    useEffect(() => {
        fetch(`https://maingi-demo-server.onrender.com/accounts/${accountId}`)
            .then(response => response.json())
            .then(data => {
                const expenseItems = data.expenses.flatMap(expense => 
                    expense.items.map(item => ({
                        ...expense,
                        ...item,
                    }))
                );
                setExpense(expenseItems);
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }, [accountId]);

    useEffect(() => {
        fetch(`https://maingi-demo-server.onrender.com/accounts/${accountId}`)
            .then(response => response.json())
            .then(data => {
                const expenseItems = data.salesreceipts.flatMap(expense => 
                    expense.items.map(item => ({
                        ...expense,
                        ...item,
                    }))
                );
                setReceipts(expenseItems);
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }, [accountId]);

    useEffect(() => {
        fetch(`https://maingi-demo-server.onrender.com/accounts/${accountId}`)
            .then(response => response.json())
            .then(data => {
                const expenseItems = data.invoices.flatMap(expense => 
                    expense.items.map(item => ({
                        ...expense,
                        ...item,
                    }))
                );
                setInvoices(expenseItems);
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }, [accountId]);

    useEffect(() => {
        fetch(`https://maingi-demo-server.onrender.com/accounts/${accountId}`)
            .then(response => response.json())
            .then(data => {
                const billItems = data.bills.flatMap(bill => 
                    bill.items.map(item => ({
                        ...bill,
                        ...item,
                    }))
                );
                setBills(billItems);
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }, [accountId]);

    useEffect(() => {
        fetch(`https://maingi-demo-server.onrender.com/stockitems?account_name=${accountId}`)
            .then(response => response.json())
            .then(data => {
                setStockItems(data);
            })
            .catch(error => console.error('Error fetching stock items:', error));
    }, [accountId]);

    if (!details) {
        return <div>Loading...</div>;
    }

    const invoice = [
        { field: "id", headerName: "ID", flex: 0.1 },
        {
          field: "customer_name",
          headerName: "Customer Name",
          flex: 0.3,
          cellClassName: "name-column--cell",
        },
        {
          field: "invoice_number",
          headerName: "Invoice Number",
          headerAlign: "left",
          flex: 0.2,
          align: "left",
        },
        {
          field: "consignee",
          headerName: "Consignee",
          flex: 0.3,
        },
        {
          field: "invoice_date",
          headerName: "Invoice Date",
          flex: 0.2,
        },
        {
          field: "status",
          headerName: "STATUS",
          flex: 0.2,
        },
        {
          field: "sales_person",
          headerName: "Sales Person",
          flex: 0.3,
        },
        {
            field: "item_details",
            headerName: "ITEM",
            flex: 0.2,
            cellClassName: "name-column--cell",
          },
          {
            field: "quantity",
            headerName: "QUANTITY",
            headerAlign: "left",
            flex: 0.2,
            align: "left",
          },
          {
            field: "rate",
            headerName: "RATE",
            flex: 0.2,
          },
          {
            field: "vat",
            headerName: "VAT",
            flex: 0.2,
          },
          {
            field: "amount",
            headerName: "AMOUNT",
            flex: 0.2,
          },
    ]

    const columns = [
        { field: "id", headerName: "ID", flex: 0.2 },
        {
          field: "vendor_name",
          headerName: "Vendor Name",
          flex: 0.5,
          cellClassName: "name-column--cell",
        },
        {
          field: "bill_number",
          headerName: "Bill Number",
          flex: 0.2,
        },
        {
          field: "bill_date",
          headerName: "Bill Date",
          flex: 0.4,
        },
        {
          field: "payment_terms",
          headerName: "Payment Terms",
          flex: 0.5,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.5,
          },
        {
            field: "due_date",
            headerName: "Due Date",
            flex: 0.5,
          },
    ]

      const receipts = [
        {
          field: "customer_name",
          headerName: "CUSTOMER NAME",
          headerAlign: "left",
          flex: 0.2,
          align: "left",
        },
        {
          field: "account_name",
          headerName: "ACCOUNT NAME",
          flex: 0.2,
        },
        {
          field: "date",
          headerName: "RECEIPT DATE",
          flex: 0.2,
        },
        {
          field: "payment_mode",
          headerName: "PAYMENT MODE",
          flex: 0.2,
        },
        {
            field: "item_details",
            headerName: "ITEM",
            flex: 0.2,
            cellClassName: "name-column--cell",
          },
          {
            field: "quantity",
            headerName: "QUANTITY",
            headerAlign: "left",
            flex: 0.2,
            align: "left",
          },
          {
            field: "rate",
            headerName: "RATE",
            flex: 0.2,
          },
          {
            field: "vat",
            headerName: "VAT",
            flex: 0.2,
          },
          {
            field: "amount",
            headerName: "AMOUNT",
            flex: 0.2,
          },
        
      ];

      const stock = [
        {
            field: "item_details",
            headerName: "ITEM",
            flex: 0.2,
            cellClassName: "name-column--cell",
          },
          {
            field: "quantity",
            headerName: "QUANTITY",
            headerAlign: "left",
            flex: 0.2,
            align: "left",
          },
      ];

    return (
        <div className="truck-details-container">
            <h2>{details.account_name}</h2>
            <div >
                <div className='right-truck-details'>
                    {details.bills.length > 0 && 
                            <Box m="20px">
                                <Typography 
                                    fontSize='30px'
                                    fontWeight='bold'
                                    textAlign='center'
                                >
                                    Bills
                                </Typography>
                                <Box
                                    m="40px 0 0 0"
                                    height="45vh"
                                    sx={{
                                    "& .MuiDataGrid-root": {
                                        border: "none",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        borderBottom: "none",
                                        // fontSize: "16px",
                                    },
                                    "& .name-column--cell": {
                                        // color: colors.greenAccent[300],
                                    },
                                    "& .MuiDataGrid-columnHeaders": {
                                        // backgroundColor: colors.blueAccent[700],
                                        borderBottom: "none",
                                        // fontSize: "16px",
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
                                    rows={bill}
                                    columns={columns}
                                    components={{ Toolbar: GridToolbar }}
                                    getRowId={(row) => row.id}
                                    />
                                </Box>
                            </Box>
                    }

                

                    <hr className='truck-details-line' />
                    <div className='new-tyres-truck-details'>
                    
                    {details.salesreceipts && details.salesreceipts.length > 0 && (
                        <Box m="20px">
                        <Typography 
                            fontSize='30px'
                            fontWeight='bold'
                            textAlign='center'
                        >
                            SALES
                        </Typography>
                        <Box
                            m="40px 0 0 0"
                            height="45vh"
                            sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                                // fontSize: "16px",
                            },
                            "& .name-column--cell": {
                                // color: colors.greenAccent[300],
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                // backgroundColor: colors.blueAccent[700],
                                borderBottom: "none",
                                // fontSize: "16px",
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
                             rows={receipt}
                            columns={receipts}
                            components={{ Toolbar: GridToolbar }}
                            getRowId={(row) => row.id}
                            />
                        </Box>
                    </Box>
                    )}
                        
                    </div>

                    <div className='new-tyres-truck-details'>
                        
                    {details.invoices && details.invoices.length > 0 && (
                        <Box m="20px">
                        <Typography 
                            fontSize='30px'
                            fontWeight='bold'
                            textAlign='center'
                        >
                            INVOICES
                        </Typography>
                        <Box
                            m="40px 0 0 0"
                            height="45vh"
                            sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                                // fontSize: "16px",
                            },
                            "& .name-column--cell": {
                                // color: colors.greenAccent[300],
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                // backgroundColor: colors.blueAccent[700],
                                borderBottom: "none",
                                // fontSize: "16px",
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
                             rows={invoices}
                            columns={invoice}
                            components={{ Toolbar: GridToolbar }}
                            getRowId={(row) => row.id}
                            />
                        </Box>
                    </Box>
                    )}
                    </div>
                    <hr className='truck-details-line' />
                    <div className='new-tyres-truck-details'>
                        {stockitems && stockitems.length > 0 &&
                        <Box m="20px">
                        <Typography 
                            fontSize='30px'
                            fontWeight='bold'
                            textAlign='center'
                        >
                            STOCK ITEMS
                        </Typography>
                        <Box
                            m="40px 0 0 0"
                            height="45vh"
                            sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                                // fontSize: "16px",
                            },
                            "& .name-column--cell": {
                                // color: colors.greenAccent[300],
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                // backgroundColor: colors.blueAccent[700],
                                borderBottom: "none",
                                // fontSize: "16px",
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
                            rows={stockitems}
                            columns={stock}
                            components={{ Toolbar: GridToolbar }}
                            getRowId={(row) => row.id}
                            />
                        </Box>
                    </Box>
                        }               
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountDetails;
