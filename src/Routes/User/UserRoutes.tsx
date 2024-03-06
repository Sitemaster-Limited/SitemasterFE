import { Routes, Route, Navigate } from 'react-router-dom';

import SitePage from './SitePage';
import ClockTime from "./ClockTime";


const SiteRoutes = () => {

    const siteName = "default";

    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate replace to={siteName} />} />
                <Route path={siteName} element={<SitePage />} />
                <Route path={`/${siteName}/time`} element={<ClockTime />} />
            </Routes>

        </>

    );
};

export default SiteRoutes;
