import {useNavigate} from "react-router-dom";
import {EmployeeList} from "../../Utility/GlobalTypes";
import React, {useState} from "react";
import AddSite from "../../Images/AddSite.png";
import Archive from "../../Images/Archive.png";
import DisplayEmployeeList from "../../Components/DisplayEmployeeList";

const Employees = () => {

    const navigate = useNavigate();

    const employees: EmployeeList[] = [
        { id: '001', firstName: 'Ethan ', lastName: 'Fifle', phoneNumber: '123-423-4534' },
        { id:'002', firstName: 'Ilija', lastName: 'rasta', phoneNumber: '123-443-5434' },
        { id:'003', firstName: 'Andrew', lastName: 'brown', phoneNumber: '443-244-3434' },
        { id:'004', firstName: 'Jakub', lastName: 'smith', phoneNumber: '436-764-9753' },

        // ... other properties
    ];

    // State to hold the search term
    const [searchTerm, setSearchTerm] = useState("");
    const [activeButton, setActiveButton] = useState('all');

    // Function to handle the change in the search input
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="lex flex-col bg-custom-bg h-screen mt-16 md:mt-0 md:ml-64 p-2">

            <div className="h-[6%] rounded-[5px] mb-3">
                <h1 className="text-left text-[34px]">
                    My Employees
                </h1>
            </div>

            <div className="h-[42px] mb-2 flex">
                <div className="flex-1 bg-white max-w-36 justify-center items-center text-custom-grey rounded-[5px] drop-shadow" >
                    <button className="p-2" onClick={() => navigate('/admin/sites/create')}>
                        <img src={AddSite} alt="Add" className="inline mr-2"/>
                        Add Employee
                    </button>
                </div>
                <div className="flex-1 ml-2 max-w-96" >
                    <input
                        type="text"
                        placeholder="Search Employees..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-2 h-full rounded-[5px] drop-shadow"
                    />
                </div>

            </div>

            <div className="bg-white h-[87%] rounded-[5px] overflow-auto">
                <DisplayEmployeeList employees={employees} searchTerm={searchTerm}/>
            </div>

        </div>

    );
};

export default Employees;
