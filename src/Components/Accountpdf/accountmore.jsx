import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import AccountLayout from ".";
import { useParams } from "react-router-dom";

const MoreAccount = () => {
  const { accountId } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0); // Initialize subtotal state
  const [formattedPaymentMade, setFormattedPaymentMade] = useState(""); // State to store formatted payment_made
  const [formattedRemainder, setFormattedRemainder] = useState(""); // State to store formatted remainder

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetch(`https://maingi-demo-server.onrender.com/accounts/${accountId}`)
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
  }, [accountId]);

  useEffect(() => {
    if (bill && bill.items) {
      // Calculate subtotal from items array
      const subtotalAmount = bill.items.reduce((total, item) => total + item.amount, 0);
      const totalAmount = new Intl.NumberFormat().format(bill.items.reduce((total, item) => total + item.amount, 0));

      setSubtotal(totalAmount); // Set subtotal state

      // Format payment_made with commas
      if (bill.payment_made) {
        const formatted = new Intl.NumberFormat().format(bill.payment_made);
        setFormattedPaymentMade(formatted); // Set formatted payment_made

        // Calculate remainder and format it
        const remainder = subtotalAmount - bill.payment_made;
        const formattedRemainder = new Intl.NumberFormat().format(remainder);
        setFormattedRemainder(formattedRemainder); // Set formatted remainder
      }
    }
  }, [bill]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching invoice details</div>;
  if (!bill) return <div>No invoice data available</div>;

  return (
    <Box m="30px">
      <AccountLayout
        title="EXPENSE"
        address={bill.address}
        country={bill.country}
        invoiceNumber={bill.invoice_number}
        invoiceDate={bill.expense_date}
        terms={bill.invoice_terms}
        dueDate={bill.due_date}
        salesPerson={bill.sales_person}
        vendorName={bill.vendor_name}
        items={bill.items}
        consignee={bill.consignee}
        vendorPhone={bill.vendor_phone}
        vendorEmail={bill.vendor_email}
        subtotal={subtotal}
        total={subtotal} // Assuming total is same as subtotal for now
        paidtotal={formattedPaymentMade} // Use formatted payment_made here
        remainder={formattedRemainder} // Use formatted remainder here
      />
    </Box>
  );
};

export default MoreAccount;
