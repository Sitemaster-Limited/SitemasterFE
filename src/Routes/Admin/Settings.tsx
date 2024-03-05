import AddSite from "../../Images/AddSite.png";
import React from "react";
import PostAccount from "../../Services/PostAccount";
import { useAccountData } from "../../Hooks/AccountData";
import { useFormContext } from "../../Context/LocalObjectForm";

const Settings = () => {

    const { formData } = useFormContext();
    const apiData = useAccountData(formData);

    return (
        <>
            <div
                className="flex-1 bg-white max-w-36 justify-center items-center text-custom-grey rounded-[5px] drop-shadow">
                <button className="p-2" onClick={() => PostAccount(apiData)}>
                    <img src={AddSite} alt="Add" className="inline mr-2"/>
                    Add Employee
                </button>
            </div>
        </>

    );
};

export default Settings;
