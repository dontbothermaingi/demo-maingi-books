import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function AccountCategory() {
    const [accounts, setAccounts] = useState([]);
    const [aaccounts, setAAccounts] = useState([]);
    const [purchaseAccounts, setPurchaseAccounts] = useState([]);
    const [formData, setFormData] = useState({
        type_name: "", 
        category_name: "",
    });

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/accounttypes')
            .then(response => response.json())
            .then(data => {
                setAAccounts(data);
            });
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/accountcategories')
            .then(response => response.json())
            .then(data => {
                const filtered = data.filter(item => item.account_type_id === 2);
                const filtered1 = data.filter(item => item.account_type_id === 1);

                setAccounts(filtered);
                setPurchaseAccounts(filtered1);
            });
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch('https://db-demo-u07o.onrender.com/accountcategories', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setFormData({
                type_name: "Purchase Account", // Reset to default value after submission
                category_name: "",
                subcategory_name: "",
            });
        });
    }

    const navigate = useNavigate()
    

    // const handleViewDetails = (accountId) => {
    //     navigate(`/accounts/${accountId}`);
    //   };

      const handleViewSales = (accountId) => {
        navigate(`/accounts/${accountId}`);
      };

    const columnPurchases = [
        {
            field: "category_name",
            headerName: "ACCOUNT NAME",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.1,
            align: "left",
          },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.2,
            align: "left",
            mt: "12px",
          },
      ];

      const columnSales = [
        {
            field: "category_name",
            headerName: "ACCOUNT NAME",
            headerAlign: "left",
            cellClassName: "name-column--cell",
            flex: 0.1,
            align: "left",
          },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.2,
            align: "left",
            mt: "12px",
            renderCell: (params) => (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#94e2cd",
                  color: "#141414",
                  '&:hover': {
                    backgroundColor: "#94e2cd",
                  },
                }}
                onClick={() => handleViewSales(params.row.category_name)}
              >
                <Typography sx={{ ml: "5px" }}>
                  View Account
                </Typography>
              </Button>
            ),
          },
      ];

    return (
        <div>
            <div className="bill-content">
                <h2 className="h2">NEW CATEGORY ACCOUNT</h2>
                <form className="bill-form" onSubmit={handleSubmit}>
                <div className="bill-input">
                    <label>Account</label>
                    <select name="type_name" placeholder='Account Type' className="bill-inputfield" value={formData.type_name} onChange={handleChange}>
                        <option value=''>Select Account</option>
                        {aaccounts.map((account,index) => (
                            <option key={index} value={account.type_name}>{account.type_name}</option>
                        ))}
                    </select>
                </div>
                    <div className="bill-input">
                        <label>Account Category</label>
                        <input
                            type="text"
                            name="category_name"
                            value={formData.category_name}
                            placeholder="Account Category"
                            className="bill-inputfield"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="button">Add</button>
                </form>
            </div>
            <Box display='flex' justifyContent='center'>

                    <Box m="20px">
                        <Typography
                        fontSize='22px'
                        fontWeight='bold'
                        textAlign='center'
                        mt='10px'
                        >
                            SALES ACCOUNTS
                        </Typography>
                        <Box
                            m="40px 0 0 0"
                            width='500px'
                            margin='auto'
                            height="75vh"
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
                            rows={accounts}
                            columns={columnSales}
                            components={{ Toolbar: GridToolbar }}
                            getRowId={(row) => `${row.account_name}-${row.id}`}
                            />
                        </Box>
                    </Box>

                    <Box m="20px">
                        <Typography
                        fontSize='22px'
                        fontWeight='bold'
                        textAlign='center'
                        mt='10px'
                        >
                            PURCHASE ACCOUNTS
                        </Typography>
                        <Box
                            m="40px 0 0 0"
                            width='500px'
                            margin='auto'
                            height="75vh"
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
                            rows={purchaseAccounts}
                            columns={columnPurchases}
                            components={{ Toolbar: GridToolbar }}
                            getRowId={(row) => `${row.account_name}-${row.id}`}
                            />
                        </Box>
                    </Box>
            </Box>
        </div>
    );
}

export default AccountCategory;
