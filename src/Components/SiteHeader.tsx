import React from "react";
import Logo from '../Images/SiteMasterLogo.png'

const SiteHeader = () => {


    // Render loading state, error message, or site name based on the state
    return (
        <div className="bg-custom-bg fixed top-0 py-2 pl-2 pr-2 w-full z-20">
            <div className="bg-custom-black h-full rounded-[5px] flex justify-center">
                <img src={Logo} alt="SITEMASTER" className="pt-1 rounded-[5px] h-16 object-contain mx-auto"/>
            </div>
        </div>
    );
};

export default SiteHeader;
