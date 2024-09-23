import { useEffect, useState } from "react";
import { Box, Typography, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './Paymentsmade.css';
import { useNavigate } from "react-router-dom";

function Paymentsmade() {
    const [vendors, setVendors] = useState([]);
    const [payments, setPayments] = useState([]);
    const [funds,setFunds] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [currencyErrorMessage, setCurrencyErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        vendor_name: "",
        payment:"",
        bank_name: "",
        bank_details:"",
        currency:"",
        deposit_to: "",
        payment_amount: "",
        payment_date: "",
        payment_mode: "",
    });

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/paymentsmade')
            .then(response => response.json())
            .then((data) => {
                const formattedPayment = data.map((payments) => ({
                    ...payments,
                    payment_amount: new Intl.NumberFormat().format(payments.payment_amount)
                }))
                setPayments(formattedPayment)})
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/vendors')
            .then(response => response.json())
            .then((data) => setVendors(data))
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/bankaccounts')
            .then(response => response.json())
            .then(data => {
    
                setBankAccounts(data);
            })
            .catch(error => console.error('Error fetching bills:', error));
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/funds')
            .then(response => response.json())
            .then((data) => setFunds(data))
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const selectedBank = bankAccounts.find(bank => bank.bank_details === formData.bank_details);
        if (selectedBank && parseFloat(formData.payment_amount) > parseFloat(selectedBank.amount)) {
            setErrorMessage("You have insufficient funds in your Bank Account.");
            return;
        }

        console.log(formData.currency)

        if (selectedBank && formData.currency !== selectedBank.currency) {
            setCurrencyErrorMessage("You are using the wrong currency to pay your Bill.");
            return;
        }
        
    
        const paymentNumber = payments.length + 1;
    
        fetch('https://db-demo-u07o.onrender.com/paymentsmade', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                payment: paymentNumber
            })
        })
        .then((response) => response.json())
        .then((newPayment) => {

                fetch('https://db-demo-u07o.onrender.com/paymentsmade')
                .then(response => response.json())
                .then((data) => {
                const formattedPayment = data.map((payments) => ({
                    ...payments,
                    payment_amount: new Intl.NumberFormat().format(payments.payment_amount)
                }))
                setPayments(formattedPayment)})

                
            let remainingAmount = parseFloat(formData.payment_amount);
    
            const updateInvoices = (bills) => {
                if (bills.length > 0 && remainingAmount > 0) {
                    const bill = bills.shift(); // Select and remove the first unpaid or partially paid invoice
                    const paymentMade = parseFloat(bill.payment_made) || 0;
                    const totalAmount = bill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                    const remainingBalance = totalAmount - paymentMade;
                    const paymentToApply = Math.min(remainingAmount, remainingBalance);
    
                    const updatedPaymentMade = paymentMade + paymentToApply;
                    const amountOwed = totalAmount - updatedPaymentMade
                    const updatedStatus = updatedPaymentMade >= totalAmount ? "PAID" : "PARTIALLY PAID";
    
                    fetch(`https://db-demo-u07o.onrender.com/newbills/${bill.id}`, {
                        method: 'PATCH',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            amount_owed: amountOwed,
                            status: updatedStatus,
                            amount_paid: updatedPaymentMade
                        })
                    })
                    .then(response => response.json())
                    .then(updatedInvoice => {
                        remainingAmount -= paymentToApply;
                        updateInvoices(bills);
                    })
                    .catch(error => console.error('Error updating invoice:', error));
                } else {
                    // Clear form data once all invoices are updated
                    setFormData({
                        vendor_name: "",
                        amount_received: "",
                        currency:"",
                        bank_details:"",
                        bank_charges: "",
                        payment_date: "",
                        sales_person: "",
                        payment: "",
                        payment_mode: "",
                        deposit_to: "",
                    });
                }
            };
    
            // Fetch the unpaid or partially paid invoices associated with the customer
            fetch(`https://db-demo-u07o.onrender.com/newbills?vendor_name=${formData.vendor_name}&status=UNPAID,PARTIALLY PAID`)
            .then(response => response.json())
            .then(bills => {
                updateInvoices(bills);
            })
            .catch(error => console.error('Error fetching invoices:', error));

            if (formData.deposit_to === 'Bank') {
                // Update bank information
                const selectedBank = bankAccounts.find(bank => bank.bank_details === formData.bank_details);
                if (selectedBank) {
                    fetch(`https://db-demo-u07o.onrender.com/bankaccounts/${selectedBank.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            amount: selectedBank.amount - parseFloat(formData.payment_amount)
                        })
                    })
                    .then(response => response.json())
                    .then(updatedBank => {
                        console.log('Bank updated successfully:', updatedBank);
                    })
                    .catch(error => console.error('Error updating bank:', error));
                }
            }
        })
        .catch(error => console.error('Error creating payment:', error));
    }

    function handleSelectVendor(event) {
        const selectedValue = event.target.value;
        
        if (selectedValue === "new_vendor") {
            navigate("/vendors");
            return;
        }
        
        const selectedVendor = vendors.find(vendor => vendor.vendor_name === selectedValue);
        
        if (selectedVendor) {
            setFormData(prevFormData => ({
                ...prevFormData,
                vendor_name: selectedVendor.vendor_name,
                vendor_phone: selectedVendor.vendor_phone,
                vendor_email: selectedVendor.vendor_email,
                vendor_pin: selectedVendor.kra_pin,
                currency: selectedVendor.currency,
                total_amount_owed: selectedVendor.total_amount_owed
            }));
        }
    }

    const navigate = useNavigate()

    const paymentNumber = payments.length + 1;

    function handleSelectBank(event) {
        const selectedValue = event.target.value;
        
        const selectedCustomer = bankAccounts.find(customer => customer.bank_details === selectedValue);
        
        if (selectedCustomer) {
            setFormData(prevFormDepositData => ({
                ...prevFormDepositData,
                bank_name: selectedCustomer.bank_name,
                bank_details: selectedCustomer.bank_details,
                currency: selectedCustomer.currency,
            }));
        }
    }

    

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "vendor_name",
          headerName: "Vendor Name",
          flex: 0.2,
          cellClassName: "name-column--cell",
        },
        {
            field: "vendor_email",
            headerName: "Vendor Email",
            flex: 0.3,
        },
        {
            field: "vendor_phone",
            headerName: "Vendor Phone",
            flex: 0.3,
        },
        {
            field: "currency",
            headerName: "Currency",
            flex: 0.15,
        },
        {
            field: "bank_name",
            headerName: "Bank Name",
            flex: 0.3,
        },
        {
          field: "payment_amount",
          headerName: "Amount Paid",
          flex: 0.2,
        },
        {
          field: "payment_date",
          headerName: "Payment Date",
          flex: 0.2,
        },
        {
            field: "payment_mode",
            headerName: "Payment Mode",
            flex: 0.2,
        },
        
    ]

    return (
        <div>
            <div className="bill-content">
                <div>
                    <h2 className="h2">NEW PAYMENT</h2>
                    <form className="bill-form" onSubmit={handleSubmit}>
                        <div className="bill-input">
                            <label>Vendor Name</label>
                            <select name="vendor_name" className="bill-inputfield" value={formData.vendor_name} onChange={handleSelectVendor}>
                                <option value="">Select Vendor</option>
                                {vendors.map((vendor, index) => (
                                    <option key={index} >{vendor.vendor_name}</option>
                                ))}
                            </select>
                        </div>

                    <div className="bill-input">
                        <label>Vendor Phone</label>
                        <input
                            type="text"
                            name="vendor_phone"
                            placeholder="Vendor Phone"
                            className="bill-inputfield"
                            value={formData.vendor_phone}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Vendor Email</label>
                        <input
                            type="text"
                            name="vendor_email"
                            placeholder="Vendor Email"
                            className="bill-inputfield"
                            value={formData.vendor_email}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Vendor Pin</label>
                        <input
                            type="text"
                            name="vendor_pin"
                            placeholder="Vendor Pin"
                            className="bill-inputfield"
                            value={formData.vendor_pin}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                            <label>Currency</label>
                            <input
                                type="text"
                                name="currency"
                                placeholder="Currency"
                                className="bill-inputfield"
                                value={formData.currency}
                                onChange={handleChange}
                                readOnly
                            />
                    </div>

                        {formData.vendor_name ? <h2 className="OWE">YOU OWE {formData.vendor_name} {formData.currency} {formData.total_amount_owed}</h2> : ""}


                        <div className="bill-input">
                            <label>Payment Number</label>
                            <input
                                type="number"
                                name="payment"
                                placeholder={paymentNumber}
                                className="bill-inputfield"
                                value={paymentNumber}
                                readOnly
                            />
                        </div>

                        <div className="bill-input">
                            <label>Payment Amount</label>
                            <input
                                type="number"
                                name="payment_amount"
                                placeholder="Payment Amount"
                                className="bill-inputfield"
                                value={formData.payment_amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="bill-input">
                            <label>Pay With</label>
                            <select name="deposit_to" className="bill-inputfield" value={formData.deposit_to} onChange={handleChange}>
                                <option value="">Select</option>
                                {funds.map((fund, index) => (
                                    <option key={index} value={fund.fund_name}>{fund.fund_name}</option>
                                ))}
                            </select>
                        </div>

                        

                        {formData.deposit_to === 'Bank' ? 
                            <div className="bill-input">
                                <label>BANK ACCOUNT</label>
                                <select name="bank_details" value={formData.bank_details} className="bill-inputfield" onChange={handleSelectBank}>
                                <option value="">Select Bank Account</option>
                                {bankAccounts.map((bank,index) => (
                                <option key={index} value={bank.bank_details}>{bank.bank_details}</option>
                                ))}
                                </select>
                            </div> : ""
                        }

                        {formData.deposit_to === 'Bank' ? 
                            <div className="bill-input">
                                <label>BANK NAME</label>
                                <input
                                    type="text"
                                    name="bank_name"
                                    placeholder="Bank Name"
                                    className="bill-inputfield"
                                    value={formData.bank_name}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        : "" }

                        <div className="bill-input">
                            <label>Payment Date</label>
                            <input
                                type="date"
                                name="payment_date"
                                placeholder="Payment Date"
                                className="bill-inputfield"
                                value={formData.payment_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="bill-input">
                            <label>Payment Mode</label>
                            <select value={formData.payment_mode} className="bill-inputfield" name="payment_mode" onChange={handleChange}>
                                <option value="">Select Payment Mode</option>
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Bank Remittance">Bank Remittance</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Credit Card">Credit Card</option>
                            </select>
                        </div>

                        <button type="submit" className="button">Save Payment</button>
                    </form>
                    {errorMessage && <Snackbar
                        open={Boolean(errorMessage)}
                        autoHideDuration={6000}
                        onClose={() => setErrorMessage('')}
                        message={errorMessage}
                        action={
                            <Button color="inherit" onClick={() => setErrorMessage('')}>Close</Button>
                        }
                    />}

                    {currencyErrorMessage && <Snackbar
                        open={Boolean(currencyErrorMessage)}
                        autoHideDuration={6000}
                        onClose={() => setCurrencyErrorMessage('')}
                        message={currencyErrorMessage}
                        action={
                            <Button color="inherit" onClick={() => setCurrencyErrorMessage('')}>Close</Button>
                        }
                    />}
                </div>
            </div>

            <Box m="20px">
                <Typography 
                    fontSize='30px'
                    fontWeight='bold'
                    textAlign='center'
                >
                    PAYMENTS MADE
                </Typography>
                <Box
                    m="40px 0 0 0"
                    height="75vh"
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
                    rows={payments}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.id}
                    />
                </Box>
            </Box>
        </div>
    );
}

export default Paymentsmade;
