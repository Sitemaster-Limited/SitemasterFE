import React from "react";
import PostAccount from "../../Services/PostAccount";
import { useAccountData } from "../../Hooks/AccountData";
import { useFormContext } from "../../Context/LocalObjectForm";

const Settings = () => {

    const { formData, updateFormData } = useFormContext();
    const apiData = useAccountData(formData);

    return (
      <div className="flex flex-col bg-custom-bg h-screen justify-center items-center mt-16 md:mt-0 md:ml-64 p-2">

          <div className="text-left mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
                  Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="site-name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => updateFormData({name: e.target.value})}
                placeholder="name..."/>
          </div>


          <div className="text-left mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
                  Phone number:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="site-location"
                type="text"
                value={formData.phoneNumber || ''}
                onChange={(e) => updateFormData({phoneNumber: e.target.value})}
                placeholder="phone number..."/>
          </div>

          <div className="text-left mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
                  Email:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="site-location"
                type="text"
                value={formData.email || ''}
                onChange={(e) => updateFormData({email: e.target.value})}
                placeholder="email..."/>
          </div>

          <div
            className="bg-white w-36 text-custom-grey rounded-[5px] drop-shadow">
              <button className="p-2" onClick={() => PostAccount(apiData)}>
                  Post Account
              </button>
          </div>
      </div>
    );
};

export default Settings;
