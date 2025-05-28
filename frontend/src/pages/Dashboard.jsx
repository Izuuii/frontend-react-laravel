import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchUser } from "../api";
import axios from "axios";
import Confetti from "react-confetti";

function Dashboard() {
    const [user, setUser] = useState({});
    const [showConfetti, setShowConfetti] = useState(true);
    const navigate = useNavigate();
    
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        fetchUser()
            .then((data) => {
                setUser(data);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 sec
            })
            .catch((error) => console.error("Error fetching user:", error));

        // Update window size when resizing
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Disable scrolling when confetti is visible
    useEffect(() => {
        if (showConfetti) {
            document.body.style.overflow = "hidden"; // Prevent scrolling
        } else {
            document.body.style.overflow = "auto"; // Restore scrolling
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup on unmount
        };
    }, [showConfetti]);

    function handleLogout() {
        axios.post('logout')
        .finally(() => {
            localStorage.removeItem('token');
            axios.defaults.headers.common['Authorization'] = 'Bearer';
            navigate('/login');
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Confetti Effect */}
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

            {/* Navigation Bar */}
            <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 w-full p-4 flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Dashboard
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-500 text-sm dark:text-gray-400">{user.email}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="pt-20 flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Welcome, {user.name} 
                </h1>
            </div>
        </div>
    );
}

export default Dashboard;
