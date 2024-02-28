export type SiteList = {
    id: string;
    name: string;
    date: string;
    status: 'Active' | 'Saved' | 'Inactive';
};

export type SimpleSort = {
    key: keyof SiteList | null;
    direction: 'asc' | 'desc' | null;
};

export type SiteListProps = {
    sites: SiteList[];
    searchTerm?: string;
};
