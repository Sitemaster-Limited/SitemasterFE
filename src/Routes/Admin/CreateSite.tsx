import React, {useEffect, useState} from "react";
import {useFormContext} from "../../Context/LocalObjectForm";
import {useSiteData} from "../../Hooks/SiteData";
import {Employee} from "../../Utility/GlobalTypes";

import QRCode from "qrcode.react";
import AddSite from "../../Services/AddSite";
import PostImages from "../../Services/PostImages";
import GenerateSiteId from "../../Utility/GenerateSiteId";
import EmployeeSelection from "../../Components/EmployeeSelection";
import {useAuth} from "@clerk/clerk-react";

const CreateSite = () => {

  const {formData, updateFormData} = useFormContext();
  const [showQR, setShowQR] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const apiData = useSiteData(formData);
  const auth = useAuth();
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const jwt = await auth.getToken({template: 'SitemasterBE'});
      if (jwt !== null) {
        setToken(jwt);
      } else {
        setToken(''); // No valid token
      }
    };

    fetchToken().then(() => console.log(`new token fetched: ${token}`));
  }, []);

  const [employees, setEmployees] = useState<Employee[]>(formData.employees || []);
  useEffect(() => {
    if (formData.employees) {
      setEmployees(formData.employees);
    }
  }, [formData.employees]);


  // State to track if the QR code generation was triggered
  const [qrGenerationInitiated, setQrGenerationInitiated] = useState(false);

  const handleGenerateQR = () => {
    const name = String(formData.siteName);
    if (!name.trim()) {
      alert('Please enter a name before generating a QR code.');
      return;
    }

    updateFormData({
      siteId: GenerateSiteId(name),
      dateCreated: new Date().toLocaleDateString(),
      siteStatus: "Active"
    });

    setShowQR(true);
    setQrGenerationInitiated(true); // Set the flag to true
  };

  useEffect(() => {
    if (qrGenerationInitiated) {
      // Now this block runs after formData has been updated, and consequently, apiData
      AddSite(apiData, formData.email || "",); // need to change from email to id at some point
      PostImages(formData.siteId,
        formData.email,
        files,
        token,
        "Blueprints").then(() => console.log("image posted"));
      updateFormData({sites: [...(formData.sites || []), apiData]});

      setQrGenerationInitiated(false); // Reset the flag
      // Implement clear the form here if needed
    }
  }, [qrGenerationInitiated, apiData, formData.email, formData.sites, updateFormData]); // Depend on qrGenerationInitiated and potentially apiData

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }

  };

  const handleDeleteFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  useEffect(() => {
    updateFormData({siteMedia: files});
  }, [files]);

  return (
    <div className="flex flex-col bg-custom-bg h-screen mt-20 md:mt-0 md:ml-64 p-2">

      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">
          Create A Site
        </h1>
      </div>

      <div className="text-left mb-2">
        <p>
          Here is where you can create your site specific QR code
        </p>
      </div>

      <div className="md:w-1/2">
        <div className="text-left mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
            Give your site a name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="site-name"
            type="text"
            value={formData.siteName || ''}
            onChange={(e) => updateFormData({siteName: e.target.value})}
            placeholder="name..."/>
        </div>


        <div className="text-left mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
            Where is you site located? (appx.)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="site-location"
            type="text"
            value={formData.siteLocation || ''}
            onChange={(e) => updateFormData({siteLocation: e.target.value})}
            placeholder="site location..."/>
        </div>


        <div className="text-left mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-name">
            Who has access to your site?
          </label>
          <EmployeeSelection employees={employees}/>
        </div>

        <div className="text-left mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site-blueprints">
            Upload any site blueprints:
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
          <div className="grid grid-cols-3 gap-4 p-4 max-h-[200px] overflow-auto mt-4">
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
          <button
            onClick={handleGenerateQR}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Generate QR Code
          </button>
          {showQR && (
            <QRCode
              value={`${process.env.REACT_APP_FE_URL}login/site?siteId=${formData.siteId}&clientId=${formData.email}`}
              className="mt-4"/>
          )}
        </div>
      </div>

    </div>

  );
};

export default CreateSite;
