import React, {useState} from "react";
import {PostSite} from "../../Services/PostSite";
import {useFormContext} from "../../Context/LocalObjectForm";

import QRCode from "qrcode.react";

const CreateSite = () => {

    const {formData, updateFormData} = useFormContext();
    const [showQR, setShowQR] = useState(false);
    const [name, setName] = useState('');
    const [siteId, setSiteId] = useState('');

    const generateUniqueId = (name: string) => {
        return btoa(name).substring(0, 12); // Fine Encoding for now
    };

    const handleGenerateQR = () => {
        if (!name.trim()) { // Check if the name is empty or just whitespace
            alert('Please enter a name before generating a QR code.'); // Prompt the user
            return; // Exit the function early
        }
        const uniqueSiteId = generateUniqueId(name);
        setSiteId(uniqueSiteId);
        setShowQR(true);

        PostSite(name, uniqueSiteId).then(() => console.log("Upload handled"));
    };

    return (
        <div className="lex flex-col bg-custom-bg h-screen mt-16 md:mt-0 md:ml-64 p-2">

            <div
                className=" h-[8%] flex items-center space-x-2 bg-white border-2 rounded-lg p-4 shadow-md mb-4">
                <span className="font-semibold px-1">Site Name</span>
                <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => updateFormData({name: e.target.value})}
                    placeholder="name..."
                    className="flex-1 rounded-lg py-1 px-2 text-sm outline-none border border-black"
                />
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your site name"
                    className="px-4 py-2 border rounded"
                />
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

    );
};

export default CreateSite;
