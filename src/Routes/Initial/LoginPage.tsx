import React from 'react';
import {useNavigate} from "react-router-dom";
import logo from '../../Images/SiteMasterLogo.png';
import SiteHeader from "../../Components/SiteHeader"; // Ensure the path is correct

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SiteHeader/>
      <div className="flex flex-col justify-center items-center h-screen">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-end">
              <div className="flex flex-col grow text-right font-semibold mb-2">
                <p> Log in to </p>
                <p> Manage sites </p>
                <p> Track employees </p>
                <p> Reduce time theft. </p>
              </div>
              <button onClick={() => navigate('/admin')}
                      className="bg-custom-red hover:bg-red-600 text-white font-bold py-2 px-4 rounded-[5px]">
                General Contractors
              </button>
            </div>
            <div className="flex flex-col justify-end items-start h-full">
              <button onClick={() => navigate('/login')}
                      className="bg-custom-black hover:bg-black text-white font-bold py-2 px-4 rounded-[5px]">
                On Site Workers
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              {/*Empty to fill space*/}
            </div>
            <div className="flex flex-col items-end">
              <div className="flex flex-col grow text-left font-semibold mt-2">
                <p> Scan your Sites QRCode </p>
                <p> Easily clock in and out</p>
                <p> Access up-to-date </p>
                <p> blueprints. </p>
              </div>
            </div>
          </div>
      </div>

    </>

  );
};

export default LoginPage;
