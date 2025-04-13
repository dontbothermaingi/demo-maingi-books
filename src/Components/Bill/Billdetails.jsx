import { Box, Button, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BillLayout from "./Bill";
import { useNavigate, useParams } from "react-router-dom";

const BillDetails = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [total, setTotal] = useState(null);
  const [vatTotal, setVatTotal] = useState(null);
  const [pending, setPending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0); // Initialize subtotal state
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate() 

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetch(`https://demo-server-757m.onrender.com/newbills/${billId}`,{
      method:'GET',
      credentials:'include',
      headers:{
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched invoice:', data); // Debugging log
        setBill(data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch(error => {
        console.error('Error fetching invoice:', error);
        setError(error); // Set error state
        setLoading(false); // Set loading to false in case of error
      });
  }, [billId,token]);

  useEffect(() => {
    if (bill && bill.items) {
      // Calculate subtotal from items array
      const subtotalAmount = bill.items.reduce((total, item) => total + item.amount, 0);
      const totalSubTotalAmount = new Intl.NumberFormat().format(subtotalAmount);
      setSubtotal(totalSubTotalAmount);

      // Calculate vat amount from items array
      const vatAmount = bill.items.reduce((total, item) => total + item.rate_vat, 0);
      const totalVatAmount = new Intl.NumberFormat().format(vatAmount);
      setVatTotal(totalVatAmount);

      // Calculate total amount based on VAT type
      if (bill.type_vat === "Exclusive VAT") {
        const calculateTotal = subtotalAmount + vatAmount;
        const displayTotal = new Intl.NumberFormat().format(calculateTotal);
        setTotal(displayTotal);
      } else {
        const calculateSubTotal = subtotalAmount - vatAmount;
        const displaySubTotal = new Intl.NumberFormat().format(calculateSubTotal);
        setSubtotal(displaySubTotal);
        setTotal(totalSubTotalAmount);
      }

    }
  }, [bill]);

  function handleBillEdit(){
    navigate(`/bill-edit/${billId}`)
  }

  function handleDelete(){

    setPending(true);
    setOpenDialog(true);

    fetch(`https://demo-server-757m.onrender.com/newbills/${billId}`, {
      method:"DELETE",
      headers:{
        'Authorization':`Bearer ${token}`
      },
      credentials:'include'
    })
    .then(response => response.json())
    .then(()=>{
      setPending(false);
      setOpenDialog(false);
      console.log('successfully deleted')
      navigate("/bill")
    })
    .catch((error) => {
      console.error("Failed to Delete", error)
    })
  }

  function handleCloseDialog(){
    setOpenDialog(!openDialog);
  }

  // Check if bill is defined before formatting payment and remainder
  const formattedPayment = bill ? new Intl.NumberFormat().format(bill.amount_paid || 0) : "";
  const formattedRemainder = bill ? new Intl.NumberFormat().format(bill.amount_owed || 0) : "";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching invoice details</div>;
  if (!bill) return <div>No invoice data available</div>;

  return (
    <Box m="30px">

      <Box
         display="flex"
         flexDirection="row"
         justifyContent="space-between"
         gap={2} // Add some space between buttons
      >
      <Button
            variant="contained"
            color="secondary"
            onClick={handleBillEdit}
        >
          <Typography fontFamily={"GT Bold"}>EDIT BILL</Typography>
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleDelete}
          disabled={pending}
        >
          <Typography fontFamily={"GT Bold"}>{pending ? "DELETING BILL..." : "DELETE BILL"}</Typography>
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent sx={{display:'flex', alignItems:'center', gap:'20px'}}>
            <CircularProgress sx={{fontSize:'10px'}}/>
            <Typography fontFamily={'GT Bold'}>Deleting...</Typography>
        </DialogContent>
      </Dialog>

      <BillLayout
        title="BILL"
        address={bill.address}
        country={bill.country}
        invoiceNumber={bill.bill_number}
        invoiceDate={bill.bill_date}
        terms={bill.invoice_terms}
        dueDate={bill.due_date}
        salesPerson={bill.sales_person}
        vendorName={bill.vendor_name}
        items={bill.items}
        consignee={bill.consignee}
        vendorPhone={bill.vendor_phone}
        vendorEmail={bill.vendor_email}
        subtotal={subtotal}
        vatamount={vatTotal}
        vatType={bill.type_vat}
        total={total}
        status={bill.status}
        vendorPin={bill.vendor_pin}
        paidtotal={formattedPayment} // Use formatted payment_made here
        remainder={formattedRemainder} // Use formatted remainder here
      />
    </Box>
  );
};

export default BillDetails;
