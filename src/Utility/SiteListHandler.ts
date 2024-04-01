import {SimpleSort, Site} from "./GlobalTypes";
import {Dispatch, SetStateAction} from 'react';

// Define the function types for setting state
type SetSortedListFunc = Dispatch<SetStateAction<Site[]>>;
type SetDirectionFunc = Dispatch<SetStateAction<SimpleSort>>;
export const sortSites = (key: keyof Site['siteInfo'], smplSort: SimpleSort, sites: Site[], setSortedList: SetSortedListFunc, setDirection: SetDirectionFunc) => {
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
    const sortedSites = [...sites].sort((a, b) => {
      const aValue = a.siteInfo[key];
      const bValue = b.siteInfo[key];
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
      setSortedList(sortedSites);
  } else {
    // Reset to the original order if unsorted
      setSortedList(sites);
  }

  // Updating direction based on the sort key provided
  setDirection({key, direction});
};