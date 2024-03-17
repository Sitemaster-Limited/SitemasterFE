import { useMemo } from 'react';
import { FormData } from '../Utility/FormInput';

export const useAccountData = (formData: Partial<FormData>) => {

    // Dependency on formData
    // Customer model in the BE
    return useMemo(() => ({
        id: formData.id || "default_id",
        administrator: {
            name: String(formData.name || "account_holder_name"),
            phoneNumber: String(formData.phoneNumber || "account_holder_phone_number"),
            email: String(formData.email || "account_holder_email"),
        },
        sites: formData.sites || [],
        employees: formData.employees || []
    }), [formData]);

};
