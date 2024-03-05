import { Site } from './GlobalTypes'

export interface FormData {
    id: string;
    // Admin Info
    name: string;
    phoneNumber: string;
    email: string;
    // Site Info
    siteName: string;
    siteLocation: string;
    siteMedia: [];
    sites: Site[];
    siteAccess: [];
    // Employees List
    employees: [];

}


