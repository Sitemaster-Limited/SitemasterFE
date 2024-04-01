import { useMemo } from 'react';
import { FormData } from '../Utility/FormInput';

export const useSiteData = (formData: Partial<FormData>) => {

    // Dependency on formData
    // left-hand side must match database field
    return useMemo(() => ({
        siteInfo: {
            siteId: String(formData.siteId || "unknown"),
            dateCreated: String(formData.dateCreated || new Date().toLocaleDateString()),
            siteName: String(formData.siteName || "default_site_name"),
            siteLocation: String(formData.siteLocation || "default_site_location"),
            siteStatus: String(formData.siteStatus || "Active"),
            bluePrints: formData.siteMedia || [],
            qrCode: []
        },
        siteAccess: formData.siteAccess || [],
    }), [formData]);

};
