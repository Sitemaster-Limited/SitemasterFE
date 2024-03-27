import React, {useState, useEffect} from 'react';

import Clock from '../../Images/Clock.png'
import axios from "axios";

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const ClockTime = () => {

  const [location, setLocation] = useState<LocationState | null>(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [totalTime, setTotalTime] = useState<string | null>(null);
  const handleClockIn = () => {
    const options = {
      enableHighAccuracy: true, // This requests the highest accuracy from the device's GPS sensor
      timeout: 5000, // The maximum time (in milliseconds) the device is allowed to take in order to return a position
      maximumAge: 0 // Defines the maximum age in milliseconds of a possible cached position that is acceptable to return
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy // You can also capture the accuracy level of the coordinates
          });

          const now = new Date();
          setStartTime(now);
          setClockedIn(true);

          let phoneNumber = localStorage.getItem('verifiedPhoneNumber');
          if (phoneNumber) {
            phoneNumber = phoneNumber.replace(/\D/g, '');

            axios.post('https://textbelt.com/text', {
              phone: phoneNumber,
              message: `You have successfully clocked in at ${now}. Thank you for using Sitemaster.`,
              key: process.env.REACT_APP_TEXTBELT_KEY,
            }).then((response: any) => {
              console.log(response.data);
            })

          }
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        },
        options
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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

  const handleClockOut = () => {
    setClockedIn(false);
    if (startTime) {
      const now = new Date();
      const elapsed = now.getTime() - new Date(startTime).getTime();

      // Convert milliseconds to a readable format
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
      const seconds = Math.floor((elapsed / 1000) % 60);

      setTotalTime(`${hours}h ${minutes}m ${seconds}s`);
      setClockedIn(false);
      setStartTime(null);
      localStorage.removeItem('clockedIn');
      localStorage.removeItem('startTime');
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
      <div className="bg-custom-bg flex flex-col h-screen mt-20">
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
