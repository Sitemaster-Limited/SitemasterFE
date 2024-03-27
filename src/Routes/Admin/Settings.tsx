import React, {useState, useEffect} from "react";
import PostAccount from "../../Services/PostAccount";
import {useAccountData} from "../../Hooks/AccountData";
import {useFormContext} from "../../Context/LocalObjectForm";
import { useAuth, useUser } from '@clerk/clerk-react';

const Settings = () => {

  const {formData, updateFormData} = useFormContext();
  const [token, setToken] = useState('');
  const apiData = useAccountData(formData);
  const auth = useAuth();
  const user = useUser();

  useEffect(() => {
    const fetchToken = async () => {
        const jwt = await auth.getToken({template: 'SitemasterBE'});
        if (jwt !== null) {
          setToken(jwt);
        } else {
          setToken(''); // No valid token
        }
    };

    fetchToken().then(() => console.log(`new token fetched`));
    updateFormData({ email: user.user?.primaryEmailAddress?.emailAddress}); // Initialize formData
  }, []);

  return (
    <div className="flex flex-col bg-custom-bg h-screen justify-center items-center mt-16 md:mt-0 md:ml-64 p-2">

      <div className="text-left w-64 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
          Company name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="site-name"
          type="text"
          value={formData.name || ''}
          onChange={(e) => updateFormData({name: e.target.value})}
          placeholder="Sitemaster ltd."/>
      </div>


      <div className="text-left w-64 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
          Company phone number:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="site-location"
          type="text"
          value={formData.phoneNumber || ''}
          onChange={(e) => updateFormData({phoneNumber: e.target.value})}
          placeholder="phone number..."/>
      </div>

      <div className="text-left w-64 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
          Email:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="site-location"
          type="text"
          value={user.user?.primaryEmailAddress?.emailAddress || ''}
          onChange={(e) => updateFormData({email: e.target.value})}
          placeholder="email..."/>
      </div>

      <div
        className="bg-white w-32 mt-2 text-custom-grey rounded-[5px] drop-shadow">
        <button className="p-2" onClick={() => PostAccount(apiData, token)}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
