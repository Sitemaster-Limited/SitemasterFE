import React, { useState, useEffect } from 'react';
import Clock from '../../Images/Clock.png';
import axios from 'axios';
import { useSiteDetails } from '../../Context/SiteDetails';
import { Employee } from '../../Utility/GlobalTypes';
import PutAttendance from "../../Services/PutAttendance";

interface LocationData {
  latitude: string;
  longitude: string;
  accuracy: string;
}

const ClockTime = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [totalTime, setTotalTime] = useState<string | null>(null);
  const { siteDetails } = useSiteDetails();
  const siteId = localStorage.getItem('siteId');
  const clientId = localStorage.getItem('clientId');

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedClockInStatus = localStorage.getItem('clockedIn') === 'true';
    const storedStartTime = localStorage.getItem('startTime');

    if (storedClockInStatus && storedStartTime) {
      setClockedIn(true);
      setStartTime(new Date(storedStartTime));
    }
  }, []);

  // Set up interval when clockedIn changes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (clockedIn) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [clockedIn]);

  // Update localStorage when clockedIn or startTime changes
  useEffect(() => {
    localStorage.setItem('clockedIn', clockedIn.toString());
    if (startTime) {
      localStorage.setItem('startTime', startTime.toString());
    } else {
      localStorage.removeItem('startTime');
    }
  }, [clockedIn, startTime]);

  if (!siteId || !clientId) {
    return <p>Site information not found!</p>;
  }

  const handleClockIn = async () => {
    const now = new Date();
    setStartTime(now);
    setClockedIn(true);
    setTotalTime(null); // Reset totalTime when clocking in

    let phoneNumber = localStorage.getItem('verifiedPhoneNumber');

    if (!phoneNumber) {
      alert('Phone number not found. Please verify your phone number before clocking in.');
      return;
    }

    phoneNumber = phoneNumber.replace(/\D/g, '');

    if (!/^1+$/.test(phoneNumber)) {
      const locationData = await getUserLocation();

      const message = `SITEMASTER LTD.\nYou have successfully clocked in on ${now}. Thank you for using Sitemaster.`;

      try {
        await submitAttendance(phoneNumber, now, locationData || { latitude: '', longitude: '', accuracy: '' }, 'clockIn');
        await sendSMS(phoneNumber, message);
      } catch (error) {
        console.error('Error during clock-in:', error);
      }
    } else {
      console.log('General Access - No SMS sent.');
    }
  };

  const handleClockOut = async () => {
    if (startTime) {
      const now = new Date();
      const elapsed = now.getTime() - new Date(startTime).getTime();

      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
      const seconds = Math.floor((elapsed / 1000) % 60);

      setTotalTime(`${hours}h ${minutes}m ${seconds}s`);
      setStartTime(null);
      setClockedIn(false);

      let phoneNumber = localStorage.getItem('verifiedPhoneNumber');
      if (phoneNumber) {
        phoneNumber = phoneNumber.replace(/\D/g, '');

        if (!/^1+$/.test(phoneNumber)) {
          const locationData = await getUserLocation();

          const message = `SITEMASTER LTD.\nYou have successfully clocked out on ${now}. Thank you for using Sitemaster.`;

          try {
            await submitAttendance(phoneNumber, now, locationData || { latitude: '', longitude: '', accuracy: '' }, 'clockOut');
            await sendSMS(phoneNumber, message);
          } catch (error) {
            console.error('Error during clock-out:', error);
          }
        } else {
          console.log('General Access - No SMS sent.');
        }
      }
    }
  };

  const getUserLocation = () => {
    return new Promise<LocationData | null>((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
            accuracy: String(position.coords.accuracy),
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  const submitAttendance = async (
    phoneNumber: string,
    now: Date,
    locationData: LocationData,
    type: 'clockIn' | 'clockOut'
  ) => {
    let verifiedEmployee: Employee | undefined;

    if (siteDetails && siteDetails.siteAccess) {
      verifiedEmployee = siteDetails.siteAccess.find((employee: Employee) => {
        const cleanEmployeePhoneNumber = employee.phoneNumber.replace(/\D/g, '');
        return cleanEmployeePhoneNumber === phoneNumber;
      });
    }

    if (!verifiedEmployee) {
      throw new Error('Employee not found');
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',  // Use "long" for full weekday name (e.g., "Sunday")
      year: 'numeric',  // Numeric year (e.g., "2024")
      month: 'long',    // Full month name (e.g., "October")
      day: 'numeric',   // Day of the month as a number (e.g., "13")
      hour: 'numeric',  // Numeric hour (e.g., "2 PM")
      minute: 'numeric',// Numeric minute (e.g., "30")
      timeZone: 'America/Toronto',  // Set to Eastern Time Zone
      timeZoneName: 'short',        // Short timezone name (e.g., "EST" or "EDT")
    };


// Get the full formatted date including day, month, time, and timezone
    const fullDatePart = now.toLocaleString('en-CA', options);

// Create the ordinal suffix for the day (e.g., "13th", "1st", "2nd", etc.)
    const day = now.getDate();
    const ordinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th'; // covers 11th-19th
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const formattedDate = `${fullDatePart.replace(
      /\d+/,
      `${day}${ordinalSuffix(day)}`
    )}`;

    const attendance = {
      firstName: verifiedEmployee.firstName,
      lastName: verifiedEmployee.lastName,
      phoneNumber: phoneNumber,
      type: type,
      time: formattedDate,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy,
    };

    try {
      await PutAttendance(clientId, siteId, attendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  };

  const sendSMS = async (phoneNumber: string, message: string) => {
    try {
      await axios.post(`${process.env.REACT_APP_BE_URL}/Sms/send`, {
        phoneNumber,
        message,
      });
      console.log('SMS sent successfully');
    } catch (error: any) {
      console.error('Error sending SMS:', error.response?.data || error.message);
      throw error;
    }
  };

  const renderTimer = () => {
    if (!startTime) return '00:00:00';

    const start = new Date(startTime);
    const difference = Math.max(0, currentTime.getTime() - start.getTime());

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-custom-bg flex flex-col h-full">
      <div className="mt-2 px-4">
        {!clockedIn && (
          <button
            onClick={handleClockIn}
            className="bg-white w-full rounded-lg shadow-md flex items-center justify-center p-4 mb-4"
          >
            <div className="flex flex-row bg-grey-200 items-center justify-center">
              <div className="flex items-center justify-center rounded-full mr-3">
                <img src={Clock} alt="TIME" className="rounded-[5px] w-full" />
              </div>
              Clock-In
            </div>
          </button>
        )}

        {clockedIn && (
          <button
            onClick={handleClockOut}
            className="bg-white w-full rounded-lg shadow-md flex items-center justify-center p-4"
          >
            <div className="flex flex-row bg-grey-200 items-center justify-center">
              <div className="flex items-center justify-center rounded-full mr-3">
                <img src={Clock} alt="TIME" className="rounded-[5px] w-full" />
              </div>
              Clock-Out
            </div>
          </button>
        )}

        {clockedIn && (
          <div className="text-center mt-4">
            <span>Time Elapsed: {renderTimer()}</span>
          </div>
        )}

        {!clockedIn && totalTime && (
          <div className="text-center mt-4">
            <span>Total Time: {totalTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClockTime;
