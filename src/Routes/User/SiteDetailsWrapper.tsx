import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { SiteDetailsProvider } from "../../Context/SiteDetails";

const SiteDetailsWrapper: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const siteId = searchParams.get('siteId') ?? undefined;
  const clientId = searchParams.get('clientId') ?? undefined;

  return (

    <SiteDetailsProvider siteId={siteId} clientId={clientId}>
      <Outlet/>
    </SiteDetailsProvider>
  );
};

export default SiteDetailsWrapper;
