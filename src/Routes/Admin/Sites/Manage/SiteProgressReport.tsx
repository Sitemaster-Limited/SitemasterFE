import React, {useEffect, useState} from 'react';
import ProgressReportForm from "../../../../Components/ProgressReportForm";
import {Attendance} from "@/src/Utility/GlobalTypes";
import {useLocation, useNavigate} from "react-router-dom";
import AddSite from "../../../../Images/AddSite.png";

const SiteProgressReport = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<Attendance[]>([]);

  useEffect(() => {
    // Ensure attendance is only set once location is ready and siteAttendance exists
    if (location.state?.site?.siteProgressReport) {
      setProgress(location.state.site.siteProgressReport);
    }
  }, [location.state]);

  console.log(progress);

  return (
    <div className="flex flex-col overflow-auto p-2">
      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">Site Progress Reports</h1>
      </div>
      <div
        className="bg-white max-w-48 justify-center items-center text-custom-grey rounded-[5px] drop-shadow">
        <button className="p-2" onClick={() => navigate('create-report')}>
          <img src={AddSite} alt="Add" className="inline mr-2"/>
          New Progress Report
        </button>
      </div>
    </div>
  );
};

export default SiteProgressReport;
