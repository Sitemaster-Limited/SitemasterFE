import React from 'react';
import { useLocation } from "react-router-dom";
import ProgressReportForm from "../../../../Components/ProgressReportForm";

const CreateProgressReport = () => {

  const location = useLocation();
  const { report, siteId, clientId } = location.state || {}; // Access passed state


  return (
    <div className="flex h-full flex-col p-2">
      <h1 className="text-xl mr-auto ml-4 font-semibold">Progress Report Form</h1>
      {siteId && clientId && (
        <ProgressReportForm
          siteId={siteId}
          clientId={clientId}
          redirectUrl={"/site/progress-reports"}
          page={"Admin"}
          report={report}
        />
      )}
    </div>
  );
};

export default CreateProgressReport;
