import React, {useState, useEffect, useRef} from "react";
import {Attendance} from '../Utility/GlobalTypes';
import {useFormContext} from "../Context/LocalObjectForm";

import PutEmployee from "../Services/PutEmployee";
import InputMask from "react-input-mask";


type ActionItemProps = {
  attendance: Attendance;
};

const ActionItem: React.FC<ActionItemProps> = ({attendance}) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [updatedEmployee, updateEmployee] = useState(attendance);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setShowDropdown(true)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
          ...
        </button>
        {showDropdown && (
          <div className="absolute z-10 -ml-8 text-left bg-white shadow-lg rounded-lg mt-2">
            <ul className="block">
              <li>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block w-full text-left"
                        onClick={() => {
                          setShowModal(true);
                          setShowDropdown(false);
                        }}>View Location
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 ml-64 bg-gray-600 m-2 rounded bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg relative">
            <div
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-0 cursor-pointer p-2 m-2 bg-red-500 text-white rounded-md flex justify-center items-center"
              style={{width: '30px', height: '30px'}}>
              X
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionItem;
