import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, useUser  } from "@clerk/clerk-react";
import { useFormContext } from "../../Context/LocalObjectForm";

import Sites from './Sites/Sites';
import CreateSite from "./Sites/Create/CreateSite";
import EditSite from "./Sites/Edit/EditSite";
import Settings from './Settings/Settings';
import Employees from './Employees/Employees';
import GetClient from "../../Services/GetClient";
import SiteAttendance from "./Sites/Manage/SiteAttendance";
import SiteProgressReport from "./Sites/Manage/SiteProgressReport";
import CreateProgressReport from "./Sites/Create/CreateProgressReport";

const AdministratorPage = () => {

  const user = useUser();
  const { updateFormData } = useFormContext();

  useEffect(() => {
    const fetchData = async () => {
      if (user.isSignedIn) {
        try {

          const client  = await GetClient(String(user.user.primaryEmailAddress?.emailAddress));
          updateFormData({employees: client?.employees,
                                  sites: client?.sites,
                                  name: client?.administrator.name,
                                  phoneNumber: client?.administrator.phoneNumber
          });

        } catch (error) {
          console.error("Failed to fetch Client", error);
        }
      }
    };

    fetchData();
  }, [user.isSignedIn]); // This effect depends on the isSignedIn state

  return (
    <>
      <SignedOut>
        <div className="flex justify-center items-center h-[80vh]">
          <SignIn redirectUrl="admin/settings"
                  appearance={{
                    variables: {
                      colorPrimary: "#EE172E"
                    },
                  }}/>
        </div>
      </SignedOut>
      <SignedIn>
        <Routes>
          <Route path="/" element={<Navigate replace to="sites" />} />
          <Route path="sites" element={<Sites />} />
          <Route path="sites/create" element={<CreateSite />} />
          <Route path="sites/edit" element={<EditSite />} />
          <Route path="sites/attendance" element={<SiteAttendance />} />
          <Route path="sites/progress" element={<SiteProgressReport />} />
          <Route path="sites/progress/create-report" element={<CreateProgressReport />} />
          <Route path="employees" element={<Employees />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </SignedIn>
    </>
  );
};

export default AdministratorPage;
