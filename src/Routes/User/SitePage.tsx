import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {GetSites} from "../../Services/GetSites";

import Blueprint from '../../Images/Blueprints.png'
import Time from '../../Images/Time.png'

const SitePage = () => {
    const [siteName, setSiteName] = useState('');
    const [loading, setLoading] = useState(true); // Added loading state
    const location = useLocation();
    const navigate = useNavigate();

    const sName = "default";

    useEffect(() => {
        // Immediately invoked async function inside the useEffect
        (async () => {
            try {
                const sitesData = await GetSites();
                const query = new URLSearchParams(location.search);
                const siteId = query.get('siteId'); // Extract the 'siteId' query parameter

                // Find the matching site
                const matchingSite = sitesData.find(site => site.key === siteId);
                if (matchingSite) {
                    setSiteName(matchingSite.siteName); // Update siteName if a match is found
                } else {
                    setSiteName('No matching site'); // Update siteName to show no match found
                }
            } catch (error) {
                console.error('Failed to get sites', error);
                setSiteName('Failed to load site data'); // Handle error case
            } finally {
                setLoading(false); // Ensure loading is set to false after operation
            }
        })();
    }, [location.search]); // Depend on location.search to rerun if query parameters change

    // Render loading state, error message, or site name based on the state
    return (
        <>
            <div className="flex flex-col bg-custom-bg h-screen mt-20">
                <div className="grid grid-cols-2 mt-2 gap-4 px-4">
                    <button onClick={() => navigate(`time`)} className="bg-white w-full aspect-square rounded-lg shadow-md flex items-center justify-center p-4">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center rounded-full mb-2">
                                <img src={Time} alt="TIME" className="pt-1 rounded-[5px] w-full"/>
                            </div>
                        </div>
                    </button>

                    <button className="bg-white w-full aspect-square rounded-lg shadow-md flex items-center justify-center p-4">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center rounded-full mb-2">
                                <img src={Blueprint} alt="BlUEPRINTS" className="pt-1 rounded-[5px] w-full"/>
                            </div>
                        </div>
                    </button>

                </div>
            </div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <p>{siteName}</p>
                )}
            </div>
        </>
    );
};

export default SitePage;
