import React from 'react';

const Navbar = () => {
    return (
        <div className="h-full w-64 bg-gray-800 text-white fixed">
            <div className="p-5">Brand Logo</div>
            <ul className="mt-6">
                <li className="py-2 hover:bg-gray-700 cursor-pointer">Home</li>
                <li className="py-2 hover:bg-gray-700 cursor-pointer">About</li>
                <li className="py-2 hover:bg-gray-700 cursor-pointer">Services</li>
                <li className="py-2 hover:bg-gray-700 cursor-pointer">Contact</li>
            </ul>
        </div>
    );
};

export default Navbar;
