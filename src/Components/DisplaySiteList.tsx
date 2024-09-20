import React, {useState, useEffect} from 'react';
import {SimpleSort} from '../Utility/GlobalTypes';
import {useFormContext} from "../Context/LocalObjectForm";
import {sortSites} from '../Utility/SiteListHandler';

import SiteAction from "./SiteAction";

import UpArrow from '../Images/UpArrow.png';
import DownArrow from '../Images/DownArrow.png';

type SearchProps = {
  searchTerm?: string;
}

const DisplaySiteList: React.FC<SearchProps> = ({searchTerm}) => {

  const {formData} = useFormContext();
  const [sortedList, setSortedList] = useState(formData.sites || []);
  const [smplSort, setDirection] = useState<SimpleSort>({key: null, direction: null});

  useEffect(() => {
    setSortedList(formData.sites || []);
  }, [formData.sites]);

  // Filter sites based on searchTerm
  const filteredSites = (searchTerm || "").trim() ? sortedList.filter(site =>
    site.siteInfo.siteName.toLowerCase().includes((searchTerm || "").toLowerCase())
  ) : sortedList;

  const SortArrow: React.FC<{ direction: 'asc' | 'desc' | null }> = ({direction}) => {
    if (direction === 'asc') {
      return <img className="inline ml-3" src={UpArrow} alt="Ascending"/>;
    } else if (direction === 'desc') {
      return <img className="inline ml-3" src={DownArrow} alt="Descending"/>;
    } else {
      return null;
    }
  };

  return (
    <div className="">
      <table className="min-w-full bg-white">
        <thead>
        <tr className="w-full h-16 border-gray-300 border-b py-8">
          <th className="text-left pl-8 cursor-pointer"
              onClick={() => sortSites('siteName', smplSort, sortedList, setSortedList, setDirection)}>
            Name
            {!smplSort.direction && (
              <div className="relative ml-14 mt-[-16px] h-[12px]">
                <img src={UpArrow} alt="Sort" className="absolute top-0 left-0 z-10"/>
                <img src={DownArrow} alt="Sort" className="absolute bottom-0 left-0"/>
              </div>
            )}
            <SortArrow
              direction={smplSort.key === 'siteName' && smplSort.direction ? smplSort.direction : null}/>
          </th>
          <th className="text-left pl-8 cursor-pointer"
              onClick={() => sortSites('dateCreated', smplSort, sortedList, setSortedList, setDirection)}>
            Date Created
            {!smplSort.direction && (
              <div className="relative ml-28 mt-[-16px] h-[12px]">
                <img src={UpArrow} alt="Sort" className="absolute top-0 left-0 z-10"/>
                <img src={DownArrow} alt="Sort" className="absolute bottom-0 left-0"/>
              </div>
            )}
            <SortArrow
              direction={smplSort.key === 'dateCreated' && smplSort.direction ? smplSort.direction : null}/>
          </th>
          <th className="text-left pl-8">Status</th>
          <th className="text-left pl-8">Action</th>
        </tr>
        </thead>
        <tbody>
        {filteredSites.map((site, index) => (
          <tr className="h-16 border-gray-300 border-b" key={index}>
            <td className="text-left pl-8">{site.siteInfo.siteName}</td>
            <td className="text-left pl-8">{site.siteInfo.dateCreated}</td>
            <td className="text-left pl-6">
                            <span
                              className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                              {site.siteInfo.siteStatus}
                            </span>
            </td>
            <td className="text-left pl-12 relative">
              <SiteAction site={site}/>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplaySiteList;
