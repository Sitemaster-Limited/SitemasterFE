import React, { useState } from 'react';
import {SiteList, SimpleSort, SiteListProps} from '../Utility/GlobalTypes';
import { sortSites } from '../Utility/SiteListHandler'
import UpArrow from "../Images/UpArrow.png";
import DownArrow from "../Images/DownArrow.png";

const DisplaySiteList: React.FC<SiteListProps> = ({ sites }) => {
    const [sortedList, setSortedList] = useState<SiteList[]>(sites);
    const [smplSort, setDirection] = useState<SimpleSort>({ key: null, direction: null });

    const SortArrow: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
        if (direction === 'asc') {
            return <img className="inline ml-3" src={UpArrow} alt="Ascending" />;
        } else if (direction === 'desc') {
            return <img className="inline ml-3" src={DownArrow} alt="Descending" />;
        } else {
            return null;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                <tr className="w-full h-16 border-gray-300 border-b py-8">
                    <th className="text-left pl-8 cursor-pointer" onClick={() => sortSites('name', smplSort, sites, setSortedList, setDirection)}>
                        Name
                        {!smplSort.direction && (
                            <div className="relative ml-14 mt-[-16px] h-[12px]">
                                <img src={UpArrow} alt="Sort" className="absolute top-0 left-0 z-10" />
                                <img src={DownArrow} alt="Sort" className="absolute bottom-0 left-0" />
                            </div>
                        )}
                        <SortArrow direction={smplSort.key === 'name' && smplSort.direction ? smplSort.direction : null} />
                    </th>
                    <th className="text-left pl-8 cursor-pointer" onClick={() => sortSites('date', smplSort, sites, setSortedList, setDirection)}>
                        Date Created
                        {!smplSort.direction && (
                            <div className="relative ml-28 mt-[-16px] h-[12px]">
                                <img src={UpArrow} alt="Sort" className="absolute top-0 left-0 z-10" />
                                <img src={DownArrow} alt="Sort" className="absolute bottom-0 left-0" />
                            </div>
                        )}
                        <SortArrow direction={smplSort.key === 'date' && smplSort.direction ? smplSort.direction : null} />
                    </th>
                    <th className="text-left pl-8">Status</th>
                    <th className="text-left pl-8">Action</th>
                </tr>
                </thead>
                <tbody>
                {sortedList.map((property, index) => (
                    <tr className="h-16 border-gray-300 border-b" key={index}>
                        <td className="text-left pl-8">{property.name}</td>
                        <td className="text-left pl-8">{property.date}</td>
                        <td className="text-left pl-6">
                            <span className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${property.status.toLowerCase()}-200 text-${property.status.toLowerCase()}-800`}>
                              {property.status}
                            </span>
                        </td>
                        <td className="text-left pl-8">...</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DisplaySiteList;
