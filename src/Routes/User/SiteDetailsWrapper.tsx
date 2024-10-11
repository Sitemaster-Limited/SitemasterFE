import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { SiteDetailsProvider } from "../../Context/SiteDetails";

const SiteDetailsWrapper: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get siteId and clientId from search parameters
  const siteId = searchParams.get('siteId') ?? undefined;
  const clientId = searchParams.get('clientId') ?? undefined;

  useEffect(() => {
    // Get current siteId and clientId from localStorage
    const storedSiteId = localStorage.getItem('siteId');
    const storedClientId = localStorage.getItem('clientId');

    // Check if siteId or clientId from searchParams differ from localStorage
    if (siteId && siteId !== storedSiteId) {
      localStorage.setItem('siteId', siteId);
    }
    if (clientId && clientId !== storedClientId) {
      localStorage.setItem('clientId', clientId);
    }
  }, [siteId, clientId]); // This will run whenever siteId or clientId changes

  return (
    <SiteDetailsProvider siteId={siteId} clientId={clientId}>
      <Outlet />
    </SiteDetailsProvider>
  );
};

export default SiteDetailsWrapper;
