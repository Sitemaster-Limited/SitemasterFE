import React, {useEffect, useState,} from "react";
import {Employee, Site} from "../../Utility/GlobalTypes";
import {useFormContext} from "../../Context/LocalObjectForm";
import {useSiteData} from "../../Hooks/SiteData";
import {useLocation} from 'react-router-dom';
import {useAuth} from "@clerk/clerk-react";

import PutSite from "../../Services/PutSite";
import PostImages from "../../Services/PostImages";

import EmployeeSelection from "../../Components/EmployeeSelection";

import Autocomplete from 'react-google-autocomplete';

const SiteAttendance = () => {

  const auth = useAuth();
  const location = useLocation();
  const [localSite, setLocalSite] = useState(location.state?.site);

  const {formData, updateFormData} = useFormContext();
  const [token, setToken] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const apiData = useSiteData(formData);

  useEffect(() => {
    const fetchToken = async () => {
      const jwt = await auth.getToken({template: 'SitemasterBE'});
      if (jwt !== null) {
        setToken(jwt);
      } else {
        setToken(''); // No valid token
      }
    };

    fetchToken().then(() => console.log(`new token fetched`));
  }, []);

  const [employees, setEmployees] = useState<Employee[]>(formData.employees || []);
  useEffect(() => {
    if (formData.employees) {
      setEmployees(formData.employees);
    }
  }, [formData.employees]);


  return (
    <div className="flex flex-col bg-custom-bg h-screen mt-20 md:mt-0 md:ml-64 p-4">
      Hello
    </div>
  );
};

export default SiteAttendance;
