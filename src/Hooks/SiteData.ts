import { useMemo } from 'react';
import { FormData } from '../Utility/FormInput';

export const useSiteData = (formData: Partial<FormData>) => {

    // Dependency on formData
    // left-hand side must match database field
    return useMemo(() => ({
        siteInfo: {
            siteId: formData.siteId || "default_ID",
            dateCreated: formData.dateCreated || "unknown",
            siteName: formData.siteName || "default_site_name",
            siteLocation: formData.siteLocation || "default_site_location",
            siteStatus: formData.siteStatus || "Active",
            bluePrints: formData.siteMedia || [],
        },
        siteAccess: formData.siteAccess || [],
    }), [formData]);

};
