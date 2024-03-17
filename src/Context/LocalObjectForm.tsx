// Assuming you have a separate file for types, e.g., types.ts
import React, { createContext, useContext, useState } from 'react';
import { FormData } from '../Utility/FormInput';

// Initialize with Partial to allow empty initial state
const defaultContext: {
    formData: Partial<FormData>;
    updateFormData: (updates: { [key: string]: any }) => void;
} = {
    formData: {},
    updateFormData: () => {}, //dummy function for default context
};

interface AppProviderProps {
    children: React.ReactNode;
}

const FormContext = createContext(defaultContext);
export const useFormContext = () => useContext(FormContext);

export const FormProvider: React.FC<AppProviderProps> = ({ children }) => {

    // Initialize formData
    const [formData, setFormData] = useState<Partial<FormData>>({
        id: '',
        name: '',
        phoneNumber: '',
        email: '',
        siteId: '',
        siteName: '',
        siteLocation: '',
        siteStatus: '',
        dateCreated: '',
        sites: [],
        siteMedia: [],
        siteAccess: [],
        employees: [],

    });
    const updateFormData = (updates: { [key: string]: any }) => {
        setFormData((prevData) => ({
            ...prevData,
            ...updates
        }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormContext.Provider>
    );
};
