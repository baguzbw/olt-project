import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { isAdmin, isAuthenticated } from "./Auth";
import Navbar from "./Navbar";
import UpdateDeviceModal from "./UpdateDeviceModal";

const Home = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [batteryBrand, setBatteryBrand] = useState("");
  const [voltageNominal, setVoltageNominal] = useState("");
  const [voltageTop, setVoltageTop] = useState("");
  const [voltageLow, setVoltageLow] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [position, setPosition] = useState([-7.5634, 110.8559]);
  const [showModal, setShowModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [devices, setDevices] = useState([]);

  const handleDelete = (deviceId) => {
    const apiKey = Cookies.get("token");

    const confirmDelete = window.confirm("Are you sure you want to delete this device?");
    if (confirmDelete) {
      axios
        .delete(`${API_BASE_URL}device/remove/${deviceId}`, {
          params: {
            apiKey: apiKey,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setDeviceData((prevData) => prevData.filter((device) => device.deviceId !== deviceId));
          }
        })
        .catch((error) => {
          console.error("Error deleting device:", error);
          alert("Failed to delete the device. Please try again.");
        });
    }
  };

  const handleEdit = (device) => {
    setCurrentDevice(device);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    const apiKey = Cookies.get("token");
    axios
      .get(`${API_BASE_URL}device/all?apiKey=${apiKey}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setDeviceData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching device data:", error);
      });
  }, [id]);

  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  DraggableMarker.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    setPosition: PropTypes.func.isRequired,
  };

  const showCreateDeviceButton = isAuthenticated() && isAdmin();

  const handleCreateDevice = () => {
    const devicePayload = {
      name: deviceName,
      location: location,
      latitude: latitude,
      longitude: longitude,
      batteryBrand: batteryBrand,
      voltageNominal: voltageNominal,
      voltageTop: voltageTop,
      voltageLow: voltageLow,
      batteryCapacity: batteryCapacity,
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
        setBatteryBrand("");
        setVoltageNominal("");
        setVoltageTop("");
        setVoltageLow("");
        setBatteryCapacity("");
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

    return <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} icon={customIcon} />;
  }

  return (
    <div className="h-screen w-screen font-poppins">
      <Navbar />
      <div className="flex flex-col justify-center p-4">
        <div className="mt-4 mb-4">
          <MapContainer className="rounded-xl" center={[-7.556, 110.831]} zoom={8} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {deviceData.map((device) => (
              <Marker key={device.deviceId} position={[parseFloat(device.latitude), parseFloat(device.longitude)]} icon={customIcon}>
                <Popup>
                  Nama : {device.name}
                  <div>
                    <Link to={`/device/${device.deviceId}`}>See Details</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {showCreateDeviceButton && (
          <div className="text-left mb-2">
            <button
              className="py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 rounded-md text-base text-white shadow-md transform transition duration-300 hover:scale-105"
              onClick={() => setShowModal(true)}
            >
              Create Device
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 1000 }} onClick={() => setShowModal(false)}>
            <div className="bg-white p-5 rounded-lg" onClick={(e) => e.stopPropagation()} style={{ zIndex: 2000 }}>
              <h2 className="text-lg text-black font-bold mb-4">Create New Device</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black mb-2">Name:</label>
                  <input className="border text-black rounded mb-2 p-1 w-full bg-white" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
                </div>

                <div>
                  <label className="block text-black mb-2">Location:</label>
                  <input className="border text-black rounded mb-2 p-1 w-full bg-white" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black mb-2">Battery Brand:</label>
                  <input className="border text-black rounded mb-2 p-1 w-full bg-white" value={batteryBrand} onChange={(e) => setBatteryBrand(e.target.value)} />
                </div>
                <div>
                  <label className="block text-black mb-2">Battery Capacity:</label>
                  <input className="border text-black rounded mb-2 p-1 w-full bg-white" value={batteryCapacity} onChange={(e) => setBatteryCapacity(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-black mb-2">Voltage Nominal:</label>
                  <input className="border text-black rounded mb-2 p-1 w-full bg-white" value={voltageNominal} onChange={(e) => setVoltageNominal(e.target.value)} />
                </div>
                <div>
                  <label className="block text-black mb-2">Voltage Top:</label>
                  <input className="border text-black rounded mb-2 p-1 w-full bg-white" value={voltageTop} onChange={(e) => setVoltageTop(e.target.value)} />
                </div>
                <div>
                  <label className="block text-black mb-2">Voltage Low:</label>
                  <input className="border text-black rounded mb-2 p-1 w-full bg-white" value={voltageLow} onChange={(e) => setVoltageLow(e.target.value)} />
                </div>
              </div>

              <label className="block text-black mb-2">Coordinate:</label>
              <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%", marginBottom: "1rem" }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker position={position} setPosition={setPosition} icon={customIcon} />
              </MapContainer>

              <div className="my-2 text-black">
                Selected Coordinate: Latitude: {latitude}, Longitude: {longitude}
              </div>

              <div className="flex justify-end gap-4">
                <button className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleCreateDevice}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full rounded-xl bg-white shadow-md overflow-hidden border-collapse">
            <thead>
              <tr className="text-left text-gray-700 uppercase bg-gray-100">
                <th className="px-6 py-3">Device ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Latitude</th>
                <th className="px-6 py-3">Longitude</th>
                <th className="px-6 py-3">Battery Brand</th>
                <th className="px-6 py-3">Battery Capacity</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700 divide-gray-200">
              {deviceData.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-700">
                    No data available.
                  </td>
                </tr>
              )}
              {deviceData.map((device, index) => (
                <tr key={device.deviceId} className={`bg-white ${index % 2 === 0 ? "bg-opacity-50" : ""} hover:bg-gray-50`}>
                  <td className="px-6 py-4">{device.deviceId}</td>
                  <td className="px-6 py-4">{device.name}</td>
                  <td className="px-6 py-4">{device.location}</td>
                  <td className="px-6 py-4">{device.latitude}</td>
                  <td className="px-6 py-4">{device.longitude}</td>
                  <td className="px-6 py-4">{device.spec_battery?.batteryBrand}</td>
                  <td className="px-6 py-4">{device.spec_battery?.batteryCapacity}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {isAdmin() && (
                      <>
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => handleEdit(device)} />
                        <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(device.deviceId)} />
                      </>
                    )}
                    <Link to={`/device/${device.deviceId}`} className="text-green-500 hover-text-green-700">
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showUpdateModal && <UpdateDeviceModal device={currentDevice} setShowModal={setShowUpdateModal} setDeviceData={setDeviceData} API_BASE_URL={API_BASE_URL} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
