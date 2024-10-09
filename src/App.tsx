import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import {FormProvider} from "./Context/LocalObjectForm";

import LoginPage from "./Routes/Initial/LoginPage";
import SiteRoutes from "./Routes/User/UserRoutes";
import AdminRoutes from "./Routes/Admin/AdminRoutes";
import Navbar from "./Components/Navbar";
import SiteHeader from "./Components/SiteHeader"

import './Styling/App.css';

function AppWithNavbar() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin'); // Check if the path starts with /admin
  const isSiteRoute = location.pathname.startsWith('/login'); // Check if the path starts with /admin
  const isHomeRoute = location.pathname === '/'; // Check if the path is exactly the root

  return (
    <div className={`App flex flex-col overflow-hidden ${isAdminRoute ? "md:flex-row" : ""} min-h-screen bg-custom-bg`}>
      {isAdminRoute && <Navbar/>}
      {(isSiteRoute || isHomeRoute) && <SiteHeader/>}
      <div className={`flex-grow ${isAdminRoute ? "md:ml-64" : ""} w-full`}>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/login/*" element={<SiteRoutes/>}/>
          <Route path="/admin/*" element={<AdminRoutes/>}/> {/* Notice the /* for nested routing */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <FormProvider>
        <AppWithNavbar/> {/* Use this component to enable useLocation hook */}
      </FormProvider>
    </Router>
  );
}

export default App;
