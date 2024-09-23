import { Outlet, Navigate } from "react-router-dom";
import SideBar from './SideBar';
import Topbar from './Topbar';
import './PrivateRoutes.css';

function PrivateRoutes() {
    // Fetch access token and user ID from local storage
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem("user_id");

    // If no user ID or access token, redirect to the login page
    if (!userId || !accessToken) {
        return <Navigate to="/login" replace />;
    }

    // Define logout handler function
    const handleLogout = () => {
        // Handle logout logic here
        console.log('Logged out');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        // Add other cleanup logic if needed
    };

    return (
        <div className="app">
            <SideBar onLogout={handleLogout} />
            <div className='main-content'>
                <Topbar />
                <main className='content'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PrivateRoutes;
