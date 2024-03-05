export type SiteList = {
    id: string;
    name: string;
    date: string;
    status: 'Active' | 'Saved' | 'Inactive' | '';
};

export type EmployeeList = {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export type SimpleSort = {
    key: keyof SiteList | keyof EmployeeList | null;
    direction: 'asc' | 'desc' | null;
};

export type SiteListProps = {
    sites: SiteList[];
    searchTerm?: string;
};

export type EmployeeListProps = {
    employees: EmployeeList[];
    searchTerm?: string;
};

export type Account = {
    id: string;
    administrator: {
        name: string;
        phoneNumber: string;
        email: string;
    };
    sites: Site[];
    employees: [];
};

export type Site = {
    siteInfo: {
        siteName: string;
        siteLocation: string;
        siteMedia: [];
    };
    siteAccess: [];
}



