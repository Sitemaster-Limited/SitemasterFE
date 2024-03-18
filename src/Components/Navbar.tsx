import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {SignOutButton} from '@clerk/clerk-react';

import Logo from '../Images/SiteMasterLogo.png'
import Sites from '../Images/SiteIcon.png'
import Employees from '../Images/EmployeeIcon.png'
import Settings from '../Images/SettingsIcon.png'


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-custom-bg fixed top-0 py-2 pl-2 pr-2 md:pr-0 md:h-full md:w-64 w-full z-20">
      <div
        className="bg-custom-black h-full rounded-[5px] flex flex-col justify-between"> {/* Adjusted for flex layout */}
        <div>
          <Link to="/admin" id="nav-title" className="hidden md:block">
            <img src={Logo} alt="SITEMASTER" className="pt-1 w-full"/>
          </Link>
          <div className="p-5 md:p-2 md:w-64 flex justify-end items-center">
            <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            </button>
          </div>
          {/* Conditionally render links based on isOpen state */}
          <ul className={`${isOpen ? 'block bg-custom-red' : 'hidden'} md:block`}>
            <li className="py-2 hover:bg-custom-red cursor-pointer">
              <div onClick={() => setIsOpen(false)}>
                <Link to="/admin/sites" className="md:ml-4 block text-white">
                  <div className="flex items-center justify-center md:justify-start">
                    <img src={Sites} alt="" className="hidden md:inline mr-2"/>
                    Sites
                  </div>
                </Link>
              </div>
            </li>
            <li className="py-2 hover:bg-custom-red cursor-pointer">
              <div onClick={() => setIsOpen(false)}>
                <Link to="/admin/employees" className="md:ml-4 block text-white">
                  <div className="flex items-center justify-center md:justify-start">
                    <img src={Employees} alt="" className="hidden md:inline mr-2"/>
                    Employees
                  </div>
                </Link>
              </div>
            </li>
            <li className="py-2 hover:bg-custom-red cursor-pointer">
              <div onClick={() => setIsOpen(false)}>
                <Link to="/admin/settings" className="md:ml-4 block text-white">
                  <div className="flex items-center justify-center md:justify-start">
                    <img src={Settings} alt="" className="hidden md:inline mr-2"/>
                    Settings
                  </div>
                </Link>
              </div>
            </li>
          </ul>
        </div>
        {/* SignOutButton placed at the bottom */}
        <div className="p-4">
          <SignOutButton>
              <Link className="text-white py-2 px-4 w-full"
                           to="/">
                  Sign Out
              </Link>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
