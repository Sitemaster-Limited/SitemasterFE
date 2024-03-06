import React, { useState } from 'react';

import Clock from '../../Images/Clock.png'

interface LocationState {
    latitude: number;
    longitude: number;
    accuracy: number;
}
const ClockTime = () => {

    const [location, setLocation] = useState<LocationState | null>(null);

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

    return (
        <>
            <div className="bg-custom-bg flex flex-col h-screen mt-20">
                <div className="mt-2 px-4">
                    <div className="bg-white w-full rounded-lg shadow-md flex items-center justify-center p-4 mb-4">
                        <button onClick={handleClockIn} className="flex flex-row bg-grey-200 items-center justify-center">
                            <div className="flex items-center justify-center rounded-full mr-3">
                                <img src={Clock} alt="TIME" className="rounded-[5px] w-full"/>
                            </div>
                            Clock-In
                        </button>
                    </div>

                    <div className="bg-white w-full rounded-lg shadow-md flex items-center justify-center p-4">
                        <button className="flex flex-row bg-grey-200 items-center justify-center">
                            <div className="flex items-center justify-center rounded-full mr-3">
                                <img src={Clock} alt="TIME" className="rounded-[5px] w-full"/>
                            </div>
                            Clock-Out
                        </button>
                    </div>

                    {location && (
                        <p>Location: Latitude: {location.latitude}, Longitude: {location.longitude} Accuracy: {location.accuracy}</p>
                    )}

                </div>
            </div>
        </>
    );
};

export default ClockTime;
