import React, { useEffect, useState } from "react";
import { Employee } from "../../../Utility/GlobalTypes";
import { useFormContext } from "../../../Context/LocalObjectForm";
import InputMask from "react-input-mask";
import AddSite from "../../../Images/AddSite.png";
import PutEmployee from "../../../Services/PutEmployee";
import DisplayEmployeeList from "../../../Components/DisplayEmployeeList";
import { normalizePhoneNumber } from "../../../Utility/Utility";
import { z } from 'zod';

const Employees = () => {
  const { formData, updateFormData } = useFormContext();
  const { v4: uuidv4 } = require('uuid');
  const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({ phoneNumber: '' });

  const [employees, setEmployees] = useState<Employee[]>(formData.employees || []);

  useEffect(() => {
    if (formData.employees) {
      setEmployees(formData.employees);
    }
  }, [formData.employees]);

  const phoneNumberSchema = z
    .string()
    .min(14, 'Phone number must be complete.')
    .regex(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Phone number must be in the format (###)-###-####');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddEmployee = (event: React.FormEvent) => {
    event.preventDefault();

    // Validate phone number
    const phoneValidation = phoneNumberSchema.safeParse(newEmployee.phoneNumber);

    if (!phoneValidation.success) {
      setFormErrors({ ...formErrors, phoneNumber: phoneValidation.error.errors[0].message });
      return;
    }

    // Normalize phone number
    let normalizedPhoneNumber = '';
    try {
      normalizedPhoneNumber = normalizePhoneNumber(newEmployee.phoneNumber);
    } catch (error: any) {
      setFormErrors({ ...formErrors, phoneNumber: error.message });
      return;
    }

    const newId = uuidv4();
    const employeeToAdd = {
      ...newEmployee,
      phoneNumber: normalizedPhoneNumber,
      employeeId: newId,
    };

    PutEmployee(formData.email || "", employeeToAdd, "add").then(() =>
      console.log("Employee Added")
    );

    const updatedEmployees = [...(formData.employees || []), employeeToAdd];
    updateFormData({ ...formData, employees: updatedEmployees });

    setShowModal(false);
    setNewEmployee({ firstName: '', lastName: '', phoneNumber: '' });
    setFormErrors({ phoneNumber: '' });
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewEmployee({ ...newEmployee, [name]: value });

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  return (
    <div className="flex flex-col bg-custom-bg h-screen p-2 relative">
      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">My Employees</h1>
      </div>

      <div className="h-[42px] mb-2 flex">
        <div
          className="flex-1 bg-white max-w-36 justify-center items-center text-custom-grey rounded-[5px] drop-shadow">
          <button className="p-2" onClick={() => setShowModal(true)}>
            <img src={AddSite} alt="Add" className="inline mr-2" />
            Add Employee
          </button>
        </div>
        <div className="flex-1 ml-2 max-w-96">
          <input
            type="text"
            placeholder="Search Employees..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 h-full rounded-[5px] drop-shadow"
          />
        </div>
      </div>

      {/* Modal for adding a new employee */}
      {showModal && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 bg-gray-600 m-2 rounded bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg relative">
            <div
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-0 cursor-pointer p-2 m-2 bg-red-500 text-white rounded-md flex justify-center items-center"
              style={{ width: '30px', height: '30px' }}>
              X
            </div>
            <h1 className="text-left mb-2 text-xl">Employee:</h1>
            <form className="flex flex-col justify-center items-center" onSubmit={handleAddEmployee}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newEmployee.firstName}
                onChange={handleFormChange}
                className="mb-4 p-2 shadow-md rounded w-full"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={handleFormChange}
                className="mb-4 p-2 shadow-md rounded w-full"
                required
              />
              <div className="mb-4 w-full">
                <InputMask
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  mask="(999)-999-9999"
                  value={newEmployee.phoneNumber}
                  onChange={handleFormChange}
                  className={`p-2 shadow-md rounded w-full ${formErrors.phoneNumber ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                )}
              </div>
              <button className="border border-gray-200 rounded-md w-32 p-1" type="submit">Add Employee</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white h-full rounded-[5px] overflow-auto">
        <DisplayEmployeeList employees={employees} searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default Employees;
