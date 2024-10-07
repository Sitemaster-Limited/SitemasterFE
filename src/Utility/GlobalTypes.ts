
export type Employee = {
    employeeId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export type SimpleSort = {
    key: keyof Site['siteInfo'] | keyof Employee | keyof Attendance | null;
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

export type ProgressReport = {
    projectName: string;
    projectManager: string;
    compiledBy: string;
    reportingPeriod: string;
    projectDueDate: string;
    dateSubmitted: string;
    summary: {
        item: string;
        currentStatus: 'On Time' | 'Delayed' | 'Changes Needed';
        priorStatus: 'On Time' | 'Delayed' | 'Changes Needed';
        summary: string;
    }
    tasks: {
        task: string;
        status: 'Finished' | 'In Progress' | 'Not Started';
        objective: string;
        plannedDate: string;
        actualDate: string;
        progressComplete: number,
        deliverable: string;
    }
    issues: {
        issue: string;
        identifiedDate: string;
        actionOrIgnore: 'Action' | 'Ignore';
        action: string;
        owner: string;
        resolved: 'Yes' | 'No';
    }
}

export type siteInfo = {
    siteId: string;
    dateCreated: string;
    siteName: string;
    siteLocation: string;
    siteStatus: 'Active' | 'Saved' | 'Inactive' | '';
    bluePrints: [];
    qrCode: [];
};

export type Site = {
    siteInfo: siteInfo;
    siteAccess: [];
    siteAttendance: Attendance[];
    siteProgressReport: ProgressReport[];
}

export let globalClientId: string | undefined = undefined;

export const setGlobalClientId = (id: string | undefined) => {
    globalClientId = id;
};



