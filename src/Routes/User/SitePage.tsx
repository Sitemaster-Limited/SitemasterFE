import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import GetSite from "../../Services/GetSite";

import Blueprint from '../../Images/Blueprints.png'
import Time from '../../Images/Time.png'


const SitePage = () => {
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteDetails = async () => {
      // Use URLSearchParams with location.search
      const searchParams = new URLSearchParams(location.search);
      const siteId = searchParams.get('siteId');
      const clientId = searchParams.get('clientId');

      if (!siteId || !clientId) {
        console.error("Site ID or Client ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        const siteDetails = await GetSite(siteId, clientId);
        if (siteDetails) {
          setSiteName(siteDetails.siteInfo.siteName); // Adjust according to actual property name
        } else {
          console.error("Failed to fetch site details.");
        }
      } catch (error) {
        console.error("An error occurred while fetching site details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDetails();
  }, [location.search]); // Depend on location.search to rerun if query parameters change


  // Render loading state, error message, or site name based on the state
  return (
    <div className="flex flex-col bg-custom-bg h-screen mt-20">
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{siteName}</p>
        )}
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
