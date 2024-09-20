import React, { useState } from 'react';
import { useSiteDetails } from "../../Context/SiteDetails";

const Blueprints = () => {
  const { siteDetails } = useSiteDetails();
  const blueprints = siteDetails?.siteInfo.bluePrints;
  // State to manage modal visibility and the selected image URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState('');

  // Function to open the modal with the selected image
  const openModal = (blueprintUrl: string) => {
    setSelectedBlueprint(blueprintUrl);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative mt-20 h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {blueprints?.map((blueprintUrl, index) => (
          <div key={index} className="w-full cursor-pointer">
            <img
              src={blueprintUrl}
              alt={`Blueprint ${index + 1}`}
              className="w-full h-auto"
              onClick={() => openModal(blueprintUrl)} // Set the onClick handler
            />
          </div>
        ))}
      </div>
      {isModalOpen && ( // Conditional rendering for the modal
        <div className="fixed inset-0 mt-20 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4">
            <img src={selectedBlueprint} alt="Selected Blueprint" className="w-auto h-auto max-w-full max-h-[70vh]" />
            <button onClick={closeModal} className="mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blueprints;
