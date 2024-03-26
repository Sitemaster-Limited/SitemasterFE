import { Site } from './GlobalTypes'

export interface FormData {
    id: string;
    // Admin Info
    name: string;
    phoneNumber: string;
    email: string;
    // Site Info
    siteId: string;
    siteName: string;
    siteLocation: string;
    siteStatus: string;
    dateCreated: string;
    siteMedia: string[];
    sites: Site[];
    siteAccess: [];
    // Employees List
    employees: [];

}


