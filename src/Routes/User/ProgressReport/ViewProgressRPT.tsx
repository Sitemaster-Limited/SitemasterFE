import React from 'react';
import { useLocation } from "react-router-dom";
import ProgressReportForm from "../../../Components/ProgressReportForm";

const ViewProgressReport = () => {

  const location = useLocation();
  const { report, siteId } = location.state || {};
  const storedClientId = localStorage.getItem('clientId');

  return (
    <div className="flex h-full flex-col p-2">
      <h1 className="text-xl mr-auto ml-4 font-semibold">Progress Report Form</h1>
      {siteId && storedClientId && (
        <ProgressReportForm
          siteId={siteId}
          clientId={storedClientId}
          redirectUrl={"no-redirect"}
          page="User"
          report={report}
        />
      )}
    </div>
  );
};

export default ViewProgressReport;
