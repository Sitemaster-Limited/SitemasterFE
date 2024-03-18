import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

import Sites from './Sites';
import CreateSite from "./CreateSite";
import Settings from './Settings';
import Employees from './Employees';

const AdministratorPage = () => {
  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center justify-center bg-custom-bg h-screen mt-20 md:mt-0 md:ml-64 p-2">
          <p>Please sign in to access the Administrator Dashboard</p>
          <SignInButton redirectUrl="admin/sites" /> {/* Customize redirectUrl as needed */}
        </div>
      </SignedOut>
      <SignedIn>
        <Routes>
          <Route path="/" element={<Navigate replace to="sites" />} />
          <Route path="sites" element={<Sites />} />
          <Route path="sites/create" element={<CreateSite />} />
          <Route path="employees" element={<Employees />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </SignedIn>
    </>
  );
};

export default AdministratorPage;
