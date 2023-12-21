import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const UpdateDeviceModal = ({ device, setShowModal, setDeviceData, API_BASE_URL }) => {
  const [deviceName, setDeviceName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [batteryBrand, setBatteryBrand] = useState("");
  const [voltageNominal, setVoltageNominal] = useState("");
  const [voltageTop, setVoltageTop] = useState("");
  const [voltageLow, setVoltageLow] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");

  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
      setLocation(device.location);
      setLatitude(device.latitude);
      setLongitude(device.longitude);
      setBatteryBrand(device.spec_battery?.batteryBrand);
      setVoltageNominal(device.spec_battery?.voltageNominal);
      setVoltageTop(device.spec_battery?.voltageTop);
      setVoltageLow(device.spec_battery?.voltageLow);
      setBatteryCapacity(device.spec_battery?.batteryCapacity);
    }
  }, [device]);

  const handleUpdateDevice = () => {
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
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-lg text-black font-bold mb-4">Update Device</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Name and Location */}
          <div>
            <label className="block text-black mb-2">Name:</label>
            <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
          </div>
          <div>
            <label className="block text-black mb-2">Location:</label>
            <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          {/* Latitude and Longitude */}
          <div>
            <label className="block text-black mb-2">Latitude:</label>
            <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <div>
            <label className="block text-black mb-2">Longitude:</label>
            <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>

          {/* Battery Brand and Battery Capacity */}
          <div>
            <label className="block text-black mb-2">Battery Brand:</label>
            <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={batteryBrand} onChange={(e) => setBatteryBrand(e.target.value)} />
          </div>
          <div>
            <label className="block text-black mb-2">Battery Capacity:</label>
            <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={batteryCapacity} onChange={(e) => setBatteryCapacity(e.target.value)} />
          </div>

          {/* Voltage Nominal, Voltage Top, Voltage Low */}
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-black mb-2">Voltage Nominal:</label>
                <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={voltageNominal} onChange={(e) => setVoltageNominal(e.target.value)} />
              </div>
              <div>
                <label className="block text-black mb-2">Voltage Top:</label>
                <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={voltageTop} onChange={(e) => setVoltageTop(e.target.value)} />
              </div>
              <div>
                <label className="block text-black mb-2">Voltage Low:</label>
                <input className="border text-black rounded mb-2 p-2 w-full bg-white" value={voltageLow} onChange={(e) => setVoltageLow(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
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
    spec_battery: PropTypes.shape({
      batteryBrand: PropTypes.string,
      voltageNominal: PropTypes.number,
      voltageTop: PropTypes.number,
      voltageLow: PropTypes.number,
      batteryCapacity: PropTypes.number,
    }),
  }).isRequired,
  setShowModal: PropTypes.func.isRequired,
  setDeviceData: PropTypes.func.isRequired,
  API_BASE_URL: PropTypes.string.isRequired,
};

export default UpdateDeviceModal;
