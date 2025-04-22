import { Route, Routes, useNavigate,} from 'react-router-dom';
import Bill from './Components/Purchases/Bill';
import Vendor from './Components/Purchases/Vendor';
import Paymentsmade from './Components/Purchases/Paymentsmade';
import { lazy, Suspense, useEffect} from 'react';
import TruckReportPage from './Components/MoreTruckInfo/TruckDetails';
import ReportLayout from './Components/OverallReport/reportlayout';
import PrivateRoutes from './Components/PrivateRoutes';
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import UserAccount from './Components/Useraccount';
import EditInvoice from './Components/InvoiceEdit';
import BillEdit from './Components/BillEdit';
import FuelInvoice from './Components/Sales/FuelInvoices';
import EditStock from './Components/EditStock';
import TradingEdit from './Components/TradingProfitAndLossAccountEdit';
import VendorEdit from './Components/VendorEdit';
import EditSpare from './Components/SpareEdit';
import VehicleReport from './Components/VehicleReport';
import ReportForPaymentsMade from './Components/ReportForPaymentsMade';
import StoreDetails from './Components/StoreDetails';
import StockItemDetails from './Components/StockItemDetails';
import CreateStore from './Components/CreateStore';
import FitUsedTyre from './Components/FitUsedTyre';

const Customer = lazy(() => import('./Components/Sales/Customer'));
const Invoice = lazy(() => import('./Components/Sales/Invoice'));
const SalesReport = lazy(() => import('./Components/SalesReport'));
const PaymentsReceived = lazy(() => import('./Components/Sales/PaymentsReceived'));
const FuelUsingPumpB = lazy(() => import('./Components/Fuelusingpumpb'));
const RemoveDiesel = lazy(() => import('./Components/Fuelusingpumpa'));
const InvoiceDetails = lazy(() => import('./Components/Invoicepdf/Invoicedetails'));
const Tyre = lazy(() => import('./Components/Fitnewtyre'));
const OldTyres = lazy(() => import('./Components/Unfitnewtyres'));
const CheckUsedTyre = lazy(() => import('./Components/Usedtyres'));
const RetreadTyreShop = lazy(() => import('./Components/Retreadtyreshop'));
const RetreadedTyreShop = lazy(() => import('./Components/RetreadedTyreShop'));
const RetreadTyre = lazy(() => import('./Components/Fitretreadtyre'));
const UnfitRetreadTyres = lazy(() => import('./Components/Unfitretreadtyre'));
const Accounts = lazy(() => import('./Components/Accounts'));
const BillDetails = lazy(() => import('./Components/Bill/Billdetails'));
const Items = lazy(() => import('./Components/Stockitems'));
const Spares = lazy(() => import('./Components/Spares'));
const AvailableRetreadTyres = lazy(() => import('./Components/Retreadtyres'));
const FittedNewTyres = lazy(() => import('./Components/Fittednewtyres'));
const FittedRetreadTyres = lazy(() => import('./Components/Fittedretreadtyres'));
const ExpenseDetails = lazy(() => import('./Components/Expense/Expensedetails'));
const FitSpare = lazy(() => import('./Components/Fitspare'));
const Diesel = lazy(() => import('./Components/Addfueltopumpa'));
const DieselB = lazy(() => import('./Components/Addfueltopumpb'));
const CheckSpares = lazy(() => import('./Components/Checkfittedspares'));
const Trucks = lazy(() => import('./Components/Trucks'));
const AddItem = lazy(() => import('./Components/AddItem'));
const AddTyre = lazy(() => import('./Components/Addtyre'));
const RecordItemSales = lazy(() => import('./Components/Recorditemsales'));
const BarChart = lazy(() => import('./Components/BarChart'));
const PieChart = lazy(() => import('./Components/PieChart'));
const LineChart = lazy(() => import('./Components/LineChart'));
const CustomerDetails = lazy(() => import('./Components/Customer/Customerdetails'));
const VendorDetails = lazy(() => import('./Components/Vendor/VendorDetails'));
const TyreDetails = lazy(() => import('./Components/TyreReport/Tyrereportdetails'));
const AllUsedTyre = lazy(() => import('./Components/Checkusetyres'));
const Dashboard = lazy(() => import('./Components/Dashboard'));
const Banking = lazy(() => import('./Components/Banking'));
const AddSpare = lazy(() => import('./Components/AddSpare'));
const SalesPurchaseReport = lazy(() => import('./Components/SalesPuechaseReport'));
const VehicleService = lazy(() => import('./Components/VehicleService'));
const CustomBill = lazy(() => import('./Components/Purchases/CustomBill'));
const SpareBill = lazy(() => import('./Components/Purchases/SpareBill'));
const InventoryBill = lazy(() => import('./Components/Purchases/InventoryBill'));
const FuelBill = lazy(() => import('./Components/Purchases/FuelBill'));
const TransportInvoice = lazy(() => import('./Components/Sales/TransportInvoice'));
const InventoryInvoice = lazy(() => import('./Components/Sales/InventoryInvoice'));
const CustomInvoice = lazy(() => import('./Components/Sales/CustomInvoice'));
const InvoiceControl = lazy(() => import('./Components/Sales/InvoiceControl'));
const BillControl = lazy(() => import('./Components/Purchases/BiilControl'));
const VehicleRepair = lazy(() => import('./Components/VehicleRepair'));
const CreateFuelPump = lazy(() => import('./Components/CreateFuelPump'));
const Fuel = lazy(() => import('./Components/Fuel'));
const FuelControl = lazy(() => import('./Components/FuelControl'));
const FuelUpdates = lazy(() => import('./Components/FuelUpdates'));
const FuelPumpReport = lazy(() => import('./Components/FuelPumpReport'));
const TyreControl = lazy(() => import('./Components/TyreControl'));
const TyreBill = lazy(() => import('./Components/Purchases/TyreBill'));
const UsedTyresControl = lazy(() => import('./Components/UsedTyresControl'));
const RetreadTyreBill = lazy(() => import('./Components/Purchases/RetreadTyreBill'));
const UsedRetreadTyres = lazy(() => import('./Components/Unfittedretreadtyres'));
const RetreadTyreControl = lazy(() => import('./Components/RetreadTyreControl'));
const RepairReport = lazy(() => import('./Components/RepairReport'));
const AccountCategory = lazy(() => import('./Components/AccountCategory'));
const AccountControl = lazy(() => import('./Components/AccountContol'));
const Register = lazy(() => import('./Components/Register'));
const Login = lazy(() => import('./Components/LogIn'));
const RetreadTyreTripReport = lazy(() => import('./Components/RetreadTyreTripReport'));
const BalanceSheet = lazy(() => import('./Components/Balancesheet'));
const CustomerBalanceReport = lazy(() => import('./Components/CustomerBalanceReport'));
const CreditNote = lazy(() => import('./Components/Sales/CreditNotes'));
const AccountReceivables = lazy(() => import('./Components/AccountReceivables'));
const AccountsPayables = lazy(() => import('./Components/AccountsPayables'));
const CreditNotesReport = lazy(() => import('./Components/CreditNotesReport'));
const PaymentsMadeReport = lazy(() => import('./Components/PaymentsMadeReport'));
const PaymentsReceivedReport = lazy(() => import('./Components/PaymentsReceivedReport'));
const TradingProfitLossAccount = lazy(() => import('./Components/TradingProfitLossAccounts'));
const CashBook = lazy(() => import('./Components/CashBook'));
const VatPayable = lazy(() => import('./Components/VatPayable'));
const BillFuel = lazy(() => import('./Components/Purchases/BillFuel'));
const FuelBillControl = lazy(() => import('./Components/FuelBillControl'));
const TruckEdit = lazy(() => import('./Components/TruckEdit'));
const UserEdit = lazy(() => import('./Components/UserEdit'));
const PumpReport = lazy(() => import('./Components/PumpReport'));
const FuelTransactions = lazy(() => import('./Components/FuelTransactions'));
const ExpensesReport = lazy(() => import('./Components/ExpensesReport'));
const RepairMade = lazy(() => import('./Components/RepairsMade'));
const Quote = lazy(() => import('./Components/Sales/Quote'));
const QuoteDetails = lazy(() => import('./Components/Quote/QuoteDetails'));
const PaymentsDetails = lazy(() => import('./Components/Payments /PaymentsDetails'));
const InvoiceTransport = lazy(() => import('./Components/Sales/InvoiceTransport'));
const DeliveryNote = lazy(() => import('./Components/Sales/DeliveryNote'));
const DeliveryNoteDetails = lazy(() => import('./Components/DeliveryNote/DeliveryNoteDetails'));
const PumpCorrections = lazy(() => import('./Components/PumpCorrection'));
const TruckInvoiceEdit = lazy(() => import('./Components/TruckInvoiceEdit'));
const CustomerEdit = lazy(() => import('./Components/CustomerEdit'));



