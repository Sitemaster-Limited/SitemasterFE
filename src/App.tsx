import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FormProvider } from "./Context/LocalObjectForm";

import LoginPage from "./Routes/Initial/LoginPage";
import SitePage from "./Routes/Initial/SitePage";
import AdministratorPage from "./Routes/Initial/Administrator";
import Navbar from "./Components/Navbar";

import './Styling/App.css';

function AppWithNavbar() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin'); // Check if the path starts with /admin

    return (
        <div className="App">
            {isAdminRoute && <Navbar />}
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/site" element={<SitePage />} />
                <Route path="/admin/*" element={<AdministratorPage />} /> {/* Notice the /* for nested routing */}
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <FormProvider>
                <AppWithNavbar /> {/* Use this component to enable useLocation hook */}
            </FormProvider>
        </Router>
    );
}

export default App;
