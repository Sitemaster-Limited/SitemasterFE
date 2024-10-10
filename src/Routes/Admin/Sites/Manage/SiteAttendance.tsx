import React, {useEffect, useMemo, useState} from "react";
import { useLocation } from "react-router-dom";
import { createColumns } from "./Data/columns";
import { DataTable } from "./Data/data-table";
import { Attendance } from "../../../../Utility/GlobalTypes";
import Map, {Marker} from "react-map-gl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../Components/ui/dialog"
import 'mapbox-gl/dist/mapbox-gl.css';

const SiteAttendance = () => {

  const location = useLocation();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({ longitude: 0, latitude: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Ensure attendance is only set once location is ready and siteAttendance exists
    if (location.state?.site?.siteAttendance) {
      setAttendance(location.state.site.siteAttendance);
    }
  }, [location.state]);

  const columns = useMemo(() => createColumns(setSelectedLocation, setIsModalOpen), [location.state, selectedLocation]);

  return (
    <div className="flex flex-col p-2 relative">
      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">Site Attendance</h1>
      </div>
      <DataTable columns={columns} data={attendance} />
      {/* Modal to display the map */}
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Employee Location</DialogTitle>
            <DialogDescription>
              The location of the employee when clocking in or clocking out.
            </DialogDescription>
          </DialogHeader>
          <Map
            initialViewState={{
              longitude: selectedLocation.longitude,
              latitude: selectedLocation.latitude,
              zoom: 12,
            }}
            style={{ width: "100%", height: "400px" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
          >
            <Marker
              longitude={selectedLocation.longitude}
              latitude={selectedLocation.latitude}
              color="red"
            />
          </Map>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteAttendance;
