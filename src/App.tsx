import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './Styling/App.css';

import LoginPage from "./Routes/LoginPage";
import SitePage from "./Routes/SitePage";
import AdministratorPage from "./Routes/Administrator";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/site" element={<SitePage/>}/>
                    <Route path="/admin" element={<AdministratorPage/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
