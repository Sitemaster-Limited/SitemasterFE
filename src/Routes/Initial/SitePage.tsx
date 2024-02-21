import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GetSites } from "../../Services/GetSites";

const SitePage = () => {
    const [siteName, setSiteName] = useState('');
    const [loading, setLoading] = useState(true); // Added loading state
    const location = useLocation();

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
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <p>{siteName}</p>
            )}
        </div>
    );
};

export default SitePage;
