import { useMemo } from 'react';
import { FormData } from '../Utility/FormInput';

export const useSiteData = (formData: Partial<FormData>) => {

    // Dependency on formData
    return useMemo(() => ({
        siteInfo: {
            siteId: formData.siteId || "default_ID",
            siteName: formData.siteName || "default_site_name",
            siteLocation: formData.siteLocation || "default_site_location",
            dateCreated: formData.dateCreated || "unknown",
            status: formData.status || "unknown",
            siteMedia: formData.siteMedia || [],
        },
        siteAccess: formData.siteAccess || [],
    }), [formData]);

};
