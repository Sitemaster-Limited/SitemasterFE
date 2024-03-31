import React, {useEffect, useState} from "react";
import {Employee} from "../../Utility/GlobalTypes";
import {useFormContext} from "../../Context/LocalObjectForm";

import InputMask from "react-input-mask";
import AddSite from "../../Images/AddSite.png";
import PutEmployee from "../../Services/PutEmployee";
import DisplayEmployeeList from "../../Components/DisplayEmployeeList";

const Employees = () => {

  const {formData, updateFormData} = useFormContext();
  const { v4: uuidv4 } = require('uuid');
  const [newEmployee, setNewEmployee] = useState({firstName: '', lastName: '', phoneNumber: ''});
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const [employees, setEmployees] = useState<Employee[]>(formData.employees || []);
  useEffect(() => {
    if (formData.employees) {
      setEmployees(formData.employees);
    }
  }, [formData.employees]); // Dependency array

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddEmployee = (event: React.FormEvent) => {
    event.preventDefault();
    // will need to change (good for handling 999 employees id should be generated)
    const newId = uuidv4();
    console.log(newId);
    const employeeToAdd = {...newEmployee, employeeId: newId};

    // Don't give an employee id to add it is already included in the object, the field is still needed for edits and deletion tho
    PutEmployee(formData.email || "", employeeToAdd, "add", null).then(() => console.log("Employee Added"));

    // Update the context's formData with the new employee list
    const updatedEmployees = [...(formData.employees || []), employeeToAdd];
    updateFormData({...formData, employees: updatedEmployees});

    setShowModal(false); // Close the modal
    setNewEmployee({firstName: '', lastName: '', phoneNumber: ''}); // Reset form
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({...newEmployee, [event.target.name]: event.target.value});
  };

  return (
    <div className="flex flex-col bg-custom-bg h-screen mt-20 md:mt-0 md:ml-64 p-2 relative">
      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">My Employees</h1>
      </div>

      <div className="h-[42px] mb-2 flex">
        <div
          className="flex-1 bg-white max-w-36 justify-center items-center text-custom-grey rounded-[5px] drop-shadow">
          <button className="p-2" onClick={() => setShowModal(true)}>
            <img src={AddSite} alt="Add" className="inline mr-2"/>
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
              style={{width: '30px', height: '30px'}}>
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
                className="mb-4 p-2 shadow-md rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={handleFormChange}
                className="mb-4 p-2 shadow-md rounded"
                required
              />
              <InputMask
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                mask="(999)-999-9999"
                value={newEmployee.phoneNumber}
                onChange={handleFormChange}
                className="mb-4 p-2 shadow-md rounded"
                required
              />
              <button className="border border-gray-200 rounded-md w-32 p-1" type="submit">Add Employee</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white h-full rounded-[5px] overflow-auto">
        <DisplayEmployeeList employees={employees} searchTerm={searchTerm}/>
      </div>
    </div>
  );
};

export default Employees;
