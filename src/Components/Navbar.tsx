import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Images/SiteMasterLogo.png'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white text-black fixed top-0 md:h-full md:w-64 w-full">
            <Link to="/admin" id="nav-title" className="hidden md:block">
                <img src={Logo} alt="SITEMASTER" className="w-full"/>
            </Link>
            <div className="p-5 md:w-64 flex justify-end items-center">
                <button className="text-black md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                </button>
            </div>
            {/* Conditionally render links based on isOpen state */}
            <ul className={`mt-6 ${isOpen ? 'block' : 'hidden'} md:block`}>
                <li className="py-2 hover:bg-blue-600 cursor-pointer">
                    <Link to="/admin/sites" className="block text-black hover:text-white">Sites</Link>
                </li>
                <li className="py-2 hover:bg-blue-600  cursor-pointer">
                    <Link to="/admin/access" className="block text-black hover:text-white">Access</Link>
                </li>
                <li className="py-2 hover:bg-blue-600  cursor-pointer">
                    <Link to="/admin/settings" className="block text-black hover:text-white">Settings</Link>
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
