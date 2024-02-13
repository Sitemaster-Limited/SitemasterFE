import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import {PostSite} from "../Services/PostSite";
const AdministratorPage = () => {
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
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
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
                <QRCode value={`${process.env.REACT_APP_FE_URL}/site?siteId=${siteId}`} className="mt-4" />
            )}
        </div>
    );
};

export default AdministratorPage;
