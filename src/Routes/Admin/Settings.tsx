import React, {useState, useEffect} from "react";
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAccountData } from "../../Hooks/AccountData";
import { useFormContext } from "../../Context/LocalObjectForm";

import InputMask from "react-input-mask";
import PostAccount from "../../Services/PostAccount";

const Settings = () => {

  const {formData, updateFormData} = useFormContext();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // State to hold the message

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

  const handleSave = async () => {
    setIsLoading(true); // Start loading
    setMessage(''); // Clear any previous messages
    try {
      const result = await PostAccount(apiData, token);
      if (typeof result === 'string') {
        setMessage("Your changes were saved successfully.");
      } else if (result === null) {
        setMessage("There was an error saving your changes.");
      }
    } catch (error) {
      setMessage("An error occurred on our end while trying to save your changes.");
      console.log("Error: " + error);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };


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
        <InputMask
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="site-location"
          type="text"
          value={formData.phoneNumber || ''}
          mask="(999)-999-9999"
          placeholder="(###)-###-####"
          onChange={(e) => updateFormData({phoneNumber: e.target.value})}
          />
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

      <div className="bg-white w-32 mt-2 text-custom-grey rounded-[5px] drop-shadow">
        <button className="p-2 flex mx-auto justify-center items-center" onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            // Inline SVG for loading spinner, adjust as needed
            <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path className="opacity-75" fill="red"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Save'
          )}
        </button>
      </div>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
};

export default Settings;
