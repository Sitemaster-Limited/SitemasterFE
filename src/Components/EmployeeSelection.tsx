import React, { useState, useEffect } from 'react';
import { Employee, EmployeeListProps } from "../Utility/GlobalTypes";
import { useFormContext } from "../Context/LocalObjectForm";

const EmployeeSelection: React.FC<EmployeeListProps> = ({ employees }) => {

    const {updateFormData} = useFormContext();
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleCheckboxChange = (employee: Employee) => {
        const isSelected = selectedEmployees.some(emp => emp.employeeId === employee.employeeId);

        if (isSelected) {
            const newSelectedEmployees = selectedEmployees.filter(emp => emp.employeeId !== employee.employeeId);
            setSelectedEmployees(newSelectedEmployees);
        } else {
            const newSelectedEmployees = [...selectedEmployees, employee];
            setSelectedEmployees(newSelectedEmployees);
        }
    };

    useEffect(() => {
        updateFormData({siteAccess: selectedEmployees});
    }, [selectedEmployees]);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    return (
      <div className="relative">
          <div className="border bg-white border-gray-300 rounded">
              <button
                className="text-left shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                type="button"
                onClick={toggleDropdown}
              >
                  Select employees...
              </button>
              {showDropdown && (
                <div className="max-h-48 overflow-auto">
                    {employees.map(employee => (
                      <label key={employee.employeeId} className="block px-2 py-1">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedEmployees.some(emp => emp.employeeId === employee.employeeId)}
                            onChange={() => handleCheckboxChange(employee)}
                          />
                          {`${employee.firstName} ${employee.lastName}`}
                      </label>
                    ))}
                </div>
              )}
          </div>
      </div>
    );
};

export default EmployeeSelection;
