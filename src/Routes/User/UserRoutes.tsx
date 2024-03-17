import { Routes, Route } from 'react-router-dom';

import SitePage from './SitePage';
import ClockTime from "./ClockTime";
import DefaultSignIn from "./DefaultSignIn";

const SiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultSignIn />} />
      <Route path="/site" element={<SitePage />} />
      <Route path="/site/time" element={<ClockTime />} />
    </Routes>
  );
};

export default SiteRoutes;
