import React, {useState, useEffect} from 'react';

import Clock from '../../Images/Clock.png'
import axios from "axios";
import PutAttendance from "../../Services/PutAttendance";
import {useSiteDetails} from "../../Context/SiteDetails";
import {Employee, globalClientId} from "../../Utility/GlobalTypes";

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
  const [clientId, setClientId] = useState<string>("");
  const { siteDetails } = useSiteDetails()

  useEffect(() => {
    if (globalClientId) {
      setClientId(globalClientId);
    }
  }, []);

  const handleClockIn = async () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const now = new Date();
    setStartTime(now);
    setClockedIn(true);

    let phoneNumber = localStorage.getItem('verifiedPhoneNumber');

    // Check if phoneNumber exists
    if (!phoneNumber) {
      alert('Phone number not found. Please verify your phone number before clocking in.');
      return;
    }

    // Clean up the phone number by removing any non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, '');

    // Handle clock in process
    if (!(/^1+$/.test(phoneNumber))) {
      // Try to get the user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Send attendance and SMS with position data
            await handleAttendanceAndSMS(phoneNumber!, now, {
              latitude: String(position.coords.latitude),
              longitude: String(position.coords.longitude),
              accuracy: String(position.coords.accuracy),
            });
          },
          async (error) => {
            console.error('Geolocation error:', error);
            // Send attendance and SMS with no geolocation data
            await handleAttendanceAndSMS(phoneNumber!, now, {
              latitude: '',
              longitude: '',
              accuracy: '',
            });
          },
          options
        );
      } else {
        // Geolocation not supported
        await handleAttendanceAndSMS(phoneNumber, now, {
          latitude: '',
          longitude: '',
          accuracy: '',
        });
      }
    } else {
      console.log('General Access - No SMS sent.');
    }
  };

