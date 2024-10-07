import React, {useEffect, useState,} from "react";
import {Employee} from "../../../../Utility/GlobalTypes";
import {useFormContext} from "../../../../Context/LocalObjectForm";
import {useSiteData} from "../../../../Hooks/SiteData";
import {useLocation} from 'react-router-dom';
import {useAuth} from "@clerk/clerk-react";

import EmployeeSelection from "../../../../Components/EmployeeSelection";

import Autocomplete from 'react-google-autocomplete';

const EditSite = () => {

  const auth = useAuth();
  const location = useLocation();
  const [localSite, setLocalSite] = useState(location.state?.site);

  const {formData, updateFormData} = useFormContext();
  const [token, setToken] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const apiData = useSiteData(formData);

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
  }, []);

  const [employees, setEmployees] = useState<Employee[]>(formData.employees || []);
  useEffect(() => {
    if (formData.employees) {
      setEmployees(formData.employees);
    }
  }, [formData.employees]);

  const handleSiteName = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the localSite state with the new siteName
    const updatedSite = {
      ...localSite,
      siteInfo: {
        ...localSite.siteInfo,
        siteName: event.target.value,
      },
    };
    setLocalSite(updatedSite);
  };

  const handleSiteLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the localSite state with the new siteName
    const updatedSite = {
      ...localSite,
      siteInfo: {
        ...localSite.siteInfo,
        siteLocation: event.target.value,
      },
    };
    setLocalSite(updatedSite);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }

  };

  const handleDeleteFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleSave = () => {

  }

  return (
    <div className="flex flex-col p-4">

      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">
          Update Your Site
        </h1>
      </div>

      <div className="text-left mb-2">
        <p>
          Here is where you can update your site
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 p-2">
        <div className="order-2 md:order-1">
          <div className="text-left mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
              Site name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="site-name"
              type="text"
              value={localSite?.siteInfo.siteName || ''}
              onChange={handleSiteName}
              placeholder="name..."/>
          </div>

          <div className="text-left mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-location">
              Site location: (appx.)
            </label>
            <Autocomplete
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              apiKey={process.env.REACT_APP_GOOGLE_API_KEY} // Ensure you have this API key in your environment variables
              onPlaceSelected={handleSiteLocation}
              options={{
                types: ["geocode", "establishment"], // Can adjust based on your needs
              }}
              defaultValue={localSite?.siteInfo.siteLocation || ''}
            />
          </div>

          <div className="text-left mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
              Add site access:
            </label>
            <EmployeeSelection employees={employees}/>
          </div>

          <div className="text-left mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-blueprints">
              Upload or update blueprints:
            </label>
            <div className="flex justify-center items-center w-full">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-32 p-10 group text-center">
                <div className="h-full w-full text-center flex flex-col justify-center items-center">
                  <p className="pointer-none text-gray-500"><span className="text-sm">Drag & Drop Materials</span> or
                    click to select files</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} multiple/>
              </label>
            </div>
            {/* This div is moved outside and below the drag and drop container */}
            <div className="grid grid-cols-3 gap-4 p-4 max-h-[250px] overflow-auto mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover"/>
                  <button
                    className="absolute top-0 right-0 w-6 h-6 rounded-md bg-red-500 text-white flex justify-center items-center p-0"
                    onClick={() => handleDeleteFile(index)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round" className="w-4 h-4">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            {message && <div className="mt-2 text-sm">{message}</div>}
            <button
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </div>
        <div className="order-1 md:order-2 flex flex-col items-center md:px-6">
          <div className="text-md font-bold mb-2">Site Access:</div>
          {localSite.siteAccess && localSite.siteAccess.length > 0 ? (
            <table className="w-fit leading-normal">
              <thead>
              <tr>
                <th
                  className="rounded-l-[5px] px-5 py-3 border-b-2 border-gray-200 bg-custom-red text-left text-xs font-bold text-white uppercase tracking-wider">
                  First name
                </th>
                <th
                  className=" px-5 py-3 border-b-2 border-gray-200 bg-custom-red text-left text-xs font-bold text-white uppercase tracking-wider">
                  Last name
                </th>
                <th
                  className="rounded-r-[5px] px-5 py-3 border-b-2 border-gray-200 bg-custom-red text-left text-xs font-bold text-white uppercase tracking-wider">
                  Phone
                </th>
              </tr>
              </thead>
              <tbody>
              {localSite.siteAccess.map((employee: Employee, index: number) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    {employee.firstName}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    {employee.lastName}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    {employee.phoneNumber}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <div>No employees have access to this site.</div>
          )}
          <div className="flex justify-center items-center mt-4">
            <div className="flex flex-col justify-center items-center">
              <h1 className="font-semibold text-xl mb-4">
                Custom Site QR Code:
              </h1>
              <div className="w-[250px] h-[250px] inline-block mb-4">
                <img src={String(localSite?.siteInfo.qrCode)} alt="QRCode"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSite;
