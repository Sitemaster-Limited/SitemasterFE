import { useMemo } from 'react';
import { FormData } from '../Utility/FormInput';

export const useSiteData = (formData: Partial<FormData>) => {

    // Dependency on formData
    // left-hand side must match database field
    return useMemo(() => ({
        siteInfo: {
            name: formData.siteName || "default_site_name",
            location: formData.siteLocation || "default_site_location",
            status: formData.siteStatus || "Active",
            bluePrints: formData.siteMedia || [],
        },
        siteAccess: formData.siteAccess || [],
    }), [formData]);

};
