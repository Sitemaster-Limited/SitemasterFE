import {SimpleSort, SiteList} from "./GlobalTypes";
import { Dispatch, SetStateAction } from 'react';

// Define the function types for setting state
type SetSortedListFunc = Dispatch<SetStateAction<SiteList[]>>;
type SetDirectionFunc = Dispatch<SetStateAction<SimpleSort>>;
export const sortSites = (key: keyof SiteList, smplSort: SimpleSort, sites: SiteList[], setSortedList: SetSortedListFunc, setDirection: SetDirectionFunc) => {
    let direction: 'asc' | 'desc' | null = smplSort.direction;
    if (smplSort.key === key) {
        switch (smplSort.direction) {
            case 'asc':
                direction = 'desc';
                break;
            case 'desc':
                direction = null; // Reset to unsorted state
                break;
            default:
                direction = 'asc';
        }
    } else {
        direction = 'asc';
    }

    if (direction) {
        const sortedList = [...sites].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setSortedList(sortedList);
    } else {
        // Reset to the original order if unsorted
        setSortedList(sites);
    }

    setDirection({ key, direction });
};