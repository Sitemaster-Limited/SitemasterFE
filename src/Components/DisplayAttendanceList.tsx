import React, { useState, useEffect } from 'react';
import { Attendance, SimpleSort, AttendanceListProps } from '../Utility/GlobalTypes';
import { sortAttendance } from "../Utility/AttendanceListHandler";
import Map, { Marker } from "react-map-gl";
import Modal from 'react-modal'; // Import Modal
import 'mapbox-gl/dist/mapbox-gl.css';

import UpArrow from '../Images/UpArrow.png';
import DownArrow from '../Images/DownArrow.png';

Modal.setAppElement('#root'); // Set the app root for accessibility

const DisplayAttendanceList: React.FC<AttendanceListProps> = ({ attendances, searchTerm }) => {
  const [sortedList, setSortedList] = useState<Attendance[]>(attendances);
  const [smplSort, setDirection] = useState<SimpleSort>({ key: null, direction: null });
  const [selectedLocation, setSelectedLocation] = useState({ longitude: 0, latitude: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationClick = (longitude: number, latitude: number) => {
    setSelectedLocation({ longitude, latitude });
    setIsModalOpen(true); // Open the modal when the location is clicked
  };

  useEffect(() => {
    setSortedList(attendances); // Update sortedList when attendances prop changes
  }, [attendances]);

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Search employee by their name
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
          <th className="text-left pl-8 cursor-pointer"
              onClick={() => sortAttendance('firstName', smplSort, attendances, setSortedList, setDirection)}>
            First Name
            {!smplSort.direction && (
              <div className="relative ml-24 mt-[-16px] h-[12px]">
                <img src={UpArrow} alt="Sort" className="absolute top-0 left-0 z-10" />
                <img src={DownArrow} alt="Sort" className="absolute bottom-0 left-0" />
              </div>
            )}
            <SortArrow direction={smplSort.key === 'firstName' && smplSort.direction ? smplSort.direction : null} />
          </th>
          <th className="text-left pl-8 cursor-pointer"
              onClick={() => sortAttendance('lastName', smplSort, attendances, setSortedList, setDirection)}>
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
          <th className="text-left pl-8">Date & Time</th>
          <th className="text-left pl-8">Location</th>
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
            <td className="text-left pl-8">
              <button
                onClick={() =>
                  handleLocationClick(Number(employee.longitude), Number(employee.latitude))
                }
                className="bg-blue-500 text-white py-1 px-3 rounded"
              >
                Show Location
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Modal to display the map */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Employee Location"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Employee Location</h2>
        <Map
          initialViewState={{
            longitude: selectedLocation.longitude,
            latitude: selectedLocation.latitude,
            zoom: 12,
          }}
          style={{ width: "100%", height: "400px" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
        >
          <Marker
            longitude={selectedLocation.longitude}
            latitude={selectedLocation.latitude}
            color="red"
          />
        </Map>
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default DisplayAttendanceList;
