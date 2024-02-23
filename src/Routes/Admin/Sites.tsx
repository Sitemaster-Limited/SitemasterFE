import React from "react";
import DisplaySiteList from "../../Components/DisplaySiteList";
import { SiteList } from "../../Utility/GlobalTypes"

const Sites = () => {

    const sites: SiteList[] = [
        { name: 'Hillside Villa', date: '15-06-2023', status: 'Active' },
        { name: 'Adela Villa', date: '17-06-2023', status: 'Saved' },
        { name: 'Cakes Villa', date: '12-06-2023', status: 'Inactive' },
        { name: 'Bakers Villa', date: '18-06-2023', status: 'Active' },

        // ... other properties
    ];

    return (
        <div className="lex flex-col bg-custom-bg h-screen mt-16 md:mt-0 md:ml-64 p-2">

            <div className="h-[6%] rounded-[5px] mb-2">
                <h1 className="text-left text-[34px]">
                    My Sites
                </h1>
            </div>

            <div className="bg-yellow-500 h-[5%] rounded-[5px] mb-2">

            </div>

            <div className="bg-white h-[87%] rounded-[5px] overflow-auto">
                <DisplaySiteList sites={sites}/>
            </div>

        </div>

    );
};

export default Sites;
