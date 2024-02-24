import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../Images/SiteMasterLogo.png'
import Sites from '../Images/Sites.png'
import Employees from '../Images/Employees.png'
import Settings from '../Images/Settings.png'


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-custom-red md:bg-white text-black fixed top-0 md:h-full md:w-64 w-full z-20">
            <Link to="/admin" id="nav-title" className="hidden md:block">
                <img src={Logo} alt="SITEMASTER" className="w-full"/>
            </Link>
            <div className="p-5 md:p-2 md:w-64 flex justify-end items-center">
                <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                </button>
            </div>
            {/* Conditionally render links based on isOpen state */}
            <ul className={`${isOpen ? 'block bg-white' : 'hidden'} md:block`}>
                <li className="py-2 hover:bg-blue-600 cursor-pointer">
                    <Link to="/admin/sites" className="md:ml-4 block text-black hover:text-white">
                        <div className="flex items-center justify-center md:justify-start">
                            <img src={Sites} alt="" className="hidden md:inline mr-2"/>
                            Sites
                        </div>
                    </Link>
                </li>
                <li className="py-2 hover:bg-blue-600 cursor-pointer">
                    <Link to="/admin/access" className="md:ml-4 block text-black hover:text-white">
                        <div className="flex items-center justify-center md:justify-start">
                            <img src={Employees} alt="" className="hidden md:inline mr-2"/>
                            Employees
                        </div>
                    </Link>
                </li>
                <li className="py-2 hover:bg-blue-600 cursor-pointer">
                    <Link to="/admin/settings" className="md:ml-4 block text-black hover:text-white">
                        <div className="flex items-center justify-center md:justify-start">
                            <img src={Settings} alt="" className="hidden md:inline mr-2"/>
                            Settings
                        </div>
                    </Link>
                </li>
            </ul>

        </div>
    );
};

export default Navbar;
