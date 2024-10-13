import React, {useEffect, useState} from 'react';

import {useNavigate} from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import {Employee} from "../../Utility/GlobalTypes";
import {useSiteDetails} from "../../Context/SiteDetails";
import Spinner from "../../Components/ui/spinner";

import InputMask from "react-input-mask";
import Time from '../../Images/Time.png';
import Blueprint from '../../Images/Blueprints.png';
import { z } from 'zod'
import { normalizePhoneNumber } from "../../Utility/Utility";

const SitePage = () => {

  const initialPhoneNumber = localStorage.getItem('verifiedPhoneNumber') || '';
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [isVerified, setIsVerified] = useState(!!initialPhoneNumber);
  const {siteDetails, loading} = useSiteDetails();

  const navigate = useNavigate();

  const phoneNumberSchema = z
    .string()
    .min(14, 'Phone number must be complete.')
    .regex(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Phone number must be in the format (###)-###-####');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
  }, []);

  const verifyPhoneNumber = () => {
    // Validate the phone number using Zod
    const phoneValidation = phoneNumberSchema.safeParse(phoneNumber);

    if (!phoneValidation.success) {
      alert(phoneValidation.error.errors[0].message);
      return;
    }

    let normalizedPhoneNumber = '';
    try {
      normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    if (
      siteDetails &&
      siteDetails.siteAccess.some((employee: Employee) => {
        const cleanEmployeePhoneNumber = normalizePhoneNumber(employee.phoneNumber);
        return cleanEmployeePhoneNumber === normalizedPhoneNumber;
      })
    ) {
      setIsVerified(true);
      localStorage.setItem('verifiedPhoneNumber', phoneNumber);
    } else {
      alert('Phone number not found. Please try again.');
    }
  };

  // Render loading state or prompt for phone number verification
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-start mt-20">
        <Spinner />
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <InputMask
          type="tel"
          value={phoneNumber}
          mask="(999)-999-9999"
          placeholder="(###)-###-####"
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mb-4 p-2 border"
        />
        <button
          onClick={verifyPhoneNumber}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Verify
        </button>
      </div>
    );
  }
  // Render loading state, error message, or site name based on the state
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 mt-2 gap-4 px-4">
        <button onClick={() => navigate(`time`)}
                className="bg-white w-full aspect-square rounded-lg shadow-md flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center rounded-full mb-2">
              <img src={Time} alt="TIME" className="pt-1 rounded-[5px] w-full"/>
            </div>
          </div>
        </button>

        <button onClick={() => navigate(`blueprints`)}
                className="bg-white w-full aspect-square rounded-lg shadow-md flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center rounded-full mb-2">
              <img src={Blueprint} alt="BlUEPRINTS" className="pt-1 rounded-[5px] w-full"/>
            </div>
          </div>
        </button>

        <button onClick={() => navigate(`progress-reports`)}
                className="bg-white w-full col-span-2 rounded-lg shadow-md flex flex-row items-start p-4">
          <ClipboardList />
          <p className="ml-1 text-lg font-semibold font-sans">Progress Report</p>
        </button>
      </div>
    </div>
  );
};

export default SitePage;
