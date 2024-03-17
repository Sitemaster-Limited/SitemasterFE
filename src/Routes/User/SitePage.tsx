import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { Employee, Site} from "../../Utility/GlobalTypes";
import GetSite from "../../Services/GetSite";

import Blueprint from '../../Images/Blueprints.png';
import Time from '../../Images/Time.png';

const SitePage = () => {
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [siteDetails, setSiteDetails] = useState<Site | null>(null)

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteDetails = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const siteId = searchParams.get('siteId');
      const clientId = searchParams.get('clientId');

      if (!siteId || !clientId) {
        console.error("Site ID or Client ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        const details = await GetSite(siteId, clientId);
        setSiteDetails(details);
        setSiteName(details.siteInfo.siteName);
      } catch (error) {
        console.error("An error occurred while fetching site details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDetails();
  }, [location.search]);

  const verifyPhoneNumber = () => {
    if (siteDetails && siteDetails.siteAccess.some((employee: Employee) => employee.phoneNumber === phoneNumber)) {
      setIsVerified(true);
    } else {
      alert("Phone number not found. Please try again.");
    }
  };

  // Render loading state or prompt for phone number verification
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          className="mb-4 p-2 border"
        />
        <button
          onClick={verifyPhoneNumber}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Verify
        </button>
      </div>
    );
  }
  // Render loading state, error message, or site name based on the state
  return (
    <div className="flex flex-col bg-custom-bg h-screen mt-20">
      <div>
        <p>{siteName}</p>
      </div>
      <div className="grid grid-cols-2 mt-2 gap-4 px-4">
        <button onClick={() => navigate(`time`)}
                className="bg-white w-full aspect-square rounded-lg shadow-md flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center rounded-full mb-2">
              <img src={Time} alt="TIME" className="pt-1 rounded-[5px] w-full"/>
            </div>
          </div>
        </button>

        <button
          className="bg-white w-full aspect-square rounded-lg shadow-md flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center rounded-full mb-2">
              <img src={Blueprint} alt="BlUEPRINTS" className="pt-1 rounded-[5px] w-full"/>
            </div>
          </div>
        </button>
      </div>
    </div>

  );
};

export default SitePage;
