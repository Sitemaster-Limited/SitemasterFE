import React, {useState} from "react";
import {PostSite} from "../../Services/PostSite";
import {useFormContext} from "../../Context/LocalObjectForm";

import EmployeeSelection from "../../Components/EmployeeSelection";

import QRCode from "qrcode.react";
import {EmployeeList} from "../../Utility/GlobalTypes";

const CreateSite = () => {

    const {formData, updateFormData} = useFormContext();
    const [showQR, setShowQR] = useState(false);
    const [siteId, setSiteId] = useState('');

    const generateUniqueId = (name: string) => {
        return btoa(name).substring(0, 12); // Fine Encoding for now
    };

    const handleGenerateQR = () => {

        const name = String(formData.siteName);

        if (!name.trim()) { // Check if the name is empty or just whitespace
            alert('Please enter a name before generating a QR code.'); // Prompt the user
            return; // Exit the function early
        }
        const uniqueSiteId = generateUniqueId(name);
        setSiteId(uniqueSiteId);
        setShowQR(true);

        PostSite(name, uniqueSiteId).then(() => console.log("Upload handled"));
    };

    const employees: EmployeeList[] = [
        { id: '001', firstName: 'Ethan ', lastName: 'Fifle', phoneNumber: '123-423-4534' },
        { id:'002', firstName: 'Ilija', lastName: 'rasta', phoneNumber: '123-443-5434' },
        { id:'003', firstName: 'Andrew', lastName: 'brown', phoneNumber: '443-244-3434' },
        { id:'004', firstName: 'Jakub', lastName: 'smith', phoneNumber: '436-764-9753' },

        // ... other properties
    ];

    return (
        <div className="flex flex-col bg-custom-bg h-screen mt-16 md:mt-0 md:ml-64 p-2">

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
                        <label
                            className="flex flex-col rounded-lg border-4 border-dashed w-full h-32 p-10 group text-center">
                            <div className="h-full w-full text-center flex flex-col justify-center items-center">
                                <p className="pointer-none text-gray-500 "><span className="text-sm">Drag & Drop Materials</span> or
                                    click to select files</p>
                            </div>
                            <input type="file"
                                   className="hidden"/>
                        </label>
                    </div>
                </div>


                <div className="flex flex-col items-center justify-center space-y-4">
                    <button
                        onClick={handleGenerateQR}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Generate QR Code
                    </button>
                    {showQR && siteId && (
                        <QRCode value={`${process.env.REACT_APP_FE_URL}/site?siteId=${siteId}`} className="mt-4"/>
                    )}
                </div>
            </div>

        </div>

    );
};

export default CreateSite;
