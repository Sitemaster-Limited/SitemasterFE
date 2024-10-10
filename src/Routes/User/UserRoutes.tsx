import { Routes, Route } from 'react-router-dom';

import SitePage from './SitePage';
import ClockTime from "./ClockTime";
import Blueprints from "./Blueprints";
import DefaultSignIn from "./DefaultSignIn";
import SiteProgressReport from "./ProgressReport/ProgressRPT";
import SiteDetailsWrapper from "./SiteDetailsWrapper";
import ViewProgressReport from "./ProgressReport/ViewProgressRPT";

const SiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultSignIn />} />
      <Route element={<SiteDetailsWrapper />}>
        <Route path={"/site"} element={<SitePage />} />
        <Route path="/site/time" element={<ClockTime />} />
        <Route path="/site/blueprints" element={<Blueprints />} />
        <Route path="/site/progress-reports" element={<SiteProgressReport />} />
        <Route path="/site/progress-reports/view-report" element={<ViewProgressReport />} />
      </Route>
    </Routes>
  );
};

export default SiteRoutes;
