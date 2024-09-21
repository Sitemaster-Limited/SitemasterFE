export type SiteList = {
    id: string;
    name: string;
    date: string;
    status: 'Active' | 'Saved' | 'Inactive' | '';
};

export type Employee = {
    employeeId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export type SimpleSort = {
    key: keyof Site['siteInfo'] | keyof Employee | null;
    direction: 'asc' | 'desc' | null;
};

export type EmployeeListProps = {
    employees: Employee[];
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
    employees: Employee[];
};

export type Attendance = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    type: string;
    time: string;
    latitude: string;
    longitude: string;
    accuracy: string;
};

export type Site = {
    siteInfo: {
        siteId: string;
        dateCreated: string;
        siteName: string;
        siteLocation: string;
        siteStatus: 'Active' | 'Saved' | 'Inactive' | '';
        bluePrints: [];
        qrCode: [];
    };
    siteAccess: [];
    siteAttendance: Attendance[];
}

export let globalClientId: string | undefined = undefined;

export const setGlobalClientId = (id: string | undefined) => {
    globalClientId = id;
};



