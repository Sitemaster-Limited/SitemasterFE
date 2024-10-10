import * as z from "zod";

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

export const ProgressReportSchema = z.object({
    reportId: z.string().optional(),
    projectName: z.string().min(1, 'Project Name is required'),
    projectManager: z.string().min(1, 'Project Manager is required'),
    compiledBy: z.string().min(1, 'Compiled By is required'),
    reportingPeriod: z.string().min(1, 'Reporting Period is required'),
    projectDueDate: z
      .string()
      .min(1, 'Project Due Date is required')
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
    dateSubmitted: z
      .string()
      .min(1, 'Date Submitted is required')
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
    summary: z
      .array(
        z.object({
            item: z.string().min(1, 'Item is required'),
            currentStatus: z.enum(['On Time', 'Delayed', 'Changes Needed']),
            priorStatus: z.enum(['On Time', 'Delayed', 'Changes Needed']),
            summary: z.string().optional(),
        })
      )
      .optional(),
    reportImages: z.array(z.string()).optional(),
    tasks: z
      .array(
        z.object({
            task: z.string().min(1, 'Task name is required'),
            status: z.enum(['Finished', 'In Progress', 'Not Started']),
            objective: z.string().optional(),
            plannedDate: z.string().optional(),
            actualDate: z.string().optional(),
            progressComplete: z.string(),
            deliverable: z.string().optional(),
        })
      )
      .optional(),
    issues: z
      .array(
        z.object({
            issue: z.string().min(1, 'Issue description is required'),
            identifiedDate: z
              .string()
              .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
            actionOrIgnore: z.enum(['Action', 'Ignore']),
            action: z.string().min(1, 'This field is required'),
            owner: z.string().min(1, 'Owner is required'),
            resolved: z.enum(['Yes', 'No']),
        })
      )
      .optional(),
});

// Infer the type from the Zod schema
export type ProgressReport = z.infer<typeof ProgressReportSchema>;

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
    siteProgressReports: ProgressReport[];
}

export let globalClientId: string | undefined = undefined;

export const setGlobalClientId = (id: string | undefined) => {
    globalClientId = id;
};



