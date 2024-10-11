import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from '../Images/SiteMasterLogo.png';
import BackArrow from '../Images/BackArrow.svg'; // Ensure you have a back arrow image

const SiteHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedSiteId = localStorage.getItem('siteId');
  const storedClientId = localStorage.getItem('clientId');

  const isSubpathOfSite = location.pathname.startsWith("/login/site/");

  return (
    <div className="bg-none sticky top-0 py-2 pl-2 pr-2 w-full z-50 flex items-center">
      {isSubpathOfSite && (
        <div className="absolute ml-3 left-4 cursor-pointer" onClick={() => navigate(`/login/site?siteId=${storedSiteId}&clientId=${storedClientId}`)}>
          <img src={BackArrow} alt="Back" className="h-5"/>
        </div>
      )}
      <div className="bg-custom-black h-full rounded-[5px] flex justify-center w-full">
        <img src={Logo} alt="SITEMASTER" className="pt-1 rounded-[5px] h-16 object-contain mx-auto"/>
      </div>
    </div>
  );
};

export default SiteHeader;
