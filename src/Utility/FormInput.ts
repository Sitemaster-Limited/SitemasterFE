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
    dateCreated: string;
    status: string;
    siteMedia: [];
    sites: Site[];
    siteAccess: [];
    // Employees List
    employees: [];

}


