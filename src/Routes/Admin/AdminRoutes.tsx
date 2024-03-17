import { Routes, Route, Navigate } from 'react-router-dom';

import Sites from './Sites';
import CreateSite from "./CreateSite";
import Settings from './Settings';
import Employees from './Employees';

const AdministratorPage = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate replace to="sites" />} />
                <Route path="sites" element={<Sites />} />
                <Route path="sites/create" element={<CreateSite />} />
                <Route path="employees" element={<Employees />} />
                <Route path="settings" element={<Settings />} />
            </Routes>

        </>

    );
};

export default AdministratorPage;
