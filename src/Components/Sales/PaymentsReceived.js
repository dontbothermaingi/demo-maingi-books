import { useEffect, useState } from "react";
import { Box, Typography, Button,Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './PaymentsReceived.css';
import { useNavigate } from "react-router-dom";

function PaymentsReceived() {
    const [paymentsReceived, setPaymentsReceived] = useState([]);
    const [currencyErrorMessage, setCurrencyErrorMessage] = useState("");
    const [customers, setCustomers] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([])
    const [funds,setFunds] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone:"",
        customer_email:"",
        customer_pin:"",
        amount_received: "",
        bank_charges: 0,
        currency: "",
        bank_name:"",
        bank_details:"",
        payment_date: "",
        sales_person: "",
        payment: "",
        payment_mode: "",
        deposit_to: "",
    });

    const paymentNumber = paymentsReceived.length + 1;


    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/paymentsreceived')
            .then(response => response.json())
            .then((data) => setPaymentsReceived(data));
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/customers')
            .then(response => response.json())
            .then((data) => setCustomers(data));
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/funds')
            .then(response => response.json())
            .then((data) => {
                console.log(data); // Log the data to verify
                setFunds(data);
            })
            .catch(error => console.error('Error fetching funds:', error));
    }, []);

    useEffect(() => {
        fetch('https://db-demo-u07o.onrender.com/bankaccounts')
            .then(response => response.json())
            .then(data => {
    
                setBankAccounts(data);
            })
            .catch(error => console.error('Error fetching bills:', error));
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

        // Check if amount_received exceeds total_amount_owed
        const selectedCustomer = customers.find(customer => customer.customer_name === formData.customer_name);
        if (selectedCustomer && parseFloat(formData.amount_received) > parseFloat(selectedCustomer.total_amount_owed)) {
            setErrorMessage("Amount received cannot exceed the total amount owed.");
            return;
        }

        console.log(formData.currency)

        const selectedBank = bankAccounts.find(bank => bank.bank_details === formData.bank_details);
        if (selectedBank && formData.currency !== selectedBank.currency) {
            setCurrencyErrorMessage("You are depositing money into the wrong account.");
            return;
        }

        const paymentNumber = paymentsReceived.length + 1;

        fetch('https://db-demo-u07o.onrender.com/paymentsreceived', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                payment: paymentNumber, // Update the payment field with the incremented number
                amount_received: formData.amount_received
            })
        })
        .then((response) => response.json())
        .then((newPayment) => {


            fetch('https://db-demo-u07o.onrender.com/paymentsreceived')
            .then(response => response.json())
            .then((data) => setPaymentsReceived(data));

            
            let remainingAmount = parseFloat(formData.amount_received);

            const updateInvoices = (invoices) => {
                if (invoices.length > 0 && remainingAmount > 0) {
                    const invoice = invoices.shift(); // Select and remove the first unpaid or partially paid invoice
                    const paymentMade = parseFloat(invoice.amount_paid) || 0;
                    const totalAmount = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                    const remainingBalance = totalAmount - paymentMade;
                    const paymentToApply = Math.min(remainingAmount, remainingBalance);

                    const updatedPaymentMade = paymentMade + paymentToApply;
                    const amountOwed = totalAmount - updatedPaymentMade
                    const updatedStatus = updatedPaymentMade >= totalAmount ? "PAID" : "PARTIALLY PAID";

                    fetch(`https://db-demo-u07o.onrender.com/invoices/${invoice.invoice_number}`, {
                        method: 'PATCH',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            status: updatedStatus,
                            amount_paid: updatedPaymentMade,
                            amount_owed: amountOwed
                        })
                    })
                    .then(response => response.json())
                    .then(updatedInvoice => {
                        remainingAmount -= paymentToApply;
                        updateInvoices(invoices);
                    })
                    .catch(error => console.error('Error updating invoice:', error));
                } else {
                    // Clear form data once all invoices are updated
                    setFormData({
                        customer_name: "",
                        amount_received: "",
                        bank_charges: "",
                        payment_date: "",
                        sales_person: "",
                        bank_name: "",
                        payment: "",
                        payment_mode: "",
                        deposit_to: "",
                        customer_phone:"",
                        customer_email:"",
                        bank_details:"",
                        customer_pin:"",
                    });
                }
            };

            // Fetch the unpaid or partially paid invoices associated with the customer
            fetch(`https://db-demo-u07o.onrender.com/invoices?customer_name=${formData.customer_name}&status=UNPAID,PARTIALLY PAID`)
            .then(response => response.json())
            .then(invoices => {
                updateInvoices(invoices);
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
                            amount: selectedBank.amount + parseFloat(formData.amount_received) - parseFloat(formData.bank_charges || 0)
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
                currency: selectedCustomer.currency,
                total_amount_owed: selectedCustomer.total_amount_owed
            }));
        }
    }

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
    
    const navigate = useNavigate()

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05 },
        {
          field: "customer_name",
          headerName: "CUSTOMER NAME",
          headerAlign: "left",
          cellClassName: "name-column--cell",
          flex: 0.3,
          align: "left",
        },
        {
            field: "customer_email",
            headerName: "Customer Email",
            flex: 0.3,
        },
        {
            field: "customer_phone",
            headerName: "Customer Phone",
            flex: 0.2,
        },
        {
            field: "currency",
            headerName: "Currency",
            flex: 0.15,
        },
        {
            field: "bank_name",
            headerName: "Bank Name",
            flex: 0.2,
        },
        {
          field: "amount_received",
          headerName: "AMOUNT RECEIVED",
          flex: 0.2,
        },
        {
          field: "bank_charges",
          headerName: "BANK CHARGES",
          flex: 0.2,
        },
        {
          field: "payment_date",
          headerName: "PAYMENT DATE",
          flex: 0.15,
        },
        {
          field: "payment_mode",
          headerName: "PAYMENT MODE",
          flex: 0.2,
        },
      ];

    return (
        <div>
            <div className="bill-content">
                <div>
                    <h2 className="h2">NEW PAYMENT RECEIVED</h2>
                    <form className="bill-form" onSubmit={handleSubmit}>

                    <div className="bill-input">
                        <label>Customer Name</label>
                        <select name="customer_name" className="bill-inputfield" value={formData.customer_name} onChange={handleSelectCustomer}>
                            <option value="">Select Customer</option>
                            {customers.map((customer, index) => (
                                <option key={index}>{customer.customer_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bill-input">
                        <label>Customer Phone</label>
                        <input
                            type="text"
                            name="customer_phone"
                            placeholder="Customer Phone"
                            className="bill-inputfield"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Customer Email</label>
                        <input
                            type="text"
                            name="customer_email"
                            placeholder="Customer Email"
                            className="bill-inputfield"
                            value={formData.customer_email}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="bill-input">
                        <label>Customer Pin</label>
                        <input
                            type="text"
                            name="customer_pin"
                            placeholder="Customer Pin"
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

                        {formData.customer_name ? <h2 className="OWE">{formData.customer_name} OWES YOU {formData.currency} {formData.total_amount_owed}</h2> : ""}

                        <div className="bill-input">
                        <label>Amount Received</label>
                            <input
                                type="number"
                                name="amount_received"
                                placeholder="Amount Received"
                                className="bill-inputfield"
                                value={formData.amount_received}
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

                        <div className="bill-input">
                            <label>Deposit To</label>
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

                        {formData.deposit_to === 'Bank' ? 
                        <div className="bill-input">
                        <label>Bank Charge</label>
                        <input
                            type="text"
                            name="bank_charges"
                            placeholder="Bank Charges"
                            className="bill-inputfield"
                            value={formData.bank_charges}
                            onChange={handleChange}
                        />
                        </div> : ""}

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
                        <label>Sales Person</label>
                        <input
                            type="text"
                            name="sales_person"
                            placeholder="Sales Person"
                            className="bill-inputfield"
                            value={formData.sales_person}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="bill-input">
                        <label>Payment</label>
                        <input
                            type="number"
                            name="payment"
                            placeholder={`${paymentNumber}`}
                            className="bill-inputfield"
                            value={formData.payment}
                            onChange={handleChange}
                            readOnly
                        />
                        </div>

                        <button type="submit" className="button">Save and Send</button>
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
                    PAYMENTS RECEIVED
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
                    rows={paymentsReceived}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => `${row.customer_name}-${row.amount_received}-${row.bank_charges}-${row.payment_date}-${row.payment}-${row.payment_mode}`}
                    />
                </Box>
            </Box>
            
        </div>
    );
}

export default PaymentsReceived;
