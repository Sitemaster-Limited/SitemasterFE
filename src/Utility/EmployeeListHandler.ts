import { SimpleSort, Employee } from "./GlobalTypes";
import { Dispatch, SetStateAction } from 'react';

// Define the function types for setting state
type SetSortedListFunc = Dispatch<SetStateAction<Employee[]>>;
type SetDirectionFunc = Dispatch<SetStateAction<SimpleSort>>;
export const sortEmployees = (key: keyof Employee, smplSort: SimpleSort, employees: Employee[], setSortedList: SetSortedListFunc, setDirection: SetDirectionFunc) => {
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
        const sortedList = [...employees].sort((a, b) => {
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
        setSortedList(employees);
    }

    setDirection({ key, direction });
};