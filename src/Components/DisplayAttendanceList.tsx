import React, { useState, useEffect } from 'react';
import { Attendance, SimpleSort, AttendanceListProps } from '../Utility/GlobalTypes';
import { sortAttendance } from "../Utility/AttendanceListHandler";

import UpArrow from '../Images/UpArrow.png';
import DownArrow from '../Images/DownArrow.png';
import AttendanceAction from "./AttendanceAction";

const DisplayAttendanceList: React.FC<AttendanceListProps> = ({ attendances, searchTerm }) => {
  const [sortedList, setSortedList] = useState<Attendance[]>(attendances);
  const [smplSort, setDirection] = useState<SimpleSort>({ key: null, direction: null });

  useEffect(() => {
    setSortedList(attendances); // Update sortedList when sites prop changes
  }, [attendances]);

  // Search employee's by their name
  const filteredEmployees = (searchTerm || "").trim()
    ? sortedList.filter(attendance =>
      (attendance.firstName + " " + attendance.lastName).toLowerCase().includes((searchTerm || "").toLowerCase())
    )
    : sortedList;

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
    <div className="">
      <table className="min-w-full bg-white">
        <thead>
        <tr className="w-full h-16 border-gray-300 border-b py-8">
          <th className="text-left pl-8 cursor-pointer" onClick={() => sortAttendance('firstName', smplSort, attendances, setSortedList, setDirection)}>
            First Name
            {!smplSort.direction && (
              <div className="relative ml-24 mt-[-16px] h-[12px]">
                <img src={UpArrow} alt="Sort" className="absolute top-0 left-0 z-10" />
                <img src={DownArrow} alt="Sort" className="absolute bottom-0 left-0" />
              </div>
            )}
            <SortArrow direction={smplSort.key === 'firstName' && smplSort.direction ? smplSort.direction : null} />
          </th>
          <th className="text-left pl-8 cursor-pointer" onClick={() => sortAttendance('lastName', smplSort, attendances, setSortedList, setDirection)}>
            Last Name
            {!smplSort.direction && (
              <div className="relative ml-28 mt-[-16px] h-[12px]">
                <img src={UpArrow} alt="Sort" className="absolute top-0 left-0 z-10" />
                <img src={DownArrow} alt="Sort" className="absolute bottom-0 left-0" />
              </div>
            )}
            <SortArrow direction={smplSort.key === 'lastName' && smplSort.direction ? smplSort.direction : null} />
          </th>
          <th className="text-left pl-8">Phone</th>
          <th className="text-left pl-8">Action</th>
        </tr>
        </thead>
        <tbody>
        {filteredEmployees.map((employee, index) => (
          <tr className="h-16 border-gray-300 border-b" key={index}>
            <td className="text-left pl-8">{employee.firstName}</td>
            <td className="text-left pl-8">{employee.lastName}</td>
            <td className="text-left pl-8">{employee.phoneNumber}</td>
            <td className="text-left pl-8">{employee.type}</td>
            <td className="text-left pl-8">{employee.time}</td>
            <td className="text-left pl-12 relative">
              <AttendanceAction attendance={employee} />
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayAttendanceList;
