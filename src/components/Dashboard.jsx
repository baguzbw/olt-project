import { faClock, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState({ name: "", deviceId: "", apiKey: "" });
  const [sensorData, setSensorData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const fetchData = useCallback(() => {
    axios
      .get(`${API_BASE_URL}device/all`)
      .then((allDevicesResponse) => {
        const device = allDevicesResponse.data.data.find((d) => d.deviceId === id);
        if (device) {
          const deviceApiKey = device.apiKey;
          setDeviceData(device);
          setIsSwitchOn(device.status);
          axios
            .get(`${API_BASE_URL}device/get/${id}`, { params: { apiKey: deviceApiKey } })
            .then((deviceResponse) => {
              if (deviceResponse.data && deviceResponse.data.data) {
                setDeviceData(deviceResponse.data.data);
              }
            })
            .catch((error) => console.error("Error fetching device data:", error));

          axios
            .get(`${API_BASE_URL}sensor/get/${id}`, { params: { apiKey: deviceApiKey } })
            .then((sensorResponse) => {
              if (sensorResponse.data && Array.isArray(sensorResponse.data.data)) {
                setSensorData(sensorResponse.data.data);
                setLastUpdated(new Date());
              }
            })
            .catch((error) => console.error("Error fetching sensor data:", error));
        }
      })
      .catch((error) => {
        console.error("Error fetching all devices data:", error);
      });
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const goToSensorDetail = (sensorType) => {
    navigate(`/sensor-detail/${sensorType}`, { state: { sensorData, sensorType } });
  };

  const findLatestData = (sensorType) => {
    const latestEntry = sensorData[0] || {};
    return latestEntry[sensorType] || "0.0";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const toggleSwitch = () => {
    const newStatus = !isSwitchOn;
    setIsSwitchOn(newStatus);
    const apiKey = deviceData.apiKey;

    axios
      .patch(`${API_BASE_URL}relay/update/${id}`, { status: newStatus }, { params: { apiKey } })
      .then((response) => {
        if (response.data && response.data.data) {
          setIsSwitchOn(response.data.data.status);
        }
      })
      .catch((error) => {
        console.error("Error updating device status:", error);
        setIsSwitchOn(!newStatus);
      });
  };

  return (
    <div className="h-screen w-screen bg-gray-200 p-6 overflow-hidden shadow-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 mb-4">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-3 rounded-xl text-white text-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white p-2">
                  <h2 className="font-bold text-2xl text-white mb-4">{deviceData.name}</h2>
                  <div className="switch-container mb-2">
                    <label htmlFor="toggle" className="cursor-pointer">
                      <div className="relative">
                        {/* Switch */}
                        <input id="toggle" type="checkbox" className="sr-only" checked={isSwitchOn} onChange={toggleSwitch} />
                        <div className={`block w-14 h-8 rounded-full transition duration-300 ease-in-out ${isSwitchOn ? "bg-green-500" : "bg-gray-700"}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transform transition duration-300 ease-in-out ${isSwitchOn ? "translate-x-6" : ""}`}></div>
                      </div>
                    </label>
                  </div>
                  <span className="text-sm">Device ID :</span>
                  <div className="flex items-center text-white font-semibold">
                    <span className="text-base">{deviceData.deviceId}</span>
                  </div>
                  <span className="text-sm">API Key :</span>
                  <div className="flex items-center">
                    <span className="text-base font-semibold text-white">{deviceData.apiKey}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 text-sm text-right">
                <div className="items-center mb-2">
                  <span className="text-sm text-right">
                    {deviceData.latitude}, {deviceData.longitude}
                  </span>
                  <FontAwesomeIcon className="ms-2 " icon={faMapMarkerAlt} />
                </div>
                <div className="items-center mt-3">
                  <span className="text-sm text-end">Last Updated</span>
                  <FontAwesomeIcon className="ms-2 text-sm" icon={faClock} />
                </div>
                <div className="mt-1 text-base font-semibold ">{lastUpdated ? ` ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${formatDate(lastUpdated)} ` : "Loading..."}</div>
              </div>
            </div>
          </div>
        </div>
        <div onClick={() => goToSensorDetail("suhu")} className="cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-600 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Suhu</p>
          <p className="text-4xl font-semibold">{findLatestData("suhu")} C</p>
        </div>
        <div onClick={() => goToSensorDetail("kelembapan")} className="bg-gradient-to-br from-orange-700 to-red-600 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Kelembapan</p>
          <p className="text-4xl font-semibold">{findLatestData("kelembapan")} Rh</p>
        </div>
        <div onClick={() => goToSensorDetail("daya")} className="bg-gradient-to-br from-red-500 to-pink-500 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Daya</p>
          <p className="text-4xl font-semibold">{findLatestData("daya")} W</p>
        </div>
        <div onClick={() => goToSensorDetail("tegangan")} className="bg-gradient-to-br from-green-500 to-teal-500 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Tegangan</p>
          <p className="text-4xl font-semibold">{findLatestData("tegangan")} V</p>
        </div>
        <div onClick={() => goToSensorDetail("arus")} className="bg-gradient-to-br from-blue-800 to-blue-300 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Arus</p>
          <p className="text-4xl font-semibold">{findLatestData("arus")} A</p>
        </div>
        <div onClick={() => goToSensorDetail("energi")} className="bg-gradient-to-br from-yellow-500 to-amber-500 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Energi</p>
          <p className="text-4xl font-semibold">{findLatestData("energi")} Wh</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
