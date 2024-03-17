import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from "../../Context/LocalObjectForm";
import {SiteList} from '../../Utility/GlobalTypes';

import DisplaySiteList from '../../Components/DisplaySiteList';
import AddSite from '../../Images/AddSite.png';
import Archive from '../../Images/Archive.png';

const Sites = () => {

    const navigate = useNavigate();

    const { formData } = useFormContext();
    const [sites, setSites] = useState<SiteList[]>([]);
    useEffect(() => {
        if (formData.sites && formData.sites.length) {
            const transformedSites: SiteList[] = formData.sites.map((site, index): SiteList => {
                const id = (index + 1).toString().padStart(3, '0');
                const name = site.siteInfo?.siteName; // Use optional chaining and fallback
                return {
                    id: id,
                    name: name,
                    date: new Date().toLocaleDateString(),
                    status: "Active",
                };
            });
            setSites(transformedSites);
        }
    }, [formData.sites]);

    // State to hold the search term
    const [searchTerm, setSearchTerm] = useState("");
    const [activeButton, setActiveButton] = useState('all');

    // Function to handle the change in the search input
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="flex flex-col bg-custom-bg h-screen mt-16 md:mt-0 md:ml-64 p-2">

            <div className="h-[6%] rounded-[5px] mb-3">
                <h1 className="text-left text-[34px]">
                    My Sites
                </h1>
            </div>

            <div className="h-[42px] mb-2 flex">
                <div
                    className="flex-1 bg-white max-w-36 justify-center items-center text-custom-grey rounded-[5px] drop-shadow">
                    <button className="p-2" onClick={() => navigate('/admin/sites/create')}>
                        <img src={AddSite} alt="Add" className="inline mr-2"/>
                        New Site
                    </button>
                </div>
                <div className="flex-1 ml-2 max-w-96">
                    <input
                        type="text"
                        placeholder="Search Sites..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-2 h-full rounded-[5px] drop-shadow"
                    />
                </div>
                <div className="flex flex-grow justify-end items-center">
                    <div className="relative w-full max-w-48 h-full bg-custom-lightgrey rounded-[5px]">
                        <div className="flex m-1 text-custom-grey rounded-[5px] items-center">
                            <button
                                className={`flex flex-grow h-[34px] justify-center items-center rounded-[5px] ${activeButton === 'all' ? 'bg-white' : 'bg-custom-lightgrey'} transition-colors duration-150`}
                                onClick={() => setActiveButton('all')}
                            >
                                All sites
                            </button>
                            <button
                                className={`flex flex-grow-2 h-[34px] justify-center items-center rounded-[5px] ${activeButton === 'archived' ? 'bg-white' : 'bg-custom-lightgrey'} transition-colors duration-150`}
                                style={{flexBasis: '60%'}}
                                onClick={() => setActiveButton('archived')}
                            >
                                <img src={Archive} alt="Archive" className="inline h-[23px] w-[23px] mr-1"/>
                                Archived
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white h-[87%] rounded-[5px] overflow-auto">
                <DisplaySiteList sites={sites} searchTerm={searchTerm}/>
            </div>

        </div>

    );
};

export default Sites;