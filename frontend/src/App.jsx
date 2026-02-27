import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import CustomerDetails from './pages/CustomerDetails';
import Loans from './pages/Loans';
import AddLoan from './pages/AddLoan';
import LoanDetails from './pages/LoanDetails';
import Payments from './pages/Payments';
import Calculator from './pages/Calculator';
import Profile from './pages/Profile';
import Footer from './components/Footer';

// Protected layout wrapper
const ProtectedLayout = () => {
    const { isAuthenticated, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-950"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden relative transition-colors duration-200">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-y-auto flex flex-col">
                    <div className="flex-1 p-4 md:p-6">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

// Redirect logged-in users away from login/register
const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/calculator" element={<Calculator />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/customers/add" element={<AddCustomer />} />
                        <Route path="/customers/:id" element={<CustomerDetails />} />
                        <Route path="/customers/:id/edit" element={<AddCustomer />} />
                        <Route path="/loans" element={<Loans />} />
                        <Route path="/loans/add" element={<AddLoan />} />
                        <Route path="/loans/:id" element={<LoanDetails />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