function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')


        useEffect(()=>{
          fetch('https://maingi-demo-server.onrender.com/check_session', {
              method:'GET',
              credentials:'include',
              headers:{
                'Authorization':`Bearer ${token}`
            }
          })
          .then(response => {
            // Check if the response indicates an error (e.g., unauthorized access)
            if (response.ok) {
                return response.json(); // Call the function to get the JSON data
            } else {
                // If the response is not OK, navigate to login
                navigate('/login');
            }
          })
          .catch(error => {
              console.error('Error fetching session:', error);
            });
      },[navigate,token])

        const handleLogOut = () => {
          // Remove access token, refresh token, and token expiry time from localStorage
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expiry");
        };

      const handleLogin = (userData) => {
        const { access_token, refresh_token } = userData;
      
        // Decode the JWT token to get its expiry time
        const decodedToken = jwtDecode(access_token);
        const tokenExpiry = decodedToken.exp * 1000; // `exp` is in seconds, so convert it to milliseconds
      
        // Store the access token, refresh token, and expiry time
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("token_expiry", tokenExpiry);
      
        // Start a timer to check token expiry and refresh token when necessary
        startTokenExpiryTimer(tokenExpiry);
      };
    
      const startTokenExpiryTimer = (expiryTime) => {
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // Ensure there's at least 1 minute remaining
        if (timeUntilExpiry > 60000) {
          setTimeout(timeUntilExpiry - 60000);
        } else {
          navigate('/login')
        }
      };

  return (
      <Suspense fallback={<div>Loading...</div>}>
            <Box>
                    <Box>
                    <Routes>
                        <Route path='/register-lol-wow-78596555' element={<Register />}></Route>
                        <Route path='/login' element={<Login onLogin={handleLogin}/>}></Route>
                        <Route element={<PrivateRoutes />}>
                            <Route path='/' exact element={<Dashboard />}></Route>
                            <Route path='/bill' element={<Bill />}></Route>
                            <Route path='/bill-fuel' element={<BillFuel />}></Route>
                            <Route path='/fuel-bill-control' element={<FuelBillControl />}></Route>
                            <Route path='/cash-book' element={<CashBook />}></Route>
                            <Route path='/vat-payable' element={<VatPayable />}></Route>
                            <Route path='/credit-note' element={<CreditNote />}></Route>
                            <Route path='/balance-sheet' element={<BalanceSheet />}></Route>
                            <Route path='/bill-control' element={<BillControl />}></Route>
                            <Route path='/used-tyres-control' element={<UsedTyresControl />}></Route>
                            <Route path='/retread-tyres-control' element={<RetreadTyreControl />}></Route>
                            <Route path='/tyre-control' element={<TyreControl />}></Route>
                            <Route path='/custom-bill' element={<CustomBill />}></Route>
                            <Route path='/retread-tyre-bill' element={<RetreadTyreBill />}></Route>
                            <Route path='/tyre-bill' element={<TyreBill />}></Route>
                            <Route path='/spare-bill' element={<SpareBill />}></Route>
                            <Route path='/inventory-bill' element={<InventoryBill />}></Route>
                            <Route path='/vendors' element={<Vendor />}></Route>
                            <Route path='/payments-made' element={<Paymentsmade />}></Route>
                            <Route path='/customers' element={<Customer />}></Route>
                            <Route path='/invoice' element={<Invoice />}></Route>
                            <Route path='/invoice-control' element={<InvoiceControl />}></Route>
                            <Route path='/transport-invoice' element={<TransportInvoice />}></Route>
                            <Route path='/inventory-invoice' element={<InventoryInvoice />}></Route>
                            <Route path='/custom-invoice' element={<CustomInvoice />}></Route>
                            <Route path='/spares' element={<Spares />}></Route>
                            <Route path='/account-control' element={<AccountControl />}></Route>
                            <Route path='/account-category' element={<AccountCategory />}></Route>
                            <Route path='/vehicle-repair' element={<VehicleRepair />}></Route>
                            <Route path='/sales-receipt' element={<RecordItemSales />}></Route>
                            <Route path='/payments-received' element={<PaymentsReceived />}></Route>
                            <Route path='/pump-b' element={<FuelUsingPumpB />}></Route>
                            <Route path='/pump-a' element={<RemoveDiesel />}></Route> 
                            <Route path='/unfit-new-tyre' element={<OldTyres />}></Route>
                            <Route path='/unfitted-retread-tyres' element={<UsedRetreadTyres />}></Route>
                            <Route path='/fit-new-tyre' element={<Tyre />}></Route>
                            <Route path='/stock-items' element={<Items />}></Route>
                            <Route path='/fitted-new-tyres' element={<FittedNewTyres />}></Route>
                            <Route path='/check-used-tyre' element={<CheckUsedTyre />}></Route>
                            <Route path='/retread-tyre-shop' element={<RetreadTyreShop />}></Route>
                            <Route path='/retreaded-tyre-shop' element={<RetreadedTyreShop />}></Route>
                            <Route path='/unfit-retread-tyre' element={<UnfitRetreadTyres />}></Route>
                            <Route path='/retread-tyres' element={<RetreadTyre />}></Route>
                            <Route path='/available-retread-tyres' element={<AvailableRetreadTyres />}></Route>
                            <Route path='/accounts' element={<Accounts />}></Route>
                            <Route path='/trucks' element={<Trucks />}></Route>
                            <Route path='/create-pump' element={<CreateFuelPump />}></Route>
                            <Route path='/fuelings' element={<Fuel />}></Route>
                            <Route path='/update-pump' element={<FuelUpdates />}></Route>
                            <Route path='/fuel-control' element={<FuelControl />}></Route>
                            <Route path='/add-item' element={<AddItem />}></Route>
                            <Route path='/record-item-sales' element={<RecordItemSales />}></Route>
                            <Route path='/add-tyre' element={<AddTyre />}></Route>
                            <Route path='/fit-spare' element={<FitSpare />}></Route>
                            <Route path='/line-chart' element={<LineChart />}></Route>
                            <Route path='/pie-chart' element={<PieChart />}></Route>
                            <Route path='/sales-report' element={<SalesReport />}></Route>
                            <Route path='/check-fitted-spares' element={<CheckSpares />}></Route>
                            <Route path='/add-fuel-to-pump-a' element={<Diesel />}></Route>
                            <Route path='/add-fuel-to-pump-b' element={<DieselB />}></Route>
                            <Route path='/vehicleservice' element={<VehicleService />}></Route>
                            <Route path='/fitted-retread-tyres' element={<FittedRetreadTyres />}></Route>
                            <Route path="/invoices/:invoiceId" element={<InvoiceDetails />} />
                            <Route path="/retreadtyretripreport/:repairId" element={<RetreadTyreTripReport />} />
                            <Route path="/newbills/:billId" element={<BillDetails />} />
                            <Route path="/pumps/:pumpId" element={<FuelPumpReport />} />
                            <Route path="/repair/:repairId" element={< RepairReport/>} />
                            <Route path="/fuel-bill" element={<FuelBill />} />
                            <Route path="/truck/:truckId" element={<TruckReportPage />} />
                            <Route path="/customers/:customerId" element={<CustomerDetails />} />
                            <Route path="/vendors/:vendorId" element={<VendorDetails />} />
                            <Route path="/edit-stock/:stockId" element={<EditStock />} />
                            <Route path="/bar-chart" element={<BarChart />} />
                            <Route path="/tyre-and" element={<AllUsedTyre />} />
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/new-spare" element={<AddSpare />} />
                            <Route path="/expenses/:expenseId" element={<ExpenseDetails />} />
                            <Route path="/tyre-report/:tyreId" element={<TyreDetails />} />
                            <Route path="/report-details" element={<SalesPurchaseReport />} />
                            <Route path="/banking" element={<Banking />} />
                            <Route path="/customer-balance-report" element={<CustomerBalanceReport />} />
                            <Route path="/all-invoices-report" element={<ReportLayout />} />
                            <Route path="/account-receivables-report" element={<AccountReceivables />} />
                            <Route path="/account-payables-report" element={<AccountsPayables />} />
                            <Route path="/credit-notes-report" element={<CreditNotesReport />} />
                            <Route path="/payments-made-report" element={<PaymentsMadeReport />} />
                            <Route path="/payments-received-report" element={<PaymentsReceivedReport />} />
                            <Route path="/trading-profit-loss-account" element={<TradingProfitLossAccount />} />
                            <Route path="/truck-edit/:truckId" element={<TruckEdit />} />
                            <Route path="/user-edit" element={<UserEdit />} />
                            <Route path="/fuel-transactions" element={<FuelTransactions />} />
                            <Route path="/pump-reports" element={<PumpReport />} />
                            <Route path="/expenses-reports" element={<ExpensesReport />} />
                            <Route path="/repairs-made" element={<RepairMade />} />
                            <Route path="/quotes" element={<Quote />} />
                            <Route path="/fuel-invoice" element={<FuelInvoice />} />
                            <Route path="/delivery-notes" element={<DeliveryNote />} />
                            <Route path="/invoice-transport" element={<InvoiceTransport />} />
                            <Route path="/trading-edit" element={<TradingEdit />} />
                            <Route path="/quote-details/:quoteId" element={<QuoteDetails />} />
                            <Route path="/payment-report/:madeId" element={<PaymentsDetails />} />
                            <Route path="/invoice-edit/:invoiceId" element={<EditInvoice />} />
                            <Route path="/bill-edit/:billId" element={<BillEdit />} />
                            <Route path="/pump-corrections/:pumpId" element={<PumpCorrections />} />
                            <Route path="/delivery-note/:deliveryId" element={<DeliveryNoteDetails />} />
                            <Route path="/truck_invoice_edit/:invoiceId" element={<TruckInvoiceEdit />} />
                            <Route path="/user-accounts" element={<UserAccount onLogout={handleLogOut} />} />
                            <Route path="/customer-edit/:customerId" element={<CustomerEdit />} />
                            <Route path="/vendor-edit/:vendorId" element={<VendorEdit />} />
                            <Route path="/edit-spare/:spareId" element={<EditSpare />} />
                            <Route path="/truck-invoices" element={<VehicleReport />} />
                            <Route path='/report-for-payments-made/:paymentId' element={<ReportForPaymentsMade />} />
                            <Route path="/store-details/:storeId" element={<StoreDetails />} />
                            <Route path="/stock-details/:stockId" element={<StockItemDetails />} />
                            <Route path="/create-store" element={<CreateStore />} />
                            <Route path="/fit-used-tyre" element={<FitUsedTyre />} />
                        </Route>
                    </Routes>
                    </Box>

            </Box>
          </Suspense>
  );
}

export default App;
