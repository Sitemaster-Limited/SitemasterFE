import React, {useState, useEffect, useRef} from "react";
import {Employee} from '../Utility/GlobalTypes';
import {useFormContext} from "../Context/LocalObjectForm";

import PutEmployee from "../Services/PutEmployee";
import InputMask from "react-input-mask";


type ActionItemProps = {
  employee: Employee;
};

const ActionItem: React.FC<ActionItemProps> = ({employee}) => {

  const {formData, updateFormData} = useFormContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [updatedEmployee, updateEmployee] = useState(employee);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateEmployee({...updatedEmployee, [event.target.name]: event.target.value});
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Type assertion for event.target as Node
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmployeeUpdate = () => {
    // Ensure updatedEmployee is defined and has a property employeeId
    if (!updatedEmployee || !updatedEmployee.employeeId) {
      console.error("Updated employee or employeeId is undefined.");
      return;
    }

    // Added check for formData.employees existence and debug log for type comparison
    if (formData.employees) {
      const employeeIndex = formData.employees.findIndex(employee => {
        return employee.employeeId === updatedEmployee.employeeId;
      });

      if (employeeIndex !== -1) {
        const updatedEmployees = [...formData.employees];
        updatedEmployees[employeeIndex] = updatedEmployee;

        updateFormData({...formData, employees: updatedEmployees});
        // Uncomment the next line once the issue is resolved
        // PutEmployee(formData.email || "", updatedEmployees, "update", updatedEmployee.employeeId).then(() => console.log("Employee Updated"));

      } else {
        alert("Error updating employee");
      }
    } else {
      console.error("Employees is undefined or empty.");
    }
  };

  const handleEmployeeDelete = () => {

    if (!updatedEmployee || !updatedEmployee.employeeId) {
      console.error("Updated employee or employeeId is undefined.");
      return;
    }

    if (formData.employees) {

      const updatedEmployees = formData.employees.filter(employee => employee.employeeId !== updatedEmployee.employeeId);

      // Check if the length of the arrays is different to confirm deletion
      if (updatedEmployees.length !== formData.employees.length) {
        updateFormData({...formData, employees: updatedEmployees});
        // Uncomment the next line to integrate with your backend or external system
        // PutEmployee(formData.email || "", updatedEmployees, "delete", employeeIdToDelete).then(() => console.log("Employee Deleted"));

        console.log(`Employee with deleted.`);
      } else {
        // This means no matching employee was found to delete
        console.log("Employee not found.");
      }
    } else {
      console.error("Employees list is undefined or empty.");
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="text-gray-500 hover:text-gray-700 focus:outline-none">
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
                        }}>Edit
                </button>
              </li>
              <li>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block w-full text-left"
                        onClick={handleEmployeeDelete}>Delete
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
            <h1 className="text-left mb-2 text-xl">Employee:</h1>
            <div className="flex flex-col justify-center items-center">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={updatedEmployee.firstName}
                onChange={handleFormChange}
                className="mb-4 p-2 shadow-md rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={updatedEmployee.lastName}
                onChange={handleFormChange}
                className="mb-4 p-2 shadow-md rounded"
                required
              />
              <InputMask
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                mask="(999)-999-9999"
                value={updatedEmployee.phoneNumber}
                onChange={handleFormChange}
                className="mb-4 p-2 shadow-md rounded"
                required
              />
              <button className="border border-gray-200 rounded-md w-40 p-1" onClick={handleEmployeeUpdate}>Update Employee</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionItem;
