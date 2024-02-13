import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GetSites } from "../Services/GetSites";

const SitePage = () => {
    // Updated state to hold objects with key and siteName
    const [sites, setSites] = useState<{ key: string; siteName: string }[]>([]);
    const [isValidSiteId, setIsValidSiteId] = useState(false);
    const [siteName, setSiteName] = useState('');

    useEffect(() => {
        const getObjectNames = async () => {
            const sitesData = await GetSites();
            setSites(sitesData);
        };

        getObjectNames();
    }, []);

    // You can use it to access the query parameters.
    const location = useLocation();

    // A function to parse the query parameters from the URL
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();
    const siteId = query.get('siteId'); // Extract the 'siteId' query parameter

    // Check if siteId matches any of the keys in sites
    useEffect(() => {
        const matchingSite = sites.find(site => site.key === siteId);
        if (matchingSite) {
            setIsValidSiteId(true);
            setSiteName(matchingSite.siteName); // Update siteName state if a match is found
        } else {
            setIsValidSiteId(false);
        }
    }, [siteId, sites]); // Depend on siteId and sites so it updates accordingly

    return (
        <div>
            {isValidSiteId ? (
                <p>Site Name: {siteName}</p>
            ) : (
                <p>No Unique ID provided or ID does not match.</p>
            )}
        </div>
    );
};

export default SitePage;
