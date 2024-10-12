import React from 'react';
import { useLocation } from "react-router-dom";
import ProgressReportForm from "../../../../Components/ProgressReportForm";

const CreateProgressReport = () => {

  const location = useLocation();
  const { report, siteId, clientId } = location.state || {}; // Access passed state


  return (
    <div className="flex h-full flex-col p-2">
      {siteId && clientId && (
        <ProgressReportForm
          siteId={siteId}
          clientId={clientId}
          redirectUrl={"/admin/sites/progress"}
          page={"Admin"}
          report={report}
        />
      )}
    </div>
  );
};

export default CreateProgressReport;
