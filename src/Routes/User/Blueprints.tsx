import React from 'react';
import { useSiteDetails } from "../../Context/SiteDetails";

const Blueprints = () => {
  const { siteDetails } = useSiteDetails();
  const blueprints = siteDetails?.siteInfo.bluePrints;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4 mt-20">
      {blueprints?.map((blueprintUrl, index) => (
        <div key={index} className="w-full">
          <img src={blueprintUrl} alt={`Blueprint ${index + 1}`} className="w-full h-auto" />
        </div>
      ))}
    </div>
  );
};

export default Blueprints;
