import React, {useEffect, useState} from 'react';
import { useSiteDetails } from "../../../Context/SiteDetails";
import {globalClientId, ProgressReport} from "../../../Utility/GlobalTypes";
import AddSite from "../../../Images/AddSite.png";
import {useNavigate} from "react-router-dom";

const SiteProgressReport = () => {

  const navigate = useNavigate();
  const { siteDetails } = useSiteDetails();
  const [siteId, setSiteId] = useState<string>("");
  const [clientId, setClientId] = useState<string>(() => localStorage.getItem('clientId') || "");
  const [allReports, fillAllReports] = useState<ProgressReport[]>([]);

  useEffect(() => {
    if (globalClientId) {
      setClientId(globalClientId);
      localStorage.setItem('clientId', globalClientId);
    }
  }, []);

  useEffect(() => {
    // Ensure attendance is only set once location is ready and siteAttendance exists
    if (siteDetails?.siteInfo?.siteId) {
      setSiteId(siteDetails.siteInfo.siteId);
    }
    if (siteDetails?.siteProgressReports) {
      fillAllReports(siteDetails.siteProgressReports);
    }

  }, [siteDetails]);

  const navigateToReportForm = (report?: ProgressReport) => {
    // Navigate to the ProgressReportForm route, passing data via state
    navigate("view-report", {
      state: {
        report,
        siteId,
        clientId,
      }
    });
  };

  return (
    <div className="flex flex-col overflow-auto p-2">
      <div className="md:h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">Site Progress Reports</h1>
      </div>
      <div className="bg-white max-w-52 justify-center items-center text-custom-grey rounded-[5px] drop-shadow p-2">
        <button className="p-2" onClick={() => navigateToReportForm()}>
          <img src={AddSite} alt="Add" className="inline mr-2" />
          New Progress Report
        </button>
      </div>
      <div>
        {allReports?.map((report, index) => (
          <div
            key={index}
            className="text-start bg-white p-4 mt-4 rounded-md mb-2 cursor-pointer"
            onClick={() => navigateToReportForm(report)}
          >
            <p><strong>Report Period:</strong> {report.reportingPeriod}</p>
            <p><strong>Compiled By:</strong> {report.compiledBy}</p>
            <p><strong>Project Due Date:</strong> {report.projectDueDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteProgressReport;
