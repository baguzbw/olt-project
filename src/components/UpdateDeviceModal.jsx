import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const UpdateDeviceModal = ({ device, setShowModal, setDeviceData, API_BASE_URL }) => {
  const [deviceName, setDeviceName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
      setLocation(device.location);
      setLatitude(device.latitude);
      setLongitude(device.longitude);
    }
  }, [device]);

  const handleUpdateDevice = () => {
    const devicePayload = {
      name: deviceName,
      location: location,
      latitude: latitude,
      longitude: longitude,
    };
    const apiKey = Cookies.get("token");

    axios
      .patch(`${API_BASE_URL}device/update/${device.deviceId}`, devicePayload, {
        params: {
          apiKey: apiKey,
        },
      })
      .then((response) => {
        console.log("Update successful:", response.data);
        setDeviceData((prevData) => prevData.map((d) => (d.deviceId === device.deviceId ? { ...d, ...response.data } : d)));
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating device:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 " style={{ zIndex: 1000 }}>
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg text-black font-bold mb-4">Update Device</h2>
        <label className="block text-black mb-2">Name:</label>
        <input className="border p-2 w-full mb-4" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
        <label className="block text-black mb-2">Location:</label>
        <input className="border p-2 w-full mb-4" value={location} onChange={(e) => setLocation(e.target.value)} />
        <label className="block text-black mb-2">Latitude:</label>
        <input className="border p-2 w-full mb-4" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <label className="block text-black mb-2">Longitude:</label>
        <input className="border p-2 w-full mb-4" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        <div className="flex justify-end gap-4">
          <button className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleUpdateDevice}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

UpdateDeviceModal.propTypes = {
  device: PropTypes.shape({
    deviceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setShowModal: PropTypes.func.isRequired,
  setDeviceData: PropTypes.func.isRequired,
  API_BASE_URL: PropTypes.string.isRequired,
};

export default UpdateDeviceModal;
