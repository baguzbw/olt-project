import axios from "axios";
import Cookies from "js-cookie";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { isAdmin, isAuthenticated } from "./Auth";

export default function Keterangan() {
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [position, setPosition] = useState([-7.5634, 110.8559]);

  useEffect(() => {
    const apiKey = Cookies.get("token");
    axios
      .get(`${API_BASE_URL}device/all?apiKey=${apiKey}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setDevices(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      });
  }, []);

  const handleCreateDevice = () => {
    const devicePayload = {
      name: deviceName,
      location: location,
      latitude: latitude,
      longitude: longitude,
    };
    const apiKey = Cookies.get("token");

    axios
      .post(`${API_BASE_URL}device/create`, devicePayload, {
        params: {
          apiKey: apiKey,
        },
      })
      .then((response) => {
        console.log("Device created successfully:", response.data);
        setShowModal(false);
        setDeviceName("");
        setLocation("");
        setLatitude("");
        setLongitude("");
        setDevices([...devices, response.data]);
      })
      .catch((error) => {
        console.error("Error creating device:", error);
      });
  };

  function DraggableMarker({ position, setPosition }) {
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition(newPos);
            setLatitude(newPos.lat.toFixed(4));
            setLongitude(newPos.lng.toFixed(4));
          }
        },
      }),
      [setPosition]
    );

    return <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />;
  }

  const showCreateDeviceButton = isAuthenticated() && isAdmin();

  DraggableMarker.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    setPosition: PropTypes.func.isRequired,
  };

  return (
    <div className="flex flex-wrap justify-start gap-4">
      {showCreateDeviceButton && (
        <button
          className="text-lg py-2 px-4 md:px-12 w-full sm:w-auto rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 shadow-md transform transition duration-300 hover:scale-105"
          onClick={() => setShowModal(true)}
        >
          Create Device
        </button>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div className="bg-white p-5 rounded-lg" onClick={(e) => e.stopPropagation()} style={{ zIndex: 2000 }}>
            <h2 className="mb-4 text-black">Create New Device</h2>
            <label className="block text-black mb-2">Name:</label>
            <input className="border rounded mb-2 p-1 w-full" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />

            <label className="block text-black mb-2">Location:</label>
            <input className="border rounded mb-2 p-1 w-full" value={location} onChange={(e) => setLocation(e.target.value)} />

            <label className="block text-black mb-2">Coordinate:</label>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%", marginBottom: "1rem" }}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <DraggableMarker position={position} setPosition={setPosition} />
            </MapContainer>

            <div className="my-2 text-black">
              Selected Coordinate: Latitude: {latitude}, Longitude: {longitude}
            </div>

            <div className="flex justify-between mt-4">
              <button className="py-1 px-4 bg-blue-500 text-white rounded" onClick={handleCreateDevice}>
                Submit
              </button>
              <button className="py-1 px-4 bg-red-500 text-white rounded" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {devices.map((device, index) => (
        <Link
          key={index}
          to={`/device/${device.deviceId}`}
          className={`text-lg py-2 px-6 min-w-[175px] text-center md:px-12 w-full md:w-auto rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
            activeDevice === device.deviceId ? "bg-purple-500 text-white" : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setActiveDevice(device.deviceId)}
        >
          {device.name}
        </Link>
      ))}
    </div>
  );
}
