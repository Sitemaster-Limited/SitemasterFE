import React, { useState } from 'react';
import { EmployeeListProps } from "../Utility/GlobalTypes";

const EmployeeSelection: React.FC<EmployeeListProps> = ({ employees }) => {
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleCheckboxChange = (employeeId: string) => {
        if (selectedEmployees.includes(employeeId)) {
            setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
        } else {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        }
    };

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    return (
        <div className="relative">
                <div className="border bg-white border-gray-300 rounded">
                    <button
                        className="text-left shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={toggleDropdown} // Toggle dropdown list visibility
                    >
                        Select employees...
                    </button>
                    {showDropdown && ( // This will conditionally render the dropdown based on `showDropdown` state
                        <div className="max-h-48 overflow-auto">
                            {employees.map(employee => (
                                <label key={employee.employeeId} className="block px-2 py-1">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedEmployees.includes(employee.employeeId)}
                                        onChange={() => handleCheckboxChange(employee.employeeId)}
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
