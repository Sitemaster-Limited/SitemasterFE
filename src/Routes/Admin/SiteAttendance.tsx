import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Attendance } from "../../Utility/GlobalTypes";

import DisplayAttendanceList from "../../Components/DisplayAttendanceList";

const SiteAttendance = () => {

  const location = useLocation();
  const attendance: Attendance[] = useState(location.state?.site.siteAttendance);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div className="flex flex-col bg-custom-bg h-screen mt-20 md:mt-0 md:ml-64 p-2 relative">
      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">Site Attendance</h1>
      </div>
      <div className="h-[42px] mb-2 flex">
        <div className="flex-1 ml-2 max-w-96">
          <input
            type="text"
            placeholder="Search Employees..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 h-full rounded-[5px] drop-shadow"
          />
        </div>
      </div>
      <DisplayAttendanceList attendances={attendance} searchTerm={searchTerm} />
    </div>
  );
};

export default SiteAttendance;
