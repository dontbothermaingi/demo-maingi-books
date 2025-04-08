import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button, IconButton, FormControl, Select, MenuItem, TextField, RadioGroup, FormControlLabel, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Card, CardContent, Pagination, Radio, useMediaQuery } from "@mui/material";

function Quotes (){

    const [quotes,setQuotes] = useState([]);
    const navigate = useNavigate()
    const [isVatInclusive, setIsVatInclusive] = useState(true);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const token = localStorage.getItem('access_token')
    const [customers,setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        quote_number: "",
        quote_date: "",
        vendor_pin: "",
        currency:"",
        type_vat:"Inclusive Tax",
        items: [],
    })

    const [newItem,setNewItem] = useState({
        item_details: "",
        description: "",
        quantity: 0,
        vat: 0,
        sub_total:"",
        rate_vat: 0,
        rate: 0,
        amount: 0,
    })

    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/customers', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then(data => setCustomers(data))
    }, [token])

    useEffect(()=>{
        fetch('https://demo-server-757m.onrender.com/quotes', {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        })
        .then(response => response.json())
        .then((data) => {

            
            const quote_total = data.map((quote) => {
                const totalAmount = new Intl.NumberFormat().format(quote.items.reduce((total, item) => total + item.amount, 0));
                return { ...quote, totalAmount };

            })
            

            setQuotes(quote_total)
        })
    },[token])

    function handleChange(event){
        const{name,value} = event.target

        setFormData(prevFormData =>({
            ...prevFormData,
            [name]:value,
        }))
    }

    function handleNewItemChange(event) {
        const { name, value } = event.target;
        const uppercasedValue = name === 'item_details' || name === 'description' ? value.toUpperCase() : value;
        
        setNewItem(prevNewItem => {
            const updatedItem = { ...prevNewItem, [name]: uppercasedValue };
    
            if (name === 'quantity' || name === 'rate' || name === 'vat') {
                if (isVatInclusive) {
                    // Inclusive VAT calculation
                    updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                    updatedItem.rate_vat = ((updatedItem.vat / 100) * updatedItem.amount);
                    updatedItem.sub_total = (updatedItem.quantity * updatedItem.rate) - updatedItem.rate_vat;
                } else {
                    // Exclusive VAT calculation
                    updatedItem.rate_vat = ((updatedItem.vat / 100) * updatedItem.amount);
                    updatedItem.sub_total = (updatedItem.quantity * updatedItem.rate);
                    updatedItem.amount = (updatedItem.sub_total) + updatedItem.rate_vat;
                }
            }
            return updatedItem;
        });
    }

    function addItem() {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, newItem]
        }));
        setNewItem({ item_details: "", description: "", quantity: 0, rate: 0, vat: 0, rate_vat: 0,sub_total:0, amount: 0 });
    }


    function handleDeleteItem(index) {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index)
        }));
    }

    function handleSelectCustomer(event) {
        const selectedValue = event.target.value;
        
        if (selectedValue === "new_customer") {
            navigate("/customers");
            return;
        }
        
        const selectedCustomer = customers.find(customer => customer.customer_name === selectedValue);
        
        if (selectedCustomer) {
            setFormData(prevFormData => ({
                ...prevFormData,
                customer_name: selectedCustomer.customer_name,
                customer_phone: selectedCustomer.customer_phone,
                customer_email: selectedCustomer.customer_email,
                vendor_pin: selectedCustomer.kra_pin,
                currency:selectedCustomer.currency,
            }));
        }
    }


    function handleSubmit(event){
        event.preventDefault()

        const quoteNumber = quotes.length + 1

        fetch('https://demo-server-757m.onrender.com/quotes', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials:'include',
            body:JSON.stringify({...formData, quote_number:quoteNumber})
        })
        .then(response => response.json())
        .then(data => {

                fetch('https://demo-server-757m.onrender.com/quotes',{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    },
                    credentials:'include'
                })
                .then(response => response.json())
                .then((data) => {
                    
                    const quote_total = data.map((quote) => {
                        const totalAmount = new Intl.NumberFormat().format(quote.items.reduce((total, item) => total + item.amount, 0));
                        return { ...quote, totalAmount };
        
                    })
                    
        
                    setQuotes(quote_total)
                })

            setFormData({
                customer_name: "",
                customer_phone: "",
                customer_email: "",
                quote_number: "",
                currency:"",
                quote_date: "",
                vendor_pin: "",
                type_vat:"Inclusive Tax",
                items: [],
            })
        })
    }

    const vatAmount = formData.items.reduce((total, item) => total + item.rate_vat, 0);
    const totalAmount = isVatInclusive ? formData.items.reduce((total, item) => total + item.amount, 0) : (formData.items.reduce((total, item) => total + item.sub_total, 0) + vatAmount)
    const subTotalAmount = isVatInclusive ? formData.items.reduce((total, item) => total + item.sub_total, 0): formData.items.reduce((total, item) => total + item.sub_total, 0);


    function handleToggleVat() {
        setIsVatInclusive(!isVatInclusive);
        setFormData(prevFormData => ({
            ...prevFormData,
            type_vat: isVatInclusive ? "Exclusive VAT" : "Inclusive VAT"
        }));
    }

    const handleViewDetails = (quoteId) => {
        navigate(`/quote-details/${quoteId}`);
      };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.2 },
        {
          field: "customer_name",
          headerName: "Customer Name",
          flex: 0.5,
          cellClassName: "name-column--cell",
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.quote_number)}
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
          field: "quote_number",
          headerName: "Quote Number",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.quote_number)}
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
          field: "totalAmount",
          headerName: "Amount",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.quote_number)}
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
          field: "quote_date",
          headerName: "Quote Date",
          flex: 0.3,
          renderCell: (params) => (
            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
            }}
            onClick={() => handleViewDetails(params.row.quote_number)}
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

    const totalPages = Math.ceil(quotes.length / itemsPerPage)
    const displayedItems = quotes.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return ( 
        <Box margin={'40px'}>
            <Box>
                <Box 
                    sx={{
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto', // Adjust height for better flexibility
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '10px',
                      backgroundColor: '#fff',
                      // Media queries for responsive design
                      '@media (max-width: 600px)': {
                        padding: '5px', // Adjust padding for smaller screens
                      },
                      '@media (min-width: 600px)': {
                        padding: '10px', // Keep padding for medium screens and above
                      },
                    }}
                  
                >
                    <Typography fontSize={'30px'} fontWeight={'bold'} textAlign={'center'} marginTop={'20px'}>NEW QUOTE</Typography>
                    <form style={{display:'flex', flexDirection:'column', margin:'20px'}} onSubmit={handleSubmit}>

                        <FormControl>
                            <Typography fontWeight={'bold'}>Customer Name</Typography>
                            <Select name="customer_name" value={formData.customer_name} onChange={handleSelectCustomer} sx={{mb:'20px'}}>
                                <MenuItem value="">Select Customer</MenuItem>
                                {customers.map((customer, index) => (
                                    <MenuItem key={index} value={customer.customer_name}>{customer.customer_name}</MenuItem>
                                ))}
                                <MenuItem value="new_customer">Create New Customer</MenuItem>
                            </Select>
                        </FormControl>


                        <TextField
                            type="text"
                            name="customer_phone"
                            label="Customer Phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            readOnly
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="customer_email"
                            label="Customer Email"
                            value={formData.customer_email}
                            onChange={handleChange}
                            readOnly
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="customer_pin"
                            label="Customer Pin"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            readOnly
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="quote_number"
                            label="Quote Number"
                            value={formData.quote_number}
                            onChange={handleChange}
                            readOnly
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <TextField
                            type="text"
                            name="quote_date"
                            label="Date"
                            className="bill-inputfield"
                            value={formData.quote_date}
                            onChange={handleChange}
                            readOnly
                            variant="outlined"
                            sx={{mb:'20px'}}
                        />

                        <RadioGroup
                            name="vat_type"
                            value={isVatInclusive ? "Inclusive VAT" : "Exclusive VAT"} // use value for better control
                            onChange={handleToggleVat}
                            sx={{display:'flex', flexDirection:'row'}}
                        >
                            <FormControlLabel
                                value="Inclusive VAT"
                                control={<Radio />}
                                label="Inclusive VAT"
                                checked={isVatInclusive}
                            />
                            <FormControlLabel
                                value="Exclusive VAT"
                                control={<Radio />}
                                label="Exclusive VAT"
                                checked={!isVatInclusive}
                            />
                        </RadioGroup>

                        <Typography fontSize={'25px'} fontWeight={'bold'}>Items</Typography>
                        <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', marginTop: 2 }}>
                            <Table aria-label="Invoice Table" sx={{ minWidth: isMobile ? 900 : 'auto' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Item</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 280 }}><Typography fontWeight="bold">Description</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Quantity</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Rate</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Sub Total</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">VAT</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">VAT Amount</Typography></TableCell>
                                        <TableCell sx={{ minWidth: 150 }}><Typography fontWeight="bold">Total Amount</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.item_details}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.rate}</TableCell>
                                            <TableCell>{item.sub_total}</TableCell>
                                            <TableCell>{item.vat}</TableCell>
                                            <TableCell>{item.rate_vat}</TableCell>
                                            <TableCell>{item.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    color="error"
                                                    onClick={() => handleDeleteItem(index)}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell>
                                            <TextField
                                                name="item_dtails"
                                                placeholder="Item Details"
                                                value={newItem.item_details}
                                                onChange={handleNewItemChange}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                            />
                                            
                                            
                                        </TableCell>

                                        <TableCell>
                                            <TextField
                                                name="description"
                                                placeholder="Description"
                                                value={newItem.description}
                                                onChange={handleNewItemChange}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                multiline
                                                minRows={4}  // Initial number of rows
                                                maxRows={20}   // Maximum number of rows
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <TextField
                                                type="number"
                                                name="quantity"
                                                placeholder="Quantity"
                                                className="bill-inputfield"
                                                value={newItem.quantity}
                                                onChange={handleNewItemChange}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                name="rate"
                                                placeholder="Rate"
                                                className="bill-inputfield"
                                                value={newItem.rate}
                                                onChange={handleNewItemChange}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <TextField
                                                placeholder="Sub Total"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={newItem.sub_total}
                                                InputProps={{ readOnly: true }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <FormControl>
                                                <Select
                                                    value={newItem.vat}
                                                    name="vat"
                                                    fullWidth
                                                    onChange={handleNewItemChange}
                                                    displayEmpty
                                                >
                                                    <MenuItem value=""><em>Select VAT</em></MenuItem>
                                                    <MenuItem value={16}>16%</MenuItem>
                                                    <MenuItem value={0}>0%</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>

                                        <TableCell>
                                            <TextField
                                                placeholder="VAT Amount"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={newItem.rate_vat}
                                                InputProps={{ readOnly: true }}
                                            />
                                            </TableCell>

                                            <TableCell>
                                            <TextField
                                                placeholder="Total Amount"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={newItem.amount}
                                                InputProps={{ readOnly: true }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <Button variant="contained" color="secondary" onClick={addItem} sx={{margin:'20px'}}>Add Item</Button>
                        <Box display={'flex'} flexDirection={'column'} gap={'15px'} m={'10px'} textAlign={'right'} fontWeight={'bold'}>
                            <Typography fontWeight={'bold'}>
                                    Sub Total Amount:{" "}
                                    {formData.currency ? (
                                        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(subTotalAmount)
                                    ) : (
                                        subTotalAmount
                                    )}
                            </Typography>

                            <Typography fontWeight={'bold'}>VAT Amount: {" "}
                                    {formData.currency ? (
                                        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(vatAmount)
                                    ) : (
                                        vatAmount
                                    )}
                            </Typography>

                            <Typography fontWeight={'bold'}>Total Amount: {" "}
                                { formData.currency ? (
                                    new Intl.NumberFormat('en-KE', {currency:'KES', style:'currency'}).format(totalAmount)
                                ):(
                                    totalAmount
                                )}
                            </Typography>
                        </Box>

                        <Button variant="contained" color="secondary" type="submit" className="button">Save</Button>

                    </form>
                </Box>
            </Box>
            
            {isMobile ? (
                <Box>
                <Typography fontSize={'27px'} fontWeight={'bold'} textAlign={'center'}>QUOTES</Typography>
                <Box
                    display={'grid'}
                    gridTemplateColumns={{xs:'repeat(1,1fr)', sm:'repeat(2,1fr)'}}
                    gap="10px"
                    margin="0 10px"
                >

                    {displayedItems.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleViewDetails(item.quote_number)}
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
                                    <Typography>Customer Name: {item.customer_name}</Typography>
                                    <Typography>Invoice Number: {item.invoice_number}</Typography>
                                    <Typography>Amount: { new Intl.NumberFormat('en-KE', {style:'currency', currency:'KES'}).format(item.totalAmount)}</Typography>
                                    <Typography>Currency: {item.currency}</Typography>
                                    <Typography>Date: {item.invoice_date}</Typography>
                                    <Typography>Status: {item.status}</Typography>
                                    <Typography>Sales Person: {item.sales_person}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Box display="flex" justifyContent="center" mt="20px">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
                    </Box>
                </Box>
            </Box>
        
              ) : (
                <Box m="20px">
                  <Typography 
                      fontSize='30px'
                      fontWeight='bold'
                      textAlign='center'
                  >
                      QUOTES
                  </Typography>
                  <Box
                      height="75vh"
                  >
                      <DataGrid
                      rows={quotes}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      />
                  </Box>
                </Box>
              )}


        </Box>
     );
}
 
export default Quotes;