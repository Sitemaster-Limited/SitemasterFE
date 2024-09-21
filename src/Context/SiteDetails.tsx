import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Site } from "../Utility/GlobalTypes";
import GetSite from "../Services/GetSite";
import { setGlobalClientId } from "../Utility/GlobalTypes";

interface SiteDetailsContextValue {
  siteDetails: Site | null;
  loading: boolean;
}

// Initializing the context with default values
const SiteDetailsContext = createContext<SiteDetailsContextValue>({ siteDetails: null, loading: true });

// Custom hook to consume the context
export const useSiteDetails = () => useContext(SiteDetailsContext);

interface SiteDetailsProviderProps {
  children: ReactNode;
  siteId?: string;
  clientId?: string;
}

export const SiteDetailsProvider: React.FC<SiteDetailsProviderProps> = ({ children, siteId, clientId }) => {
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setGlobalClientId(clientId);
    const fetchSiteDetails = async () => {
      // Early exit if siteId or clientId are not provided
      if (!siteId || !clientId) {
        console.warn("Site ID or Client ID is not provided. Unable to fetch site details.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Assuming GetSite is an async function that fetches the site details
        const details: Site = await GetSite(siteId, clientId);
        setSiteDetails(details);
      } catch (error) {
        console.error("An error occurred while fetching site details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDetails();
  }, [siteId, clientId]);

  return (
    <SiteDetailsContext.Provider value={{ siteDetails, loading }}>
      {children}
    </SiteDetailsContext.Provider>
  );
};
