import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../Images/SiteMasterLogo.png'; // Ensure the path is correct
import Navbar from '../Components/Navbar'

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar/>
            <div className="flex flex-col mr-64 justify-center items-center h-screen">
                {/* Logo Image */}
                <img src={logo} alt="SiteMaster Logo" className="mb-20 w-[300px]" /> {/* Adjust margin-bottom as needed */}

                {/* Buttons Container */}
                <div className="flex justify-center items-center space-x-4" >
                    <button onClick={() => navigate('/admin')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-[5px]">
                        General Contractors
                    </button>
                    <button onClick={() => navigate('/site')}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-[5px]">
                        On Site Workers
                    </button>
                </div>
            </div>
        </>

    );
};

export default LoginPage;
