import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser  } from "@clerk/clerk-react";
import { useFormContext } from "../../Context/LocalObjectForm";

import Sites from './Sites';
import CreateSite from "./CreateSite";
import Settings from './Settings';
import Employees from './Employees';
import GetEmployees from "../../Services/GetEmployees";

const AdministratorPage = () => {

  const user = useUser();
  const { updateFormData } = useFormContext();

  useEffect(() => {
    const fetchData = async () => {
      if (user.isSignedIn) {
        try {
          const employees = await GetEmployees(String(user.user.primaryEmailAddress?.emailAddress));
          console.log(employees);
          updateFormData({employees: employees})
        } catch (error) {
          console.error("Failed to fetch employees", error);
        }
      }
    };

    fetchData();
  }, [user.isSignedIn]); // This effect depends on the isSignedIn state

  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center justify-center bg-custom-bg h-screen mt-20 md:mt-0 md:ml-64 p-2">
          <p>Please sign in to access the Administrator Dashboard</p>
          <SignInButton redirectUrl="admin/settings" /> {/* Customize redirectUrl as needed */}
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
