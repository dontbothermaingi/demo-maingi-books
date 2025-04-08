import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ onLogout }) {
    const navigate = useNavigate();

    useEffect(() => {
        onLogout(); // Update auth state
        navigate('https://demo-server-757m.onrender.com/login');
    }, [onLogout, navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
}

export default Logout;
