import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from '../Images/SiteMasterLogo.png';
import BackArrow from '../Images/BackArrow.svg'; // Ensure you have a back arrow image

const SiteHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);

  const isSubpathOfSite = location.pathname.startsWith("/login/site/");

  return (
    <div className="bg-custom-bg fixed top-0 py-2 pl-2 pr-2 w-full z-20 flex items-center">
      {isSubpathOfSite && (
        <div className="absolute ml-1 left-4 cursor-pointer" onClick={handleBackClick}>
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