// Function to handle both attendance and SMS
  const handleAttendanceAndSMS = async (phoneNumber: string, now: Date, positionData: LocationData) => {

    let verifiedEmployee: Employee | undefined;

    if (siteDetails && siteDetails.siteAccess) {
      verifiedEmployee = siteDetails.siteAccess.find((employee: Employee) => {
        const cleanEmployeePhoneNumber = employee.phoneNumber.replace(/\D/g, '');
        return cleanEmployeePhoneNumber === phoneNumber;
      });
    }

    // Ensure verifiedEmployee is found, otherwise throw an error
    if (!verifiedEmployee) {
      throw new Error('Employee not found');
    }

    const attendance = {
      firstName: verifiedEmployee.firstName,
      lastName: verifiedEmployee.lastName,
      phoneNumber: phoneNumber,
      type: 'clockIn',
      time: String(now),
      latitude: positionData.latitude,
      longitude: positionData.longitude,
      accuracy: positionData.accuracy,
    };

    // Send the attendance data to the server
    try {
      await PutAttendance(clientId, siteDetails?.siteInfo.siteId!, attendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
      return;
    }

    // Send SMS using Twilio API
    try {
      await sendSMS(phoneNumber, now);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

// Function to send SMS
  const sendSMS = async (phoneNumber: string, now: Date) => {
    const data = new URLSearchParams();
    data.append('To', `+1${phoneNumber}`); // Add the phone number
    data.append('From', process.env.REACT_APP_TWILIO_PHONE_NUMBER!); // Your Twilio phone number
    data.append('Body', `SITEMASTER LTD. \nYou have successfully clocked in on ${now}. Thank you for using Sitemaster.`); // Message body

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.REACT_APP_TWILIO_ACCOUNT_SID!}/Messages.json`,
        data,
        {
          auth: {
            username: process.env.REACT_APP_TWILIO_ACCOUNT_SID!, // Twilio Account SID
            password: process.env.REACT_APP_TWILIO_AUTH_TOKEN! // Twilio Auth Token
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('SMS sent successfully');
    } catch (error: any) {
      console.error('Error sending SMS:', error.response?.data || error.message);
    }
  };


  useEffect(() => {
    // Check and set clock-in status from localStorage on component mount
    const storedClockInStatus = localStorage.getItem('clockedIn') === 'true';
    const storedStartTime = localStorage.getItem('startTime');

    if (storedClockInStatus && storedStartTime) {
      setClockedIn(true);
      setStartTime(new Date(storedStartTime));
    }

    // Set up timer to update current time
    const interval = setInterval(() => {
      if (clockedIn) {
        setCurrentTime(new Date());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [clockedIn]);

  useEffect(() => {
    // Save clock-in status and start time to localStorage whenever they change
    localStorage.setItem('clockedIn', clockedIn.toString());
    if (startTime) {
      localStorage.setItem('startTime', startTime.toString());
    }
  }, [clockedIn, startTime]);

  const handleClockOut = async () => {
    setClockedIn(false);

    if (startTime) {
      const now = new Date();
      const elapsed = now.getTime() - new Date(startTime).getTime();

      // Convert milliseconds to a readable format
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
      const seconds = Math.floor((elapsed / 1000) % 60);

      setTotalTime(`${hours}h ${minutes}m ${seconds}s`);
      setStartTime(null);

      let phoneNumber = localStorage.getItem('verifiedPhoneNumber');
      if (phoneNumber) {
        phoneNumber = phoneNumber.replace(/\D/g, '');

        if (!(/^1+$/.test(phoneNumber))) {
          // Get the user's geolocation on clock-out
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const locationData = {
                  latitude: String(position.coords.latitude),
                  longitude: String(position.coords.longitude),
                  accuracy: String(position.coords.accuracy),
                };

                // Send the clock-out SMS
                await sendClockOutSMS(phoneNumber!, now);

                // Call PutAttendance with "clockOut" and geolocation data
                await submitAttendance(phoneNumber!, now, locationData);

              },
              async (error) => {
                console.error('Geolocation error:', error);
                // If geolocation fails, proceed without location data
                const locationData = {
                  latitude: '',
                  longitude: '',
                  accuracy: '',
                };

                // Send the clock-out SMS
                await sendClockOutSMS(phoneNumber!, now);

                // Call PutAttendance without geolocation data
                await submitAttendance(phoneNumber!, now, locationData);
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              }
            );
          } else {
            // If geolocation is not supported, proceed without location data
            const locationData = {
              latitude: '',
              longitude: '',
              accuracy: '',
            };

            // Send the clock-out SMS
            await sendClockOutSMS(phoneNumber, now);

            // Call PutAttendance without geolocation data
            await submitAttendance(phoneNumber, now, locationData);
          }
        } else {
          console.log('General Access - No SMS sent.');
        }
      }

      localStorage.removeItem('clockedIn');
      localStorage.removeItem('startTime');
    }
  };

// Helper function to send clock-out SMS
  const sendClockOutSMS = async (phoneNumber: string, now: Date) => {
    const data = new URLSearchParams();
    data.append('To', `+1${phoneNumber}`);
    data.append('From', process.env.REACT_APP_TWILIO_PHONE_NUMBER!);
    data.append('Body', `SITEMASTER LTD. \nYou have successfully clocked out on ${now}. Thank you for using Sitemaster.`);

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.REACT_APP_TWILIO_ACCOUNT_SID!}/Messages.json`,
        data,
        {
          auth: {
            username: process.env.REACT_APP_TWILIO_ACCOUNT_SID!,
            password: process.env.REACT_APP_TWILIO_AUTH_TOKEN!
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('SMS sent successfully');
    } catch (error: any) {
      console.error('Error sending SMS:', error.response?.data || error.message);
    }
  };

// Helper function to submit attendance
  const submitAttendance = async (phoneNumber: string, now: Date, locationData: LocationData) => {

    let verifiedEmployee: Employee | undefined;

    if (siteDetails && siteDetails.siteAccess) {
      verifiedEmployee = siteDetails.siteAccess.find((employee: Employee) => {
        const cleanEmployeePhoneNumber = employee.phoneNumber.replace(/\D/g, '');
        return cleanEmployeePhoneNumber === phoneNumber;
      });
    }

    // Ensure verifiedEmployee is found, otherwise throw an error
    if (!verifiedEmployee) {
      throw new Error('Employee not found');
    }
    const attendance = {
      firstName: verifiedEmployee.firstName,
      lastName: verifiedEmployee.lastName,
      phoneNumber: phoneNumber,
      type: 'clockOut', // Set the type as "clockOut"
      time: String(now),
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy,
    };

    try {
      await PutAttendance(clientId, siteDetails?.siteInfo.siteId!, attendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };


  const renderTimer = () => {
    if (!startTime) return '00:00:00';
    // Ensure the current time is always after or equal to the start time to avoid negative elapsed time
    const start = new Date(startTime);
    const difference = Math.max(0, currentTime.getTime() - start.getTime()); // Prevent negative differences

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="bg-custom-bg flex flex-col h-full">
        <div className="mt-2 px-4">
          {!clockedIn && (
            <button onClick={handleClockIn}
                    className="bg-white w-full rounded-lg shadow-md flex items-center justify-center p-4 mb-4">
              <div className="flex flex-row bg-grey-200 items-center justify-center">
                <div className="flex items-center justify-center rounded-full mr-3">
                  <img src={Clock} alt="TIME" className="rounded-[5px] w-full"/>
                </div>
                Clock-In
              </div>
            </button>
          )}

          {clockedIn && (
            <button onClick={handleClockOut}
                    className="bg-white w-full rounded-lg shadow-md flex items-center justify-center p-4">
              <div className="flex flex-row bg-grey-200 items-center justify-center">
                <div className="flex items-center justify-center rounded-full mr-3">
                  <img src={Clock} alt="TIME" className="rounded-[5px] w-full"/>
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
    </>
  )
    ;
};

export default ClockTime;
