import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { isAdmin } from "./Auth";
import Navbar from "./Navbar";
import UpdateDeviceModal from "./UpdateDeviceModal";

const Home = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);

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
      .get(`${API_BASE_URL}device/all`, {
        params: {
          apiKey: apiKey,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setDeviceData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching device data:", error);
      });
  }, [id]);

  return (
    <div className="h-screen w-screen font-poppins">
      <Navbar />
      <div className="flex flex-col justify-center p-4">
        {deviceData.length > 0 && (
          <>
            <div className="mt-4 mb-8">
              <MapContainer className="rounded-xl" center={[parseFloat(deviceData[0].latitude), parseFloat(deviceData[0].longitude)]} zoom={12} style={{ height: "400px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>' />
                {deviceData.map((device) => (
                  <Marker key={device.deviceId} position={[parseFloat(device.latitude), parseFloat(device.longitude)]}>
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
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full rounded-xl bg-white shadow-md overflow-hidden border-collapse">
                <thead>
                  <tr className="text-left text-gray-700 uppercase bg-gray-100">
                    <th className="px-6 py-3">Device ID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">API KEY</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Latitude</th>
                    <th className="px-6 py-3">Longitude</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700  divide-gray-200">
                  {deviceData.map((device, index) => (
                    <tr key={device.deviceId} className={`bg-white ${index % 2 === 0 ? "bg-opacity-50" : ""} hover:bg-gray-50`}>
                      <td className="px-6 py-4">{device.deviceId}</td>
                      <td className="px-6 py-4">{device.name}</td>
                      <td className="px-6 py-4">{device.apiKey}</td>
                      <td className="px-6 py-4">{device.location}</td>
                      <td className="px-6 py-4">{device.latitude}</td>
                      <td className="px-6 py-4">{device.longitude}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        {isAdmin() && (
                          <>
                            <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => handleEdit(device)} />
                            <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(device.deviceId)} />
                          </>
                        )}
                        <Link to={`/device/${device.deviceId}`} className="text-green-500 hover:text-green-700">
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showUpdateModal && <UpdateDeviceModal device={currentDevice} setShowModal={setShowUpdateModal} setDeviceData={setDeviceData} API_BASE_URL={API_BASE_URL} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
