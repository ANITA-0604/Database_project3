import React, { useEffect, useState } from "react";
import { checkSession, logout } from "../api/auth";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    
    const [sessionInfo, setSessionInfo] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await checkSession();
                console.log(response);

                if (response.success) {
                    setSessionInfo(response.data.data.loggedIn);
                } else {
                    // If session is invalid or token expired, redirect to '/'
                    localStorage.removeItem('token'); // Clear invalid token
                    if (window.location.pathname !== '/') {
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error(error);
                // Redirect to '/' in case of an error (e.g., network issue)
                localStorage.removeItem('token');
                if (window.location.pathname !== '/') {
                    navigate('/');
                }
            }
            
        };
        fetchSession();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const res = await logout();
            setSessionInfo(res);
        } catch (error) {
        console.error("Logout failed:", error);
        }
    };

    return (
        <nav
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
        }}
        >
        {/* Navbar logo */}
        <div>
            <h2>WelcomeHome</h2>
        </div>

        {/* Navbar links */}
        <div style={{ display: "flex", gap: "15px" }}>
            <Link to="/start-order">Start Order</Link>
            <Link to="/find-order">Find Order</Link>
                <Link to="/find-item">Find Item</Link>
                <Link to="/accept-donation">Accept Donation</Link>
                <Link to="/shopping">Shopping</Link>
        </div>

        {/* Login/Logout button */}
        <div>
            {sessionInfo ? (
            <button onClick={handleLogout} style={{ padding: "5px 10px" }}>
                Logout
            </button>
            ) : (
            <Link to="/">
                <button style={{ padding: "5px 10px" }}>Login</button>
            </Link>
            )}
        </div>
        </nav>
  );
};

export default Navbar;
